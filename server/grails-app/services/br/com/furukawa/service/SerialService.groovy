package br.com.furukawa.service

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.dtos.DadosGraficoSeriaisApontadosUltimas24HorasDTO
import br.com.furukawa.dtos.HoraApontamentoGraficoDTO
import br.com.furukawa.dtos.HistoricoApontamentoDTO
import br.com.furukawa.dtos.SerialFabricacaoPeriodoDTO
import br.com.furukawa.dtos.filtros.FiltroRelatorioSerial
import br.com.furukawa.dtos.filtros.FiltroSerial
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaSeriaisOrdemDeFabricacao
import br.com.furukawa.dtos.impressao.LinhasImpressaoSeriais
import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.dtos.SerialFabricacaoDTO
import br.com.furukawa.dtos.StatusSeriaisGraficoDTO
import br.com.furukawa.dtos.filtros.FiltroDashboardProducao
import br.com.furukawa.dtos.relatorios.excel.impl.RelatorioSerialItem
import br.com.furukawa.enums.DiaDaSemana
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusRomaneio
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.exceptions.EstornoApontamentoException

import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.ApontamentoOrdemDeFabricacao
import br.com.furukawa.model.ConfiguracaoGeral
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.HistoricoApontamento
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.ProcessoLinhaDeProducao
import br.com.furukawa.model.ProdutoEtiqueta
import br.com.furukawa.model.Romaneio
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.model.ServicoRomaneio
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.StringType
import org.hibernate.type.BooleanType

import java.text.SimpleDateFormat
import java.util.concurrent.TimeUnit

@Transactional
class SerialService {

    SessionFactory sessionFactory
    ImpressoraService impressoraService
    SequenciamentoService sequenciamentoService
    EtiquetaService etiquetaService
    ApontamentoService apontamentoService
    LogOperacaoService logOperacaoService

