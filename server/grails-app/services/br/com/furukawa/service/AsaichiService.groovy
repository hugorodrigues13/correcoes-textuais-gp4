package br.com.furukawa.service

import br.com.furukawa.dtos.asaichi.ApontamentoMensal
import br.com.furukawa.dtos.asaichi.ApontamentoMensalPorLinhaEProduto
import br.com.furukawa.dtos.asaichi.AsaichiProducaoDefeitosMensal
import br.com.furukawa.dtos.asaichi.GraficoAsaichiDefeitoDTO

import br.com.furukawa.dtos.asaichi.GraficoDadoAsaichiDefeitoDTO
import br.com.furukawa.dtos.asaichi.GraficoDadoAsaichiProducaoDiariaDTO
import br.com.furukawa.dtos.asaichi.GraficoDadoAsaichiProducaoMensalDTO
import br.com.furukawa.dtos.asaichi.GraficoDadoAsaichiProducaoSemanalDTO
import br.com.furukawa.dtos.asaichi.TabelaDadoAsaichiDefeitoDTO
import br.com.furukawa.dtos.asaichi.TabelaDadoAsaichiProducaoDTO
import br.com.furukawa.dtos.asaichi.TabelaDadoAsaichiProdutividadeDTO
import br.com.furukawa.dtos.filtros.FiltroApontamentoMensal
import br.com.furukawa.dtos.filtros.FiltroAsaichi
import br.com.furukawa.dtos.filtros.FiltroProducao
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Meta
import br.com.furukawa.model.PlanejamentoDiario
import br.com.furukawa.utils.DateUtils
import grails.gorm.transactions.Transactional
import groovy.json.JsonOutput
import groovy.time.TimeCategory
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.IntegerType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import javax.persistence.Query
import java.sql.Time
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.concurrent.TimeUnit

@Transactional
class AsaichiService {

    SessionFactory sessionFactory

    List<String> getLinhasDeProducao(String dia, Fornecedor fornecedor) {
        String sql = """SELECT lp.nome
                        FROM   gp40.historico_apontamento hist
                           JOIN gp40.linha_de_producao lp
                             ON lp.id = (SELECT apo.linha_de_producao_id
                                         FROM   gp40.apontamento apo
                                         WHERE  apo.id = hist.apontamento_id)
                    WHERE  1 = 1
                           and hist.data between trunc(to_date('${dia}', 'DD/MM/YYYY')) and trunc(to_date('${dia}', 'DD/MM/YYYY')+1)
                           AND lp.fornecedor_id = ${fornecedor?.id}
                    GROUP  BY lp.nome """

        return sessionFactory.currentSession.createSQLQuery(sql).list()?.sort()
    }

    List<TabelaDadoAsaichiProducaoDTO> getTabelaProducao(FiltroAsaichi filtro) {
        List<GraficoDadoAsaichiProducaoDiariaDTO> dadosDoDia = buscaTotalApontamentosDoDiaPorTurno(filtro, false, true)

        List<TabelaDadoAsaichiProducaoDTO> dados = dadosDoDia.collect {
            new TabelaDadoAsaichiProducaoDTO(it)
        }

        TabelaDadoAsaichiProducaoDTO total = new TabelaDadoAsaichiProducaoDTO(key: 'total', plano: dados.sum({it.plano}) ?: 0, real: dados.sum({it.real}) ?: 0)
        total.porcentagem = !total.plano ? 0 : ((total.real ?: 0) / (total.plano) * 100).round(2)

        dados.add(total)
        return dados

    }

    List<TabelaDadoAsaichiProdutividadeDTO> getTabelaProdutividade(FiltroAsaichi filtro) {
        List<GraficoDadoAsaichiProducaoDiariaDTO> dadosDoDia = buscaTotalApontamentosDoDiaPorTurno(filtro, false, true)

        Meta meta = getMetaDoDia(filtro, FiltroAsaichi.SDF().format(filtro.data))
        List<TabelaDadoAsaichiProdutividadeDTO> dados = dadosDoDia.collect {dado ->
            List planejamento = getPlanejamentoDoDia(filtro, dado.turno)
            PlanejamentoDiario planejamentoDiario = planejamento ? planejamento[0] as PlanejamentoDiario : null
            Integer horas = planejamento ? planejamento[1] as Integer : null
            new TabelaDadoAsaichiProdutividadeDTO(dado, planejamentoDiario, horas, meta)
        }

        TabelaDadoAsaichiProdutividadeDTO total = new TabelaDadoAsaichiProdutividadeDTO(
                key: 'total',
                planoPessoas: dados.sum {it.planoPessoas ?: 0},
                produtividadePlanejado: dados.sum {it.produtividadePlanejado ?: 0},
                pessoasTreinamento: dados.sum {it.pessoasTreinamento ?: 0},
                pessoasHabilitadas: dados.sum {it.pessoasHabilitadas ?: 0},
                produtividadeReal: dados.sum {it.produtividadeReal ?: 0},
                metaHK: dados.sum {it.metaHK ?: 0})
        dados.add(total)

        return dados
    }

    List<TabelaDadoAsaichiDefeitoDTO> getTabelaDefeitos(FiltroAsaichi filtro) {
        List<GraficoDadoAsaichiProducaoDiariaDTO> dadosDoDia = buscaTotalApontamentosDoDiaPorTurno(filtro, false, false)
        List<GraficoDadoAsaichiProducaoDiariaDTO> defeitosDoDia = buscaTotalApontamentosDoDiaPorTurno(filtro, true, false)

        List<TabelaDadoAsaichiDefeitoDTO> dados = dadosDoDia.collect {dado ->
            new TabelaDadoAsaichiDefeitoDTO(dado, defeitosDoDia.find {it.turno == dado.turno}?.produzido)
        }

        TabelaDadoAsaichiDefeitoDTO total = new TabelaDadoAsaichiDefeitoDTO(key: 'total', meta: dados.sum({it.meta}) ?: 0, qtde: dados.sum({it.qtde}) ?: 0, total: dados.sum {it.total})
        total.porcentagem = ((total.qtde ?: 0) / (total.total ?: 1) * 100).round(2)
dados.sort{it.key}
        dados.add(total)
        return dados
    }

    List<GraficoDadoAsaichiProducaoSemanalDTO> getGraficoProducaoSemanal(FiltroAsaichi filtro){
        Date primeiroDia = new Date(filtro.data.getTime() - TimeUnit.DAYS.toMillis(7 - 1))

        List<GraficoDadoAsaichiProducaoSemanalDTO> dados = new ArrayList<>()

        use( TimeCategory ) {
            filtro.data = filtro.data + 1.day
        }

        7.times {
            use( TimeCategory ) {
                filtro.data = filtro.data - 1.day
            }

            List<GraficoDadoAsaichiProducaoDiariaDTO> dadosDoDia = buscaTotalApontamentosDoDiaPorTurno(filtro, false, true)
            String data = FiltroAsaichi.SDF().format(filtro.data)
            dados.addAll(dadosDoDia.collect {
                new GraficoDadoAsaichiProducaoSemanalDTO(it, data)
            })
        }


        preencher(dados, 'turno', primeiroDia, 7, {key, dia -> new GraficoDadoAsaichiProducaoSemanalDTO(turno: key, dia: dia, previsto: 0, produzido: 0)})

        return dados.sort({FiltroAsaichi.SDF().parse(it.dia)})
    }

    List<GraficoDadoAsaichiProducaoDiariaDTO> getGraficoProducaoDiaria(FiltroAsaichi filtro){
        return buscaTotalApontamentosDoDiaPorTurno(filtro, false, true)
    }

    List<GraficoDadoAsaichiProducaoMensalDTO> getGraficoProducaoMensal(FiltroAsaichi filtro){
        GraficoDadoAsaichiProducaoDiariaDTO dadosDoDia = buscaTotalApontamentosDoDia(filtro, false, false)
        GraficoDadoAsaichiProducaoDiariaDTO defeitosDoDia = buscaTotalApontamentosDoDia(filtro, true, false)
        String data = FiltroAsaichi.SDF().format(filtro.data)

        List<GraficoDadoAsaichiProducaoMensalDTO> dados = new ArrayList<>()
        List<AsaichiProducaoDefeitosMensal> producaoDefeitosMensal = getApontamentosDoMes(filtro)

        if(filtro.filtroDataDeHoje()) {
            Meta meta = getMetaDoDia(filtro, data)
            dados.add(new GraficoDadoAsaichiProducaoMensalDTO(dadosDoDia.previsto, dadosDoDia.produzido, data, defeitosDoDia.produzido, meta))
            producaoDefeitosMensal.removeIf {it.dia == data}
        }

        producaoDefeitosMensal.each {
            Meta meta = getMetaDoDia(filtro, it.dia)
            List<PlanejamentoDiario> planejamentosDoDia = getPlanejamentosDoDia(filtro, it.dia)

            dados.add(new GraficoDadoAsaichiProducaoMensalDTO(
                    planejamentosDoDia*.quantidadePlanejadaPecas.sum() ?:0 ,
                    it.produzido, it.dia, it.defeitos, meta))
        }

        Date primeiroDia = filtro.data.clone()
        primeiroDia.setDate(1)
        Integer ultimoDia = DateUtils.getUltimoDiaDoMes(primeiroDia)
        preencher(dados, null, primeiroDia, ultimoDia, {key, dia -> new GraficoDadoAsaichiProducaoMensalDTO(dia: dia, previsto: 0, acumulado: 0, metaDefeitos: 0, defeitos: 0)})

        return dados.sort({FiltroAsaichi.SDF().parse(it.dia)})
    }