    List<SerialFabricacaoDTO> getSeriais(Fornecedor fornecedor, FiltroSerial filtro) {
        String sql = getSqlSeriais(fornecedor, filtro, false)
        println "MODELO SQL ===> ${sql}"
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("serialCompleto", new StringType())
        query.addScalar("codigoOrigem", new StringType())
        query.addScalar("codigoGerado", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("ordemExterna", new StringType())
        query.addScalar("ordemFabricacao", new StringType())
        query.addScalar("status", new StringType())
        query.addScalar("linhaProducao", new StringType())
        query.addScalar("grupoLinhaProducao", new StringType())
        query.addScalar("lote", new StringType())
        query.addScalar("caixa", new StringType())
        query.addScalar("statusOrdemFabricacao", new StringType())
        query.addScalar("statusRomaneio", new StringType())
        query.addScalar("codigoRomaneio", new StringType())
        query.addScalar("dataFinalizacao", new StringType())
        query.addScalar("dataSucateamento", new StringType())
        query.addScalar("codigoNF", new StringType())
        query.addScalar("idOrdemFabricacao", new LongType())
        query.addScalar("ultimoApontamento", new StringType())
        query.addScalar("dataRomaneio", new StringType())
        query.addScalar("statusWip", new StringType())
        query.addScalar("foiImpresso", new BooleanType())
        query.addScalar("statusLote", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(SerialFabricacaoDTO.class))

        query.setFirstResult(filtro.paginacao.offSet)
        query.setMaxResults(filtro.paginacao.max)

        return query.list()
    }

    List<RelatorioSerialItem> getSeriaisRelatorio(Fornecedor fornecedor, FiltroRelatorioSerial filtro) {
        String sql = getSqlSeriaisRelatorios(fornecedor, filtro)
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("serial", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("ordemFabricacao", new StringType())
        query.addScalar("ordemProducao", new StringType())
        query.addScalar("lote", new StringType())
        query.addScalar("status", new StringType())
        query.addScalar("linhaProducao", new StringType())
        query.addScalar("grupoLinhaProducao", new StringType())
        query.addScalar("statusOrdemFabricacao", new StringType())
        query.addScalar("statusLote", new StringType())
        query.addScalar("cliente", new StringType())
        query.addScalar("comprimento", new StringType())
        if (filtro.completo){
            query.addScalar("horario", new StringType())
            query.addScalar("recurso", new StringType())
            query.addScalar("grupoRecurso", new StringType())
            query.addScalar("apontadoPor", new StringType())
            query.addScalar("defeito", new StringType())
        }
        query.setResultTransformer(Transformers.aliasToBean(RelatorioSerialItem.class))
        query.setMaxResults(1000000)

        return query.list()
    }

    String getSqlSeriaisRelatorios(Fornecedor fornecedor, FiltroRelatorioSerial filtro) {

        if (filtro.completo){
            return """
                   SELECT DISTINCT id, serial, codigoProduto, descricaoProduto, ordemFabricacao, ordemProducao, status, lote, linhaProducao, grupoLinhaProducao,
                            horario, recurso, grupoRecurso, apontadoPor, defeito, statusOrdemFabricacao, statusLote, cliente, comprimento
                   FROM ( 
                        SELECT DISTINCT hist.id                                     as id,
                               ${getSqlBaseRelatorios(fornecedor)},
                               to_char(hist.data, 'dd/MM/yyyy hh24:mi')             as horario,
                               rec.nome    as recurso,
                               grec.nome                                   as grupoRecurso,
                               u.fullname    as apontadoPor,
                               def.nome   as defeito
                                    FROM gp40.ordem_de_producao op
                                         JOIN gp40.ordem_de_fabricacao o 
                                              ON  op.id = o.ordem_de_producao_id
                                         JOIN gp40.serial_fabricacao s
                                              ON o.id = s.ordem_de_fabricacao_id
                                         JOIN gp40.apontamento apo
                                              ON apo.serial_id = s.id
                                         JOIN gp40.historico_apontamento hist
                                              ON hist.apontamento_id = apo.id
                                         JOIN gp40.fornecedor f
                                              ON f.id = op.fornecedor_id
                                         LEFT join gp40.produto prod
                                              on prod.codigo=op.codigo_produto
                                              and prod.organization_id=f.organization_id
                                        JOIN gp40.recurso rec 
                                            ON rec.id=hist.recurso_id
                                        JOIN gp40.grupo_recurso grec 
                                            ON grec.id=hist.grupo_recurso_id
                                        JOIN gp40.users u 
                                            ON hist.operador_id = u.id 
                                        LEFT JOIN gp40.defeito def 
                                            ON def.id = hist.defeito_id
                                        LEFT JOIN gp40.produto_grupo_linha pgl 
                                            ON pgl.codigo = op.codigo_produto and nvl(op.roteiro, 0) = nvl(pgl.roteiro, 0) 
                                        LEFT JOIN gp40.grupo_linha_producao gp 
                                            ON gp.id = pgl.grupo_linha_id and gp.fornecedor_id=o.fornecedor_id
                                    WHERE o.fornecedor_id = ${fornecedor.id}
                                    ${filtro.gerarWhere()}
                   )
                   """
        } else {
            return """ SELECT DISTINCT id, serial, codigoProduto, descricaoProduto, ordemFabricacao, ordemProducao,status, lote, linhaProducao, grupoLinhaProducao, statusOrdemFabricacao, statusLote, cliente, comprimento
                            FROM (
                            SELECT DISTINCT s.id                      as id,
                                  ${getSqlBaseRelatorios(fornecedor)}
                                  FROM gp40.ordem_de_producao op
                                         JOIN gp40.ordem_de_fabricacao o 
                                              ON  op.id = o.ordem_de_producao_id
                                         JOIN gp40.serial_fabricacao s
                                              ON o.id = s.ordem_de_fabricacao_id
                                         JOIN gp40.apontamento apo
                                              ON apo.serial_id = s.id
                                         JOIN gp40.historico_apontamento hist
                                              ON hist.apontamento_id = apo.id
                                         JOIN gp40.fornecedor f
                                              ON f.id = op.fornecedor_id
                                         LEFT join gp40.produto prod
                                              on prod.codigo=op.codigo_produto
                                              and prod.organization_id=f.organization_id
                                        LEFT JOIN gp40.produto_grupo_linha pgl 
                                              ON pgl.codigo = op.codigo_produto and nvl(op.roteiro, 0) = nvl(pgl.roteiro, 0) 
                                        LEFT JOIN gp40.grupo_linha_producao gp 
                                               ON gp.id = pgl.grupo_linha_id and gp.fornecedor_id=o.fornecedor_id
                                  WHERE op.fornecedor_id = ${fornecedor.id}
                                   ${filtro.gerarWhere()}
                )  """
        }
    }

    String getSqlBaseRelatorios(Fornecedor fornecedor) {
        return """             s.codigo || '-' || s.ano                     as serial,
                               o.codigo_produto                             as codigoProduto,
                               nvl(prod.descricao, op.descricao_produto)    as descricaoProduto,
                               o.numero || '-' || o.ano                     as ordemFabricacao,
                               f.PREFIXO_PRODUCAO || '-' || op.NUMERO       as ordemProducao,
                               s.status_serial                              as status,
                               (SELECT lo.numero_lote || lo.semana || lo.ano
                                    FROM gp40.lote lo                                    
                                 LEFT JOIN gp40.lote_serial ls
                                      ON ls.lote_id = lo.id 
                                    WHERE ls.serial_id = s.id AND rownum=1 )              as lote,
                               (SELECT ldp.nome 
                                    FROM gp40.linha_de_producao ldp
                                 LEFT JOIN gp40.apontamento apo
                                      ON apo.linha_de_producao_id = ldp.id 
                                      AND apo.serial_id = s.id
                                      where rownum=1 
                                      AND F.ID = LDP.FORNECEDOR_ID)         as linhaProducao,
                               gp.nome       as grupoLinhaProducao,
                               o.status                                     as statusOrdemFabricacao,
                               (SELECT status_lote
                                    FROM gp40.lote lo                                    
                                 LEFT JOIN gp40.lote_serial ls
                                      ON ls.lote_id = lo.id 
                                    WHERE ls.serial_id = s.id AND rownum=1 )              as statusLote,
                               (SELECT valor
                                    FROM gp40.ITEM_CATALOGO client
                                    WHERE client.CODIGO_PRODUTO = o.codigo_produto AND client.NOME = '${ItensCatalogoFixos.MODELO}' 
                                    AND client.organization_id = '${fornecedor.organizationId}' AND rownum=1)     as cliente,
                               (SELECT valor 
                                    FROM gp40.ITEM_CATALOGO comp
                                    WHERE comp.CODIGO_PRODUTO = o.codigo_produto AND comp.NOME = '${ItensCatalogoFixos.MODELO}' 
                                    AND comp.organization_id = '${fornecedor.organizationId}' AND rownum=1)       as comprimento"""
    }

    Long getTotalSerialFabricacaoDTO(Fornecedor fornecedor, FiltroSerial filtro) {
        String sqlSeriais = getSqlSeriais(fornecedor, filtro, true)

        String sql = """SELECT Count(*) 
                        from (${sqlSeriais})
                      """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    String getSqlSeriais(Fornecedor fornecedor, FiltroSerial filtro, boolean isCount) {
        return """SELECT id                    AS id
                       ${isCount ? "" : 
                    """,serialcompleto        AS serialCompleto,
                       codigoorigem          AS codigoOrigem,
                       codigogerado          AS codigoGerado,
                       codigoproduto         AS codigoProduto,
                       descricaoproduto      AS descricaoProduto,
                       ordemfabricacao       AS ordemFabricacao,
                       ordemexterna          AS ordemExterna,
                       status                AS status,
                       lote                  AS lote,
                       caixa                 AS caixa,
                       Nvl(ldp1, ldp2)       AS linhaProducao,
                       grupo                 AS grupoLinhaproducao,
                       statusordemfabricacao AS statusOrdemFabricacao,
                       statusromaneio        AS statusromaneio,
                       decode(codigoromaneio, '/', '', codigoRomaneio)        AS codigoRomaneio,
                       datafinalizacao       AS dataFinalizacao,
                       codigonf              AS codigoNF,
                       statuswip             AS statusWip,
                       idordemfabricacao     AS idOrdemFabricacao,
                       ultimoapontamento     AS ultimoApontamento,
                       datasucateamento     As dataSucateamento,
                       dataromaneio          AS dataRomaneio,
                       statusimpressao       AS foiImpresso,
                       statuslote            AS statusLote"""}
                FROM   (SELECT s.id AS id
                
                  ${isCount ? "" : 
                """             ,s.codigo || '-' || s.ano AS serialcompleto,
                               s.codigo_origem AS codigoorigem,
                               to_char(s.data_sucateamento, 'DD/MM/YYYY HH24:mm:ss') AS datasucateamento,
                               to_char(s.data_apontamento_mais_recente, 'DD/MM/YYYY HH24:mm:ss')  as ultimoApontamento,
                               o.codigo_produto AS codigoproduto,
                               nvl(prod.descricao, op.descricao_produto) AS descricaoproduto,
                               o.numero || '-' || o.ano AS ordemfabricacao,
                               o.id AS idOrdemFabricacao,
                               f.prefixo_producao || '-' || op.numero AS ordemexterna,
                               s.status_serial AS status,
                               l.numero_lote || l.semana || l.ano AS lote,
                               l.status_lote AS statusLote,
                               ldp.nome AS ldp1,
                               ldpo.nome AS ldp2,
                               gp.nome AS grupo,
                               gr.numero || '/' || gr.ano AS codigoRomaneio,
                               To_char(gr.emissao, 'DD/MM/YYYY HH24:mm:ss') AS dataRomaneio,
                               gr.status AS statusRomaneio,
                               (
                                                       select  sfn.codigo||'-'||sfn.ANO AS codigo_gerado
                                                       from serial_fabricacao sfn
                                                       where sfn.codigo_origem = s.codigo||'-'||s.ano 
                                                    ) codigogerado,
                               s.etiqueta_apontamento_impressa
                               AS statusImpressao,
                               grnf.codigo AS codigoNF,
                               o.status AS statusordemfabricacao,
                               To_char(op.data_previsao_finalizacao, 'DD/MM/YYYY') AS dataFinalizacao,
                               cx.numero_caixa AS caixa, op.status_wip AS statusWip """}
                        FROM   gp40.serial_fabricacao s
                               INNER JOIN gp40.ordem_de_fabricacao o
                                       ON o.id = s.ordem_de_fabricacao_id
                               JOIN gp40.ordem_de_producao op
                                 ON op.id = o.ordem_de_producao_id
                               ${!filtro.linhaProducao && isCount ? "" : 
                                """LEFT JOIN gp40.apontamento apo
                                      ON apo.serial_id = s.id
                                  LEFT JOIN gp40.linha_de_producao ldp
                                      ON apo.linha_de_producao_id = ldp.id
                               LEFT JOIN gp40.linha_de_producao ldpo
                                      ON ldpo.id = o.linha_de_producao_id"""}
                               ${!filtro.grupoLinhaProducao && isCount ? "" : 
                            """JOIN gp40.grupo_linha_producao gp
                                 ON gp.id = o.grupo_linha_producao_id"""}
                            ${!filtro.codigoNF && !filtro.codigoRomaneio && !filtro.dataRomaneio && !filtro.statusRomaneio && !filtro.lote && (!filtro.statusLote || filtro.statusLote.containsAll(StatusLote.values())) && isCount ? "" :
                            """LEFT JOIN gp40.lote_serial ls
                                      ON ls.serial_id = s.id"""}
                            ${!filtro.lote && (!filtro.statusLote || filtro.statusLote.containsAll(StatusLote.values())) && isCount ? "" :
                           """LEFT JOIN gp40.lote l
                                      ON l.id = ls.lote_id """}
                               ${!filtro.codigoNF && !filtro.codigoRomaneio && !filtro.dataRomaneio && !filtro.statusRomaneio && isCount ? "" : 
                            """LEFT JOIN gp40.lote_romaneio glr
                                      ON glr.lote_id = ls.lote_id
                               LEFT JOIN gp40.romaneio gr
                                      ON gr.id = glr.romaneio_id"""}
                               ${!filtro.codigoNF && isCount ? "" :
                            """LEFT JOIN gp40.romaneio_nf grnf
                                      ON grnf.id = gr.nota_fiscal_encomenda_id"""}
                               ${!filtro.caixa && isCount ? "" : 
                            """LEFT JOIN gp40.imp_cx_serial cs
                                      ON cs.serial_id = s.id
                               LEFT JOIN gp40.impr_apont_cx cx
                                      ON cs.caixa_id = cx.id"""}
                               JOIN gp40.fornecedor f
                                 ON f.id = op.fornecedor_id
                               ${!filtro.descricaoProduto && isCount ? "" :
                            """LEFT JOIN gp40.produto prod
                                      ON prod.organization_id = f.organization_id
                                         AND prod.codigo = op.codigo_produto"""}
                                     ${filtro.gerarWhere()}    
                               AND    o.fornecedor_id = ${fornecedor.id} 
                            ${!isCount ? "${filtro.gerarOrderBy()}" : ""})
                      """
    }

    List<RetornoImpressao> gerarEtiqueta(List<String> codigosSeriais) {
        List<RetornoImpressao> pdfs = new ArrayList<>()

        codigosSeriais.each { serial ->
            SerialFabricacao serialFabricacao = getSerialFabricacao(serial)
            String codigoProduto = serialFabricacao.getCodigoProduto()

            List<ImpressaoApontamentoCaixa> caixas = ImpressaoApontamentoCaixa.createCriteria().list {
                seriais {
                    eq "id", serialFabricacao.id
                }
            }

            caixas.each {caixa ->
                ProdutoEtiqueta produtoEtiqueta = caixa.impressaoLote.produtoEtiqueta
                String numeroCaixaIdentificador = caixa.numeroCaixa
                produtoEtiqueta.etiquetas.each {codigoEtiqueta ->
                    pdfs.add(impressoraService.gerarEtiquetaSerial(
                            codigoProduto,
                            codigoEtiqueta as String,
                            caixa.seriais,
                            caixa.seriais.size(),
                            produtoEtiqueta.quantidadePorImpressao,
                            numeroCaixaIdentificador
                    ))
                }
            }
        }

        return pdfs
    }

    List<RetornoImpressao> gerarEtiquetasDoLote(ImpressaoApontamentoLote impressaoLote, List<ImpressaoApontamentoCaixa> caixas, Integer copias) {
        String codigoProduto = impressaoLote.lote.codigoProduto
        List<RetornoImpressao> pdfs = new ArrayList<>()
        ProdutoEtiqueta produtoEtiqueta = impressaoLote.produtoEtiqueta

        caixas.each {caixa ->
            produtoEtiqueta.etiquetas.each {codigoEtiqueta ->
                pdfs.add(impressoraService.gerarEtiquetaSerial(
                        codigoProduto,
                        codigoEtiqueta,
                        caixa.seriais,
                        caixa.seriais.size(),
                        copias,
                        caixa.numeroCaixa.toString()
                ))
            }
        }

        return pdfs
    }

    SerialFabricacao getSerialFabricacao(String serial) {
        String codigo = serial.split("-")[0]
        String ano = serial.split("-")[1]

        SerialFabricacao serialFabricacao = SerialFabricacao.createCriteria().get {
            eq "codigo", codigo, [ignoreCase: true]
            eq "ano", ano
        }
        return serialFabricacao
    }

    void geraNovoSerialParaSubstituirSucata(SerialFabricacao serialFabricacao) {
        OrdemDeFabricacao ordemDeFabricacao = serialFabricacao.ordemDeFabricacao
        sequenciamentoService.criaSeriais(ordemDeFabricacao, 1, serialFabricacao)
    }

    List<StatusSeriaisGraficoDTO> getSeriaisDoDia(FiltroDashboardProducao filtro, Fornecedor fornecedor){
        List<StatusSeriaisGraficoDTO> dadosGrafico = new ArrayList<StatusSeriaisGraficoDTO>()
        List<StatusSerialFabricacao> statusGrafico = StatusSerialFabricacao.getStatusDashboard()
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm")

        statusGrafico.eachWithIndex { StatusSerialFabricacao status, int index ->
            String propriedade = status.getPropriedadeSerial()
            List<String> outros = status.getOutrasProperidadesSerial()
            String extra = "AND s.$propriedade BETWEEN to_date('${sdf.format(filtro.periodoInicial)}', 'DD/MM/YYYY hh24:mi') AND to_date('${sdf.format(filtro.periodoFinal)}', 'DD/MM/YYYY hh24:mi')"
            if (filtro.turno){
                extra += """
                    AND to_date(to_char(s.$propriedade, 'HH24:MI:SS'), 'HH24:MI:SS')
                        BETWEEN to_date(to_char(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') - extract(HOUR FROM td.DURACAO)/24 - extract(MINUTE FROM td.DURACAO)/24/60 -- horario final menos a duração em horas
                            AND to_date(to_char(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') -- horario final sem levar em conta o dia/ano
                    ${DiaDaSemana.montaCaseQuery("s.$propriedade", "tdd.DIA_DA_SEMANA")}
                    """
            }
            if (outros){
                extra += " AND "
                extra += outros.collect({ prop ->
                    "(NOT (s.$prop  BETWEEN to_date('${sdf.format(filtro.periodoInicial)}', 'DD/MM/YYYY hh24:mi') AND to_date('${sdf.format(filtro.periodoFinal)}', 'DD/MM/YYYY hh24:mi')) OR (s.$prop IS NULL))"
                }).join(" AND ")

                if (filtro.turno){
                    extra += " AND "
                    extra += outros.collect({ prop ->
                        String query = """
                        to_date(to_char(s.$prop, 'HH24:MI:SS'), 'HH24:MI:SS')
                        BETWEEN to_date(to_char(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') - extract(HOUR FROM td.DURACAO)/24 - extract(MINUTE FROM td.DURACAO)/24/60 -- horario final menos a duração em horas
                            AND to_date(to_char(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') -- horario final sem levar em conta o dia/ano
                        ${DiaDaSemana.montaCaseQuery("s.$prop", "tdd.DIA_DA_SEMANA")}
                        """
                        return """
                        (NOT ($query) OR (s.$prop IS NULL))
                        """
                    }).join(" AND ")
                }

            }
            Long quantidade = getQuantidadeParaDashboard(fornecedor, filtro, extra)

            StatusSeriaisGraficoDTO statusSeriaisGraficoDTO = new StatusSeriaisGraficoDTO()
            statusSeriaisGraficoDTO.ordem = index
            statusSeriaisGraficoDTO.status = status
            statusSeriaisGraficoDTO.quantidade = quantidade

            dadosGrafico.add(statusSeriaisGraficoDTO)
        }


        return dadosGrafico
    }

    DadosGraficoSeriaisApontadosUltimas24HorasDTO getSeriaisApontadosNoUltimoDia(Fornecedor fornecedor, FiltroDashboardProducao filtro){
        DadosGraficoSeriaisApontadosUltimas24HorasDTO dados = new DadosGraficoSeriaisApontadosUltimas24HorasDTO()

        int horas = TimeUnit.HOURS.convert(Math.abs(filtro.periodoFinal.getTime() - filtro.periodoInicial.getTime()), TimeUnit.MILLISECONDS)
        if(horas >= 24) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM HH:mm")
            int horasBy = Math.ceil(horas / 24)
            for (int i = 0; i <= horas; i+=horasBy){
                Date inicial = new Date(filtro.periodoInicial.getTime() + (1000L * 60 * 60 * i))
                Date finalDate = new Date(filtro.periodoInicial.getTime() + (1000L * 60 * 60 * (i + horasBy)))
                Long quantidade = getSeriaisParaDashboard(fornecedor, filtro, inicial, finalDate)
                HoraApontamentoGraficoDTO horaApontamentoGraficoDTO = new HoraApontamentoGraficoDTO(ordem: i, hora: sdf.format(inicial), quantidade: quantidade)

                dados.dadosPorHora.add(horaApontamentoGraficoDTO)
            }
        } else {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM HH:mm")
            int minutos = TimeUnit.MINUTES.convert(Math.abs(filtro.periodoFinal.getTime() - filtro.periodoInicial.getTime()), TimeUnit.MILLISECONDS)
            int minutosBy = Math.ceil(minutos / 24)
            if(minutosBy > 0) {
                for (int i = 0; i <= minutos; i+=minutosBy){
                    Date inicial = new Date(filtro.periodoInicial.getTime() + (1000L * 60 * i))
                    Date finalDate = new Date(filtro.periodoInicial.getTime() + (1000L * 60 * (i + minutosBy)))
                    Long quantidade = getSeriaisParaDashboard(fornecedor, filtro, inicial, finalDate)
                    HoraApontamentoGraficoDTO horaApontamentoGraficoDTO = new HoraApontamentoGraficoDTO(ordem: i, hora: sdf.format(inicial), quantidade: quantidade)

                    dados.dadosPorHora.add(horaApontamentoGraficoDTO)
                }
            }
        }

        return dados
    }

    Long getSeriaisParaDashboard(Fornecedor fornecedor, FiltroDashboardProducao filtro, Date dataInicial, Date dataFinal){
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm")
        String sql = """
        select count(*) from (
                SELECT DISTINCT s.id
                FROM GP40.SERIAL_FABRICACAO s
                    JOIN GP40.apontamento apo
                            ON apo.SERIAL_ID = s.ID 
                    JOIN GP40.ordem_de_fabricacao o
                            ON o.id = s.ordem_de_fabricacao_id
                    JOIN GP40.fornecedor f
                            ON f.id = o.fornecedor_id
                    ${filtro.recurso || filtro.grupoRecursos ? """
                        LEFT JOIN GP40.historico_apontamento hist
                            ON hist.apontamento_id = apo.id """ : ""}
                    ${filtro?.linhaProducao ? """LEFT JOIN GP40.linha_de_producao ldp
                            ON ldp.id = apo.linha_de_producao_id""" : ""}  
                    ${filtro?.grupoLinhaProducao ? """LEFT JOIN GP40.grupo_linha_producao gdlp
                            ON gdlp.id = o.grupo_linha_producao_id""" : ""}
                    ${filtro?.recurso ? """LEFT JOIN GP40.recurso rec
                            ON hist.recurso_id = rec.id""" : ""}
                    ${filtro?.grupoRecursos ? """LEFT JOIN  GP40.grupo_recurso grec
                            ON hist.grupo_recurso_id = grec.id""" : ""}
                    ${filtro.turno ? """
                    LEFT JOIN turno t
                            ON t.FORNECEDOR_ID = '${fornecedor.id}' AND UPPER(t.NOME) LIKE UPPER('%${filtro.turno}%')
                    LEFT JOIN TURNO_DURACAO td
                            ON td.TURNO_ID = t.id
                    LEFT JOIN TURNO_DURACAO_DIAS tdd
                            ON tdd.TURNO_DURACAO_ID = td.id
                    """ : ""}
                WHERE f.id = '${fornecedor.id}'
                    ${dataInicial ? "AND s.data_ultimo_apontamento BETWEEN to_date('${sdf.format(dataInicial)}', 'DD/MM/YYYY hh24:mi') AND to_date('${sdf.format(dataFinal)}', 'DD/MM/YYYY hh24:mi')" : ""}
                    ${filtro?.grupoLinhaProducao ? "AND UPPER(gdlp.nome) LIKE UPPER('%${filtro?.grupoLinhaProducao}%')" : ""}
                    ${filtro?.linhaProducao ? "AND UPPER(ldp.nome) LIKE UPPER('%${filtro?.linhaProducao}%')" : ""}
                    ${filtro?.grupoRecursos ? "AND UPPER(grec.nome) LIKE UPPER('%${filtro?.grupoRecursos}%')" : ""}
                    ${filtro?.recurso ? "AND UPPER(rec.nome) LIKE UPPER('%${filtro?.recurso}%')" : ""}
                    ${filtro.turno ? """
                    AND to_date(to_char(s.data_ultimo_apontamento, 'HH24:MI:SS'), 'HH24:MI:SS')
                        BETWEEN to_date(to_char(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') - extract(HOUR FROM td.DURACAO)/24 - extract(MINUTE FROM td.DURACAO)/24/60 -- horario final menos a duração em horas
                            AND to_date(to_char(td.HORARIO_FINAL, 'HH24:MI:SS'), 'HH24:MI:SS') -- horario final sem levar em conta o dia/ano
                    ${DiaDaSemana.montaCaseQuery("s.data_ultimo_apontamento", "tdd.DIA_DA_SEMANA")}
                    """ : ""}
)
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    Long getQuantidadeParaDashboard(Fornecedor fornecedor, FiltroDashboardProducao filtro, String extra = "") {
        String sql = """
            select count(*) from (
                SELECT DISTINCT s.id as id
                FROM GP40.SERIAL_FABRICACAO s
                    JOIN GP40.apontamento apo
                            ON apo.SERIAL_ID = s.ID 
                    JOIN GP40.ordem_de_fabricacao o
                            ON o.id = s.ordem_de_fabricacao_id
                    JOIN GP40.fornecedor f
                            ON f.id = o.fornecedor_id
                    ${filtro?.linhaProducao ? """LEFT JOIN GP40.linha_de_producao ldp
                            ON ldp.id = apo.linha_de_producao_id""" : "" } 
                    ${filtro?.grupoLinhaProducao ? """LEFT JOIN GP40.grupo_linha_producao gdlp
                            ON gdlp.id = o.grupo_linha_producao_id""" : ""}
                    LEFT JOIN GP40.historico_apontamento hist
                            ON hist.apontamento_id = apo.id
                    ${filtro?.recurso ? """LEFT JOIN GP40.recurso rec
                            ON hist.recurso_id = rec.id""" : ""}
                    ${filtro?.grupoRecursos ? """LEFT JOIN  GP40.grupo_recurso grec
                            ON hist.grupo_recurso_id = grec.id""": ""}
                    ${filtro.turno ? """
                    LEFT JOIN turno t
                            ON t.FORNECEDOR_ID = '${fornecedor.id}' AND UPPER(t.NOME) LIKE UPPER('%${filtro.turno}%')
                    LEFT JOIN TURNO_DURACAO td
                            ON td.TURNO_ID = t.id
                    LEFT JOIN TURNO_DURACAO_DIAS tdd
                            ON tdd.TURNO_DURACAO_ID = td.id
                    """ : ""}
                WHERE f.id = '${fornecedor.id}'
                    ${filtro?.grupoLinhaProducao ? "AND UPPER(gdlp.nome) LIKE UPPER('%${filtro?.grupoLinhaProducao}%')" : ""}
                    ${filtro?.linhaProducao ? "AND UPPER(ldp.nome) LIKE UPPER('%${filtro?.linhaProducao}%')" : ""}
                    ${filtro?.grupoRecursos ? "AND UPPER(grec.nome) LIKE UPPER('%${filtro?.grupoRecursos}%')" : ""}
                    ${filtro?.recurso ? "AND UPPER(rec.nome) LIKE UPPER('%${filtro?.recurso}%')" : ""}
                    ${extra})
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    List<ImpressaoEtiquetaSeriaisOrdemDeFabricacao> montaImpressaoEtiquetaDTO(OrdemDeFabricacao ordemDeFabricacao, List<String> seriais) {
        String codigoLote = ordemDeFabricacao.ordemDeProducao.codigoOrdem
        ProdutoEtiqueta produtoEtiqueta = ProdutoEtiqueta.findByCodigoProdutoAndSerialAndFornecedor(ordemDeFabricacao.codigoProduto, true, ordemDeFabricacao.fornecedor)
        ArrayList<LinhasImpressaoSeriais> linhas = montaLinhasImpressaoEtiquetaDTO(codigoLote, produtoEtiqueta, seriais)
        Set<String> identificadores = produtoEtiqueta?.etiquetas ?: [ConfiguracaoGeral.getIdentificadorDaEtiquetaSeriaisDaOrdemFabricacao()]

        seriais.each { it -> logOperacaoService.reimprimirEtiquetaSerial(it) }

        return identificadores.collect({identificador ->
            return new ImpressaoEtiquetaSeriaisOrdemDeFabricacao(
                    identificador: identificador,
                    codigoLote   : codigoLote,
                    linhas       : linhas
            )
        })
    }

    private List<LinhasImpressaoSeriais> montaLinhasImpressaoEtiquetaDTO(String codigoLote, ProdutoEtiqueta produtoEtiqueta, List<String> seriais) {
        List<LinhasImpressaoSeriais> linhas = new ArrayList<>()
        int agrupamento = produtoEtiqueta?.serial ? (produtoEtiqueta?.quantidadeDeEtiquetas ?: 4) : 4
        int totalLinhas = Math.ceil(seriais.size() / agrupamento)

        totalLinhas.times { idxLinha ->
            int inicioLinha = agrupamento * idxLinha
            int fimLinha = Math.min(inicioLinha + agrupamento, seriais.size())
            List<String> seriaisLinha = seriais.subList(inicioLinha, fimLinha)

            linhas.add(new LinhasImpressaoSeriais(seriaisLinha, codigoLote, agrupamento))
        }
        return linhas
    }

    List<RetornoImpressao> reimprimirSeriais(Impressora impressora, List<String> codigosSeriais, Integer copias){
        List<RetornoImpressao> retorno = []
        codigosSeriais.each {codigoSerial ->
            SerialFabricacao serial = getSerialFabricacao(codigoSerial)
            List<ImpressaoApontamentoCaixa> caixas = ImpressaoApontamentoCaixa.createCriteria().list {
                seriais {
                    'eq' 'id', serial.id
                }
            }
            List etiquetas = apontamentoService.getEtiquetas(impressora, caixas, copias)
            logOperacaoService.reimprimirEtiquetaSerial(codigoSerial)
            if(!serial.etiquetaApontamentoImpressa) {
                serial.etiquetaApontamentoImpressa = true
                serial.save(flush: true)
            }
            retorno.addAll(etiquetas)
        }


        return retorno
    }

    List<RetornoImpressao> reimprimirLote(Impressora impressora, List<ImpressaoApontamentoCaixa> caixas, Integer copias){
        List<RetornoImpressao> retorno = []
        List etiquetas = apontamentoService.getEtiquetas(impressora, caixas, copias)
        retorno.addAll(etiquetas)

        return retorno
    }

    void estornarApontamento(SerialFabricacao serial, HistoricoApontamento historicoApontamento, String justificativa) {
        Apontamento apontamento = serial.getApontamento()
        boolean isFinalizado = serial.isApontamentoFinalizado()
        Lote lote = serial.getLote()
        String codigoLote = lote?.getCodigoLote()
        ImpressaoApontamentoCaixa impressaoApontamentoCaixa = serial.getCaixaImpressao()
        String numeroCaixa = impressaoApontamentoCaixa?.getNumeroCaixa()?.toString()
        Set<HistoricoApontamento> historico = apontamento.getHistorico()
        OrdemDeFabricacao of = serial.ordemDeFabricacao

        if(of.isCancelada()) {
            throw new EstornoApontamentoException("estorno.ofCancelada.message", null)
        }

        if(lote?.isRomaneio() && !lote?.getRomaneio()?.getStatus()?.isCancelado()) {
            throw new EstornoApontamentoException("estorno.loteRomaneio.message", null)
        }

        Set<HistoricoApontamento> estornados = historicoApontamento ? [historicoApontamento] : historico
        Set<HistoricoApontamento> restantes = historico - estornados

        if(lote) {
            removerSerialDoLote(lote, serial)
        }

        if(impressaoApontamentoCaixa) {
            removerImpressaoDoSerial(impressaoApontamentoCaixa, serial)
        }

        boolean removerTodoHistorico = restantes.isEmpty()

        if(removerTodoHistorico) {
            apontamento.delete()
            serial.statusSerial = StatusSerialFabricacao.PENDENTE_APONTAMENTO
        } else {
            estornados.each {
                apontamento.removeFromHistorico(it)
            }

            serial.statusSerial = StatusSerialFabricacao.APONTAMENTO_INICIADO
            apontamento.save(flush: true)
        }

        if(of.isFinalizada()) {
            of.status = StatusOrdemFabricacao.EM_ANDAMENTO
            Integer ultimaOrdem = sequenciamentoService.getPosicaoDaUltimaOrdem(of)
            of.ordem = ultimaOrdem + 1
        }

        if(removerTodoHistorico && of.quantidadeIniciada == 1) {
            of.status = StatusOrdemFabricacao.ABERTA
        }

        of.save(flush: true)

        LinhaDeProducao lp = apontamento.linhaDeProducao

        HistoricoApontamento ultimoApontamentoRestante = restantes?.max {it.data}
        ProcessoLinhaDeProducao processoAnterior = lp.processos.find { it.grupoRecurso.id == ultimoApontamentoRestante?.grupoRecurso?.id }

        if(ultimoApontamentoRestante?.defeito) {
            apontamento.processoAtual = processoAnterior?.getProcessoRetorno(ultimoApontamentoRestante.defeito)
        } else {
            apontamento.processoAtual = processoAnterior?.getProximoProcesso()
        }

        logOperacaoService.estornarApontamento(serial, estornados, justificativa, codigoLote, numeroCaixa)
    }


    void estornarCaixa(SerialFabricacao serialFabricacao, String justificativa) {
        Lote lote = serialFabricacao.getLote()
        String codigoLote = lote?.getCodigoLote()
        ImpressaoApontamentoCaixa impressaoApontamentoCaixa = serialFabricacao.getCaixaImpressao()
        String numeroCaixa = impressaoApontamentoCaixa?.getNumeroCaixa()?.toString()
        List<SerialFabricacao> seriais = numeroCaixa ? SerialFabricacao.getAll(impressaoApontamentoCaixa.seriais*.id) : [serialFabricacao]

        for(int i = 0; i < seriais.size(); i++) {
            SerialFabricacao serial = seriais[i]

            Apontamento apontamento = serial.getApontamento()
            Set<HistoricoApontamento> historico = apontamento.getHistorico()
            HistoricoApontamento ultimoApontamento = apontamento.getUltimoRegistroHistorico()
            OrdemDeFabricacao of = serial.ordemDeFabricacao


            if (of.isCancelada()) {
                throw new EstornoApontamentoException("estorno.ofCancelada.message", null)
            }

            if(lote?.isRomaneio() && !lote?.getRomaneio()?.getStatus()?.isCancelado()) {
                throw new EstornoApontamentoException("estorno.loteRomaneio.message", null)
            }


            if(impressaoApontamentoCaixa) {
                removerImpressaoDoSerial(impressaoApontamentoCaixa, serial)
            }

            removerSerialDoLote(lote, serial)

            Set<HistoricoApontamento> estornados = [ultimoApontamento]
            Set<HistoricoApontamento> restantes = historico - estornados

            boolean removerTodoHistorico = restantes.isEmpty()

            if (removerTodoHistorico) {
                apontamento.delete()
                serial.statusSerial = StatusSerialFabricacao.PENDENTE_APONTAMENTO
            } else {
                estornados.each {
                    apontamento.removeFromHistorico(it)
                }

                serial.statusSerial = StatusSerialFabricacao.APONTAMENTO_INICIADO
                apontamento.save(flush: true)
            }

            if (of.isFinalizada()) {
                of.status = StatusOrdemFabricacao.EM_ANDAMENTO
                Integer ultimaOrdem = sequenciamentoService.getPosicaoDaUltimaOrdem(of)
                of.ordem = ultimaOrdem + 1
            }

            //o serial atual eh o ultimo finalizado
            if (removerTodoHistorico && of.quantidadeIniciada == 1) {
                of.status = StatusOrdemFabricacao.ABERTA
            }

            of.save(flush: true)

            LinhaDeProducao lp = apontamento.linhaDeProducao
            apontamento.processoAtual = lp.processos.find({ it.grupoRecurso.id == restantes?.max {it.data}?.grupoRecurso?.id })?.getProximoProcesso()

            logOperacaoService.estornarApontamento(serial, estornados, justificativa, codigoLote, numeroCaixa)
        }
    }

    void removerImpressaoDoSerial(ImpressaoApontamentoCaixa impressaoApontamentoCaixa, SerialFabricacao serial) {
        ImpressaoApontamentoLote impressaoLote = impressaoApontamentoCaixa.impressaoLote
        if (impressaoApontamentoCaixa.seriais.size() == 1) {
            if(impressaoLote.caixas.size() == 1) {
                impressaoLote.delete(flush: true)
            } else {
                impressaoLote.removeFromCaixas(impressaoApontamentoCaixa)
            }
        } else {
            impressaoApontamentoCaixa.removeFromSeriais(serial)
            impressaoApontamentoCaixa.save(flush: true)
        }
    }

    void removerSerialDoLote(Lote lote, SerialFabricacao serial) {
        if (lote.seriais.size() == 1) {
            ServicoRomaneio.findAllByLote(lote).each {
                it.lote = null
                it.save(flush: true, failOnError: true)
            }
            lote.delete(flush: true)
        } else {
            lote.removeFromSeriais(serial)
            lote.quantidade = lote.quantidade - 1

            lote.save(flush: true)
        }
    }

    List<HistoricoApontamentoDTO> getHistoricosDoSerial(Long serialId){
        String sql = """
            SELECT hist.id as id,
                   to_char(hist.data, 'DD/MM/YYYY HH24:MI:SS') as data,
                   def.nome as defeito,
                   rec.nome as recurso
            FROM HISTORICO_APONTAMENTO hist
                LEFT JOIN DEFEITO def 
                    on hist.DEFEITO_ID = def.id
                JOIN RECURSO rec 
                    on hist.RECURSO_ID = rec.id
                JOIN APONTAMENTO ap
                    on hist.APONTAMENTO_ID = ap.id
            WHERE ap.SERIAL_ID = '${serialId}'
            ORDER BY hist.data ASC
        """


        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("data", new StringType())
        query.addScalar("defeito", new StringType())
        query.addScalar("recurso", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(HistoricoApontamentoDTO.class))

        return query.list()
    }

    List<SerialFabricacaoPeriodoDTO> buscarSeriaisPorPeriodo(String dataInicial, String dataFinal, Integer max, Integer pagina) {
        String sql = getSqlSeriaisPorPeriodo(dataInicial, dataFinal)

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("serial", new StringType())
        query.addScalar("ordemFabricacao", new StringType())
        query.addScalar("ordemProducao", new StringType())
        query.addScalar("quantidadeOP", new LongType())
        query.addScalar("quantidadeOF", new LongType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("codigoServico", new StringType())
        query.addScalar("idFornecedor", new LongType())
        query.addScalar("nomeFornecedor", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(SerialFabricacaoPeriodoDTO.class))
        query.setFirstResult((pagina-1) * max)
        query.setMaxResults(max)

        return query.list()
    }

    Long buscarTotalSeriaisPorPeriodo(String dataInicial, String dataFinal) {
        String sql = """SELECT COUNT(*) FROM (${getSqlSeriaisPorPeriodo(dataInicial, dataFinal)})"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult()
    }

    String getSqlSeriaisPorPeriodo(String dataInicial, String dataFinal) {
        return """SELECT SF.codigo
                               || '-'
                               || SF.ano            AS serial,
                               OFA.numero
                               || '-'
                               || OFA.ano           AS ordemFabricacao,
                               F.prefixo_producao
                               || '-'
                               || OP.numero         AS ordemProducao,
                               OP.quantidade        AS quantidadeOP,
                               OFA.quantidade_total AS quantidadeOF,
                               OP.codigo_produto    AS codigoProduto,
                               OP.codigo_servico    AS codigoServico,
                               F.id                 AS idFornecedor,
                               F.nome               AS nomeFornecedor
                        FROM   gp40.serial_fabricacao SF
                               INNER JOIN gp40.ordem_de_fabricacao OFA
                                       ON OFA.id = SF.ordem_de_fabricacao_id
                               INNER JOIN gp40.ordem_de_producao OP
                                       ON OP.id = OFA.ordem_de_producao_id
                               INNER JOIN gp40.fornecedor F
                                       ON F.id = OP.fornecedor_id
                        WHERE  OFA.data_criacao BETWEEN To_date('${dataInicial}', 'DD-MM-YYYY HH24:MI') AND
                               To_date('${dataFinal}', 'DD-MM-YYYY HH24:MI')
                """
    }

    void estornarApontamentoOF(SerialFabricacao serialFabricacao, String justificativa) {
        OrdemDeFabricacao ordemDeFabricacao = serialFabricacao.ordemDeFabricacao

        if(ordemDeFabricacao.isCancelada()) {
            throw new EstornoApontamentoException("estorno.ofCancelada.message", null)
        }
        if(ordemDeFabricacaoPossuiAlgumLoteEmRomaneio(ordemDeFabricacao)) {
            throw new EstornoApontamentoException("estorno.loteRomaneio.message", null)
        }

        reverteRegistrosAssociadosAoApontamentoOF(ordemDeFabricacao)

        logOperacaoService.estornarApontamentoOF(ordemDeFabricacao, justificativa)
    }

    boolean ordemDeFabricacaoPossuiAlgumLoteEmRomaneio(OrdemDeFabricacao of) {
        return Romaneio.createCriteria().get {
            lotes {
                apontamentoOF {
                    eq 'id', of.id
                }

                seriais {
                    ordemDeFabricacao {
                        eq 'id', of.id
                    }
                }
            }

            ne 'status', StatusRomaneio.CANCELADO

            projections {
                count('id')
            }
        } > 0
    }

    boolean ordemDeProducaoPossuiAlgumaOFCancelada(OrdemDeProducao op) {
        return Lote.createCriteria().get {
            ordemDeProducao {
                eq 'id', op.id
            }

            seriais {
                ordemDeFabricacao {
                    eq 'status', StatusOrdemFabricacao.CANCELADA
                    ordemDeProducao {
                        eq 'id', op.id
                    }
                }
            }

            projections {
                count('id')
            }
        } > 0
    }

    void reverteRegistrosAssociadosAoApontamentoOF(OrdemDeFabricacao ordemDeFabricacao) {
        String selectSeriais = "SELECT ID FROM SERIAL_FABRICACAO WHERE ORDEM_DE_FABRICACAO_ID = ${ordemDeFabricacao.id}"
        String selectLotes = "SELECT LOTE_ID FROM LOTE_SERIAL WHERE SERIAL_ID IN(${selectSeriais})"

        String sqlUpdateServicosRomaneio = """UPDATE SERVICO_ROMANEIO SET LOTE_ID=NULL WHERE LOTE_ID IN(${selectLotes})"""
        sessionFactory.currentSession.createSQLQuery(sqlUpdateServicosRomaneio).executeUpdate()

        String sqlDeleteLoteSerial = "DELETE FROM LOTE_SERIAL WHERE SERIAL_ID IN(${selectSeriais})"
        sessionFactory.currentSession.createSQLQuery(sqlDeleteLoteSerial).executeUpdate()

        String sqlDeleteLotes = "DELETE FROM LOTE WHERE APONTAMENTOOF_ID = ${ordemDeFabricacao.id}"
        sessionFactory.currentSession.createSQLQuery(sqlDeleteLotes).executeUpdate()

        String sqlUpdateSerial = "UPDATE SERIAL_FABRICACAO SET STATUS_SERIAL='${StatusSerialFabricacao.PENDENTE_APONTAMENTO}' WHERE ID IN(${selectSeriais})"
        sessionFactory.currentSession.createSQLQuery(sqlUpdateSerial).executeUpdate()

        ApontamentoOrdemDeFabricacao.findByOrdemDeFabricacao(ordemDeFabricacao).delete(flush: true)
        Integer ultimaOrdem = sequenciamentoService.getPosicaoDaUltimaOrdem(ordemDeFabricacao)
        ordemDeFabricacao.ordem = ultimaOrdem + 1
        ordemDeFabricacao.status = StatusOrdemFabricacao.ABERTA
    }

    void salvarImpressaoEtiquetaOFNosSeriais(OrdemDeFabricacao ordemDeFabricacao) {
        String sql = "UPDATE GP40.SERIAL_FABRICACAO SET etiqueta_apontamento_impressa=1 WHERE ORDEM_DE_FABRICACAO_ID=${ordemDeFabricacao.id} AND etiqueta_apontamento_impressa=0"
        sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
    }

    void atualizaDataApontamentoMaisRecenteSerial(OrdemDeFabricacao ordemDeFabricacao) {
        ordemDeFabricacao.seriais.findAll {!it.dataApontamentoMaisRecente && it.isApontamentoFinalizado()}.each {
            it.dataApontamentoMaisRecente = it.getUltimoRegistroHistorico()?.data
            it.save(flush: true)
        }
    }

    void atualizaEtiquetaApontamentoImpressa(OrdemDeFabricacao ordemDeFabricacao) {
        if(logOperacaoService.buscarLogOperacaoOF(ordemDeFabricacao.codigoOrdemDeFabricacao, TipoLogOperacao.IMPRIMIR_ETIQUETA_OF, ordemDeFabricacao.fornecedor)) {
            Set<SerialFabricacao> seriais = ordemDeFabricacao.seriais.findAll {!it.etiquetaApontamentoImpressa}
            seriais*.etiquetaApontamentoImpressa = true
            seriais*.save(flush: true)
        }
    }
}