    GraficoAsaichiDefeitoDTO getGraficoDefeitos(FiltroAsaichi filtro){
        String sql = filtro.isConector() ? """
            select dia, turno, defeito, sum(total) as quantidade from(
            SELECT To_char(hist.data, 'DD/MM/YYYY') dia,
                   t.nome                           turno,
                   defe.nome                        defeito,
                   nvl(Nf.Codigo_Produto, np.codigo_produto), Count(*)* ( case when max(cc1.formacao) is not null then nvl(max(nf.valor), max(np.valor))/max(cc1.formacao) else (
case when Nvl(Max(cc4.formacao), Max(cc3.formacao)) <> 0 then
(nvl(max(nf.valor), max(np.valor))/Nvl(Max(cc4.formacao), Max(cc3.formacao))) else 0 end + 
case when Nvl(Max(cc5.formacao), Max(cc2.formacao)) <> 0 then
(nvl(max(nf.valor), max(np.valor))/Nvl(Max(cc5.formacao), Max(cc2.formacao))) else 0 end) end) total
            FROM   gp40.turno t 
                   join gp40.historico_apontamento hist
                     on 1=1
                   JOIN gp40.apontamento apo
                     ON apo.id = hist.apontamento_id
                   JOIN gp40.serial_fabricacao s
                     ON s.id = apo.serial_id
                    ${getJoinConectores(filtro)} 
                   JOIN gp40.linha_de_producao lp
                     ON apo.linha_de_producao_id = lp.id
                   JOIN gp40.defeito defe
                     ON defe.id = defeito_id
                   inner JOIN (SELECT td.*
                              FROM   gp40.turno_duracao td
                                     INNER JOIN gp40.turno_duracao_dias tdd
                                             ON tdd.turno_duracao_id = td.id
                              WHERE  tdd.dia_da_semana = ( ${montaCaseDiaDaSemana(filtro)}) td
                          ON td.turno_id = t.id
            AND t.fornecedor_id=${filtro.idFornecedor}
            WHERE  hist.data BETWEEN To_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY') - 2 AND
                                          To_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY') + 1
                   AND To_date(To_char(hist.data, 'HH24:MI:SS'), 'HH24:MI:SS') BETWEEN
                           To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS') - Extract( hour FROM td.duracao) / 24 - Extract(minute FROM td.duracao) / 24 / 60
                           AND
                           To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS')
                   AND lp.nome = '${filtro.linhaProducao}' and lp.fornecedor_id=${filtro.idFornecedor}
                   AND defeito_id IS NOT NULL
            GROUP  BY To_char(hist.data, 'DD/MM/YYYY'),
                      t.nome,
                      defe.nome, nvl(Nf.Codigo_Produto, np.codigo_produto))
group by dia, turno, defeito """ : """
            SELECT To_char(hist.data, 'DD/MM/YYYY') dia,
                   t.nome                           turno,
                   defe.nome                        defeito,
                   Count(*)                         quantidade
            FROM   gp40.turno t 
                   join gp40.historico_apontamento hist
                     on 1=1
                   JOIN gp40.apontamento apo
                     ON apo.id = hist.apontamento_id
                   JOIN gp40.serial_fabricacao sf
                     ON sf.id = apo.serial_id
                   JOIN gp40.linha_de_producao lp
                     ON apo.linha_de_producao_id = lp.id
                   JOIN gp40.defeito defe
                     ON defe.id = defeito_id
                   inner JOIN (SELECT td.*
                              FROM   gp40.turno_duracao td
                                     INNER JOIN gp40.turno_duracao_dias tdd
                                             ON tdd.turno_duracao_id = td.id
                              WHERE  tdd.dia_da_semana = ( ${montaCaseDiaDaSemana(filtro)}) td
                          ON td.turno_id = t.id
            AND t.fornecedor_id=${filtro.idFornecedor}
            WHERE  hist.data BETWEEN To_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY') - 2 AND
                                          To_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY') + 1
                   AND To_date(To_char(hist.data, 'HH24:MI:SS'), 'HH24:MI:SS') BETWEEN
                           To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS') - Extract( hour FROM td.duracao) / 24 - Extract(minute FROM td.duracao) / 24 / 60
                           AND
                           To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS')
                   AND lp.nome = '${filtro.linhaProducao}' and lp.fornecedor_id=${filtro.idFornecedor}
                   AND defeito_id IS NOT NULL
            GROUP  BY To_char(hist.data, 'DD/MM/YYYY'),
                      t.nome,
                      defe.nome 
        """

        Query query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("dia", new StringType())
        query.addScalar("turno", new StringType())
        query.addScalar("defeito", new StringType())
        query.addScalar("quantidade", new LongType())

        query.setResultTransformer(Transformers.aliasToBean(GraficoDadoAsaichiDefeitoDTO.class))

        List<GraficoDadoAsaichiDefeitoDTO> dados = query.list()
        Date primeiroDia = new Date(filtro.data.getTime() - TimeUnit.DAYS.toMillis(3 - 1))
        preencher(dados, 'defeito', primeiroDia, 3, {key, dia -> new GraficoDadoAsaichiDefeitoDTO(defeito: key, dia: dia, turno: null, quantidade: 0)}, "defeito")

        GraficoAsaichiDefeitoDTO grafico = new GraficoAsaichiDefeitoDTO(dados: dados.sort({FiltroAsaichi.SDF().parse(it.dia)}))
        grafico.mediaMensal = getMediaMensal(filtro)
        return grafico
    }

    BigDecimal getMediaMensal(FiltroAsaichi filtro){
        GraficoDadoAsaichiProducaoDiariaDTO dadosDoDia = buscaTotalApontamentosDoDia(filtro, false, false)
        GraficoDadoAsaichiProducaoDiariaDTO defeitosDoDia = buscaTotalApontamentosDoDia(filtro, true, false)

        Long defeitos = defeitosDoDia?.produzido
        Long total = dadosDoDia?.produzido

        return new BigDecimal((defeitos ?: 0) / (total ?: 1) * 100).round(2)
    }

    def getPlanejamentoDoDia(FiltroAsaichi filtro, String turno) {
        String sql = """SELECT     pd.id,
                        Extract(hour FROM td.duracao)
                        FROM       gp40.turno T
                        INNER JOIN gp40.planejamento_diario pd
                        ON         t.id = pd.turno_id
                        JOIN       gp40.linha_de_producao ldp
                        ON         ldp.id = pd.linha_de_producao_id
                        inner JOIN (SELECT td.*
                              FROM   gp40.turno_duracao td
                                     INNER JOIN gp40.turno_duracao_dias tdd
                                             ON tdd.turno_duracao_id = td.id
                              WHERE  tdd.dia_da_semana = ( ${montaCaseDiaDaSemana(filtro)}) td
                          ON td.turno_id = t.id
                        WHERE      To_char(pd.data, 'DD/MM/YYYY') = '${FiltroAsaichi.SDF().format(filtro.data)}'
                        AND        ldp.nome='${filtro.linhaProducao}'
                        AND        ldp.fornecedor_id=${filtro.idFornecedor}
                        AND        t.nome='${turno}' and rownum=1"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        def resultado = query.uniqueResult()
        return resultado ? [PlanejamentoDiario.read(resultado[0] as Long), resultado[1] as Integer] : null
    }

    List<PlanejamentoDiario> getPlanejamentosDoDia(FiltroAsaichi filtro, String data) {
        PlanejamentoDiario.createCriteria().list {
            linhaDeProducao {
                eq 'nome', filtro.linhaProducao
                fornecedor {
                    eq 'id', filtro.idFornecedor
                }

                sqlRestriction "to_char(data, 'DD/MM/YYYY') = '${data}'"
            }
        }

    }

    void preencher(List dados, String propriedade, Date primeiroDia, int quantidade, Closure criarDado, String desconsiderar=null){
        Map<String, List> group = propriedade ? dados.groupBy {it."${propriedade}"} : ['': dados]
        group.each {entry ->
            String key = entry.key
            List gdados = entry.value
            if (desconsiderar){
                gdados = gdados.unique({it."${desconsiderar}"})
            }
            if (gdados.size() != quantidade){
                for (int i = 0; i < quantidade; i++){
                    Date dia = new Date(primeiroDia.getTime() + TimeUnit.DAYS.toMillis(i))
                    String diaFormatado = FiltroAsaichi.SDF().format(dia)
                    if (!gdados.any({it.dia == diaFormatado})){
                        dados.add(criarDado(key, diaFormatado))
                    }
                }
            }
        }
    }

    void atualizaDadosProducaoDefeitosMensal(String mes) {
        String sqlDelete = "delete from gp40.apont_mensal_linha_produto where mes='${mes}'"
        sessionFactory.currentSession.createSQLQuery(sqlDelete).executeUpdate()

        List<ApontamentoMensalPorLinhaEProduto> totalApontamentosDoMes = buscaApontamentoMensal(mes, false)
        List<ApontamentoMensalPorLinhaEProduto> defeitosDoMes = buscaApontamentoMensal(mes, true)
        totalApontamentosDoMes.each {tot ->
            tot.defeitos = defeitosDoMes.find {
                it.data == tot.data && it.linhaDeProducao == tot.linhaDeProducao && it.codigoProduto == tot.codigoProduto && it.idFornecedor == tot.idFornecedor
            }?.total
        }

        totalApontamentosDoMes.groupBy {
            [codigoProduto: it.codigoProduto, linhaDeProducao: it.linhaDeProducao, idFornecedor: it.idFornecedor]
        }.each {
            salvaAsaichiDefeitosMensal(it.key.codigoProduto as String, it.key.linhaDeProducao as String, it.key.idFornecedor as Long, mes, it.value)
        }
    }

    String montaSubQueryConectoresApontamentoMensal(String conector) {
        return """SELECT aml.id,
                                            ( CASE
                                                WHEN Max(cc1.formacao) IS NOT NULL THEN
                                                nvl(max(nf.valor), max(np.valor)) / Max(cc1.formacao)
                                                ELSE ( CASE WHEN Nvl(Max(cc4.formacao),
                                                       Max(cc3.formacao)) <> 0
                                                       THEN
                                                              (nvl(max(nf.valor), max(np.valor))/Nvl(Max(cc4.formacao),
                                                       Max(cc3.formacao))) ELSE
                                                       0
                                                       END + CASE WHEN Nvl(Max(
                                                              cc5.formacao), Max(cc2.formacao)) <> 0
                                                       THEN
                                                              (nvl(max(nf.valor), max(np.valor))/Nvl(Max(cc5.formacao),
                                                       Max(cc2.formacao))) ELSE
                                                       0
                                                       END )
                                              END ) multiplicador
                                     FROM   gp40.apont_mensal_linha_produto aml
                                            JOIN gp40.fornecedor f
                                              ON f.id = aml.fornecedor_id
                                            LEFT JOIN gp40.item_catalogo nf
                                                   ON nf.codigo_produto = aml.codigo_produto
                                                      AND nf.organization_id = f.organization_id
                                                      AND nf.nome = 'NUMERO DE FIBRAS'
                                         LEFT JOIN gp40.item_catalogo np
                                                      ON np.codigo_produto = aml.codigo_produto
                                                      AND np.organization_id = f.organization_id
                                                      AND np.nome = 'NUMERO DE PARES'
                                            LEFT JOIN gp40.item_catalogo c1
                                                   ON c1.codigo_produto = aml.codigo_produto
                                                      AND c1.organization_id = f.organization_id
                                                      AND c1.nome = 'TIPO DE CONECTOR'
                                            LEFT JOIN gp40.conector cc1
                                                   ON cc1.descricao = c1.valor
                                            ${conector ? "AND cc1.descricao='${conector}'" : ""}
                                            LEFT JOIN gp40.item_catalogo c2
                                                   ON c2.codigo_produto = aml.codigo_produto
                                                      AND c2.organization_id = f.organization_id
                                                      AND c2.nome = 'TIPO CONECTOR LADO B'
                                            LEFT JOIN gp40.conector cc2
                                                   ON cc2.descricao = c2.valor
                                            ${conector ? "AND cc2.descricao='${conector}'" : ""}
                                            LEFT JOIN gp40.item_catalogo c3
                                                   ON c3.codigo_produto = aml.codigo_produto
                                                      AND c3.organization_id = f.organization_id
                                                      AND c3.nome = 'TIPO CONECTOR LADO A'
                                            LEFT JOIN gp40.conector cc3
                                                   ON cc3.descricao = c3.valor
                                            ${conector ? "AND cc3.descricao='${conector}'" : ""}
                                            LEFT JOIN gp40.item_catalogo c4
                                                   ON c4.codigo_produto = aml.codigo_produto
                                                      AND c4.organization_id = f.organization_id
                                                      AND c4.nome = 'TIPO CONECTOR IN'
                                            LEFT JOIN gp40.conector cc4
                                                   ON cc4.descricao = c4.valor
                                            ${conector ? "AND cc4.descricao='${conector}'" : ""}
                                            LEFT JOIN gp40.item_catalogo c5
                                                   ON c5.codigo_produto = aml.codigo_produto
                                                      AND c5.organization_id = f.organization_id
                                                      AND c5.nome = 'TIPO CONECTOR OUT'
                                            LEFT JOIN gp40.conector cc5
                                                   ON cc5.descricao = c5.valor
                                     GROUP  BY aml.id"""
    }

    List<ApontamentoMensal> getApontamentoMensal(FiltroApontamentoMensal filtro) {
        String sql = """SELECT aml.dados as dados,
                               Nvl(multiplicador, 1) as multiplicador
                        FROM   gp40.apont_mensal_linha_produto aml
                               JOIN (${montaSubQueryConectoresApontamentoMensal(filtro.conector)}) c
                                 ON c.id = aml.id 
                        where aml.mes='${new SimpleDateFormat("MM/YY").format(filtro.data)}'
"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("dados", new StringType())
        query.addScalar("multiplicador", new IntegerType())
        query.setResultTransformer(Transformers.aliasToBean(ApontamentoMensal.class))
        return query.list() as ArrayList<ApontamentoMensal>
    }

    List<ApontamentoMensal> getApontamentoMensal(FiltroProducao filtro, Fornecedor fornecedor) {
        String sql = """SELECT dados, multiplicador, codigoProduto, grupoLinha FROM(
                        SELECT  aml.mes, 
                                aml.dados as dados,
                                aml.codigo_produto codigoProduto,
                               glp.nome AS grupoLinha,
                               Nvl(multiplicador, 1) as multiplicador
                        FROM   gp40.apont_mensal_linha_produto aml
                              INNER JOIN LINHA_DE_PRODUCAO LP ON LP.NOME = AML.LINHA_DE_PRODUCAO
                                INNER JOIN LINHA_GRUPO LG ON LG.LINHA_ID = LP.ID
                                INNER JOIN GRUPO_LINHA_PRODUCAO GLP ON GLP.ID = LG.GRUPO_ID
                               JOIN (${montaSubQueryConectoresApontamentoMensal(null)}) c
                                 ON c.id = aml.id 
                        where aml.fornecedor_id = ${fornecedor.id}
                        ) ${filtro.gerarWhere()}
        """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("dados", new StringType())
        query.addScalar("multiplicador", new IntegerType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("grupoLinha", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(ApontamentoMensal.class))
        return query.list() as ArrayList<ApontamentoMensal>
    }

    List<AsaichiProducaoDefeitosMensal> getApontamentosDoMes(FiltroAsaichi filtro) {
        List<ApontamentoMensal> apontamentosMes = getApontamentoMensal(new FiltroApontamentoMensal(filtro))

        apontamentosMes.collect {
            it.getDadosFormatados(filtro)
        }.flatten().groupBy {it.dia}.collect {
            new AsaichiProducaoDefeitosMensal(dia: it.key, produzido: it.value*.produzido.sum(), defeitos: it.value*.defeitos.sum())
        }
    }

    void salvaAsaichiDefeitosMensal(String codigoProduto, String linhaDeProducao, Long idFornecedor, String mes, List<ApontamentoMensalPorLinhaEProduto> apontamentos) {
        String json = JsonOutput.toJson(apontamentos.collect {
            new AsaichiProducaoDefeitosMensal(it)
        })

        String sql = """
            insert into gp40.apont_mensal_linha_produto(id, mes, codigo_produto, linha_de_producao, fornecedor_id, ultima_atualizacao, dados)
            (SELECT GP40.apont_mensal_linha_prod_seq.nextVal, 
            '${mes}', 
            '${codigoProduto}', 
            '${linhaDeProducao}', 
            ${idFornecedor}, 
            sysdate,
            to_clob('${json}')
            FROM DUAL)
        """

        sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
    }

    List<ApontamentoMensalPorLinhaEProduto> buscaApontamentoMensal(String mes, boolean defeitos) {
        String sql = """
        SELECT To_char(cs.dt, 'DD/MM/YYYY') data,
               lp.nome linhaDeProducao,
               f.id idFornecedor,
               ofa.codigo_produto codigoProduto,
               count(hist.id) total
                 
            from (
                  select trunc(to_date('${mes}', 'MM/YY'), 'MM')  + level - 1 dt
                from   dual
                connect by level <= (
                  last_day(to_date('${mes}', 'MM/YY')) - trunc(to_date('${mes}', 'MM/YY'), 'MM') + 1
                )) cs 
                INNER JOIN GP40.TURNO T ON 1=1
                inner JOIN (SELECT td.turno_id,
                td.horario_final, td.duracao,
                 case tdd.dia_da_semana 
                              when 'DOMINGO' THEN 1
                              WHEN 'SEGUNDA' THEN 2
                              WHEN 'TERCA' THEN 3
                              WHEN 'QUARTA' THEN 4
                              WHEN 'QUINTA' THEN 5
                              WHEN 'SEXTA' THEN 6
                              WHEN 'SABADO' THEN 7 END as ds
                              FROM   gp40.turno_duracao td
                                     INNER JOIN gp40.turno_duracao_dias tdd
                                             ON tdd.turno_duracao_id = td.id
                              ) td
                          ON td.turno_id = t.id
                          and to_char(cs.dt, 'D')=td.ds
                          
                          join gp40.historico_apontamento hist on 1=1
                                       JOIN gp40.apontamento apo
                                         ON apo.id = hist.apontamento_id
                                       JOIN gp40.linha_de_producao lp
                                         ON lp.id = apo.linha_de_producao_id
                                       JOIN gp40.serial_fabricacao sf
                                         ON sf.id = apo.serial_id
                                       JOIN gp40.ordem_de_fabricacao ofa
                                         ON ofa.id = sf.ordem_de_fabricacao_id
                                       JOIN gp40.fornecedor f
                                         ON f.id = ofa.fornecedor_id
                                         
                        where ${defeitos ? "hist.defeito_id is not null AND" : ""} 
                        t.fornecedor_id=f.id and
                        to_char(hist.data, 'MM/YY')='${mes}' and
                        hist.data between trunc(cs.dt-1) and trunc(cs.dt+1) and
                        hist.data BETWEEN
                           to_date(to_char(cs.dt, 'DD/MM/YYYY') || ' '
                                     || to_char(td.horario_final, 'HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS') - extract(hour FROM td.duracao)/24 - extract(minute FROM td.duracao)/24/60
                 AND       to_date(to_char(cs.dt, 'DD/MM/YYYY') || ' '
                                     || to_char(td.horario_final, 'HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS') group by To_char(cs.dt, 'DD/MM/YYYY'), lp.nome, f.id, ofa.codigo_produto
 """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("total", new LongType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("linhaDeProducao", new StringType())
        query.addScalar("idFornecedor", new LongType())
        query.addScalar("data", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(ApontamentoMensalPorLinhaEProduto.class))

        return query.list()
    }

    GraficoDadoAsaichiProducaoDiariaDTO buscaTotalApontamentosDoDia(FiltroAsaichi filtro, boolean defeitos, boolean ultimoProcesso) {
        List<GraficoDadoAsaichiProducaoDiariaDTO> dadosPorTurno = buscaTotalApontamentosDoDiaPorTurno(filtro, defeitos, ultimoProcesso)

        return new GraficoDadoAsaichiProducaoDiariaDTO(produzido: dadosPorTurno.sum {it.produzido},
                previsto: dadosPorTurno.sum {it.previsto})
    }

    List<GraficoDadoAsaichiProducaoDiariaDTO> buscaTotalApontamentosDoDiaPorTurno(FiltroAsaichi filtro, boolean defeitos, boolean ultimoProcesso) {
        String sql = """
                SELECT distinct t.nome as turno,
                   (${montaApontamentosSql(filtro, defeitos, ultimoProcesso)}) as produzido,
                    nvl(pd.QUANTIDADE_PLANEJADA_PECAS, 0) as previsto
            FROM gp40.TURNO t
                JOIN gp40.LINHA_DE_PRODUCAO ldp
                                on ldp.nome = '${filtro.linhaProducao}'
                                and ldp.fornecedor_id=${filtro.idFornecedor}
                                AND VERSAO=(SELECT max(versao)
                                      FROM   gp40.linha_de_producao
                                      WHERE  nome='${filtro.linhaProducao}'
                                      AND    fornecedor_id=${filtro.idFornecedor})
                        LEFT JOIN gp40.PLANEJAMENTO_DIARIO pd
                         ON ldp.id = pd.LINHA_DE_PRODUCAO_ID
                           and t.id = pd.TURNO_ID
                           AND to_char(pd.DATA, 'DD/MM/YYYY') = '${FiltroAsaichi.SDF().format(filtro.data)}'
                
                     inner JOIN (select td.* from gp40.TURNO_DURACAO td
                    inner join gp40.turno_duracao_dias tdd on tdd.turno_duracao_id=td.id 
                    where tdd.dia_da_semana=(${montaCaseDiaDaSemana(filtro)}) td
                        ON td.TURNO_ID = t.id
                where t.fornecedor_id=${filtro.idFornecedor}
            ORDER BY t.nome
        """

        Query query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("turno", new StringType())
        query.addScalar("previsto", new LongType())
        query.addScalar("produzido", new LongType())

        query.setResultTransformer(Transformers.aliasToBean(GraficoDadoAsaichiProducaoDiariaDTO.class))

        return query.list()
    }

    String montaApontamentosSql(FiltroAsaichi filtro, boolean defeitos, boolean ultimoProcesso) {
        return filtro.isConector() ? """
            SELECT Nvl(Sum(total), 0)
            FROM  (
                 SELECT    nvl(Nf.Codigo_Produto, np.codigo_produto),
                           Count(*)* ( case when max(cc1.formacao) is not null then nvl(max(nf.valor), max(np.valor))/max(cc1.formacao)
else (
case when Nvl(Max(cc4.formacao), Max(cc3.formacao)) <> 0 then
(nvl(max(nf.valor), max(np.valor))/Nvl(Max(cc4.formacao), Max(cc3.formacao))) else 0 end + 
case when Nvl(Max(cc5.formacao), Max(cc2.formacao)) <> 0 then
(nvl(max(nf.valor), max(np.valor))/Nvl(Max(cc5.formacao), Max(cc2.formacao))) else 0 end) end) total
                 ${ ultimoProcesso ? """
                 FROM      gp40.serial_fabricacao s
                 JOIN      gp40.apontamento apo
                 ON        s.id = apo.serial_id""" : """
                 FROM      gp40.historico_apontamento hist 
                 JOIN GP40.APONTAMENTO APO 
                 ON APO.ID=HIST.APONTAMENTO_ID
                 JOIN GP40.SERIAL_FABRICACAO S
                 ON S.ID=APO.SERIAL_ID"""}
                 ${getJoinConectores(filtro)}
                 WHERE     apo.linha_de_producao_id IN
                           (
                                  SELECT id
                                  FROM   gp40.linha_de_producao
                                  WHERE  nome='${filtro.linhaProducao}'
                                  AND    fornecedor_id=${filtro.idFornecedor})
                  AND ${ultimoProcesso ? "s.data_ultimo_apontamento" : "hist.data"} 
                    between trunc(to_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY')-1) 
                    and trunc(to_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY')+1)
                 AND       ${ultimoProcesso ? "s.data_ultimo_apontamento" : "hist.data"} BETWEEN to_date('${FiltroAsaichi.SDF().format(filtro.data)} '
                                     || to_char(td.horario_final, 'HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS') - extract(hour FROM td.duracao)/24 - extract(minute FROM td.duracao)/24/60
                 AND       to_date('${FiltroAsaichi.SDF().format(filtro.data)} '
                                     || to_char(td.horario_final, 'HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS')
                                     ${defeitos ? "and hist.defeito_id is not null" : ""}
                 GROUP BY  nvl(Nf.Codigo_Produto, np.codigo_produto))
"""
                : """
              SELECT Count(*)
                ${ ultimoProcesso ? """
                 FROM      gp40.serial_fabricacao s
                 JOIN      gp40.apontamento apo
                 ON        s.id = apo.serial_id""" : """
                 FROM      gp40.historico_apontamento hist 
                 JOIN GP40.APONTAMENTO APO 
                 ON APO.ID=HIST.APONTAMENTO_ID
                 JOIN GP40.SERIAL_FABRICACAO S
                 ON S.ID=APO.SERIAL_ID"""}
                JOIN   gp40.ordem_de_fabricacao ODF
                ON     s.ordem_de_fabricacao_id = odf.id
                WHERE  apo.linha_de_producao_id IN
                       (
                              SELECT id
                              FROM   gp40.linha_de_producao
                              WHERE  nome='${filtro.linhaProducao}'
                              AND    fornecedor_id=${filtro.idFornecedor})
                AND ${ultimoProcesso ? "s.data_ultimo_apontamento" : "hist.data"} 
                    between trunc(to_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY')-1) 
                    and trunc(to_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY')+1)
                AND    ${ultimoProcesso ? "s.data_ultimo_apontamento" : "hist.data"} BETWEEN to_date('${FiltroAsaichi.SDF().format(filtro.data)} '
                              || to_char(td.horario_final, 'HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS') - extract(hour FROM td.duracao)/24 - extract(minute FROM td.duracao)/24/60
                AND    to_date('${FiltroAsaichi.SDF().format(filtro.data)} '
                              || to_char(td.horario_final, 'HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS')
                              ${defeitos ? "and hist.defeito_id is not null" : ""}
       """
    }

    String montaCaseDiaDaSemana(FiltroAsaichi filtro) {
        return """
                case to_char(to_date('${FiltroAsaichi.SDF().format(filtro.data)}', 'DD/MM/YYYY'), 'D')
                    when '1' then 'DOMINGO'
                    WHEN '2' THEN 'SEGUNDA'
                    WHEN '3' THEN 'TERCA'
                    WHEN '4' THEN 'QUARTA'
                    WHEN '5' THEN 'QUINTA'
                    WHEN '6' THEN 'SEXTA'
                    WHEN '7' THEN 'SABADO' END)
        """
    }

    String getJoinConectores(FiltroAsaichi filtro) {
        return """JOIN      gp40.ordem_de_fabricacao odf
                 ON        odf.id=s.ordem_de_fabricacao_id
                 JOIN      gp40.fornecedor f
                 ON        f.id=odf.fornecedor_id
                 LEFT JOIN gp40.item_catalogo nf
                 ON        nf.codigo_produto=odf.codigo_produto
                 AND       nf.organization_id=f.organization_id
                 AND       nf.nome='NUMERO DE FIBRAS'
                 LEFT JOIN gp40.item_catalogo np
                 ON        np.codigo_produto=odf.codigo_produto
                 AND       np.organization_id=f.organization_id
                 AND       np.nome='NUMERO DE PARES'
                 LEFT JOIN gp40.item_catalogo c1
                 ON        c1.codigo_produto=odf.codigo_produto
                 AND       c1.organization_id=f.organization_id
                 AND       c1.nome='TIPO DE CONECTOR'
                 LEFT JOIN gp40.conector cc1
                 ON        cc1.descricao=c1.valor
                 ${filtro.conector ? "AND cc1.descricao='${filtro.conector}'" : ""}
                 LEFT JOIN gp40.item_catalogo c2
                 ON        c2.codigo_produto=odf.codigo_produto
                 AND       c2.organization_id=f.organization_id
                 AND       c2.nome='TIPO CONECTOR LADO B'
                 LEFT JOIN gp40.conector cc2
                 ON        cc2.descricao=c2.valor
                 ${filtro.conector ? "AND cc2.descricao='${filtro.conector}'" : ""}
                 LEFT JOIN gp40.item_catalogo c3
                 ON        c3.codigo_produto=odf.codigo_produto
                 AND       c3.organization_id=f.organization_id
                 AND       c3.nome='TIPO CONECTOR LADO A'
                 LEFT JOIN gp40.conector cc3
                 ON        cc3.descricao=c3.valor
                 ${filtro.conector ? "AND cc3.descricao='${filtro.conector}'" : ""}
                 LEFT JOIN gp40.item_catalogo c4
                 ON        c4.codigo_produto=odf.codigo_produto
                 AND       c4.organization_id=f.organization_id
                 AND       c4.nome='TIPO CONECTOR IN'
                 LEFT JOIN gp40.conector cc4
                 ON        cc4.descricao=c4.valor
                 ${filtro.conector ? "AND cc4.descricao='${filtro.conector}'" : ""}
                 LEFT JOIN gp40.item_catalogo c5
                 ON        c5.codigo_produto=odf.codigo_produto
                 AND       c5.organization_id=f.organization_id
                 AND       c5.nome='TIPO CONECTOR OUT'
                 LEFT JOIN gp40.conector cc5
                 ON        cc5.descricao=c5.valor
                 ${filtro.conector ? "AND cc5.descricao='${filtro.conector}'" : ""} 
            """
    }

    Meta getMetaDoDia(FiltroAsaichi filtro, String data) {
        String sql = """
select
        (
                SELECT id
        FROM   gp40.meta
        WHERE  linha_de_producao_id=ldp.id
        AND    To_date('${data}', 'DD/MM/YYYY') BETWEEN inicio_vigencia AND    fim_vigencia
        AND    ((
                Trunc(To_date('${data}', 'DD/MM/YYYY')) <> Trunc(inicio_vigencia)
                AND    Trunc(To_date('${data}', 'DD/MM/YYYY')) <> Trunc(fim_vigencia))
        OR     ( (
                Trunc(To_date('${data}', 'DD/MM/YYYY')) = Trunc(inicio_vigencia)
                AND    To_date(To_char(inicio_vigencia, 'HH24:MI:SS'), 'HH24:MI:SS') BETWEEN To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS') - Extract(hour FROM td.duracao)/24 - Extract(minute FROM td.duracao)/24/60 AND    To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS')
                OR     To_date(To_char(inicio_vigencia, 'HH24:MI:SS'), 'HH24:MI:SS') <= To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS')      - Extract(hour FROM td.duracao)/24 - Extract(minute FROM td.duracao)/24/60 )
        OR     (
                Trunc(To_date('${data}', 'DD/MM/YYYY')) = Trunc(fim_vigencia)
                AND    To_date(To_char(fim_vigencia, 'HH24:MI:SS'), 'HH24:MI:SS') BETWEEN To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS') - Extract(hour FROM td.duracao)/24 - Extract(minute FROM td.duracao)/24/60 AND    To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS')
                OR     To_date(To_char(fim_vigencia, 'HH24:MI:SS'), 'HH24:MI:SS') >= To_date(To_char(td.horario_final, 'HH24:MI:SS'), 'HH24:MI:SS') ) )) ) AS idMeta
        FROM       gp40.turno t
        LEFT JOIN  gp40.linha_de_producao ldp
        ON         ldp.nome = '${filtro.linhaProducao}'
        AND        ldp.fornecedor_id=${filtro.idFornecedor}
        and ldp.versao=(select max(versao) from gp40.linha_de_producao where nome='${filtro.linhaProducao}' and fornecedor_id=${filtro.idFornecedor})
        INNER JOIN
        (
                SELECT     td.*
        FROM       gp40.turno_duracao td
        INNER JOIN gp40.turno_duracao_dias tdd
        ON         tdd.turno_duracao_id=td.id
        WHERE      tdd.dia_da_semana=(case to_char(to_date('${data}', 'DD/MM/YYYY'), 'D')
                    when '1' then 'DOMINGO'
                    WHEN '2' THEN 'SEGUNDA'
                    WHEN '3' THEN 'TERCA'
                    WHEN '4' THEN 'QUARTA'
                    WHEN '5' THEN 'QUINTA'
                    WHEN '6' THEN 'SEXTA'
                    WHEN '7' THEN 'SABADO' END)) td
        ON         td.turno_id = t.id
        WHERE      t.fornecedor_id=${filtro.idFornecedor}
        and rownum=1
"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return Meta.read(query.uniqueResult() as Long)
    }
}
