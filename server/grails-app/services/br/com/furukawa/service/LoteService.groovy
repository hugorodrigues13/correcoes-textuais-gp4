package br.com.furukawa.service

import br.com.furukawa.dtos.FaturamentoDTO
import br.com.furukawa.dtos.filtros.FiltroFaturamento
import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.exceptions.LoteException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.LoteQuantidadeRecebimento
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.LogOperacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.ProdutoEtiqueta
import br.com.furukawa.model.ProdutoGrupoLinhaDeProducao
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.RecebimentoNF
import br.com.furukawa.model.Recurso
import br.com.furukawa.model.SerialFabricacao
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.DateType
import org.hibernate.type.IntegerType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import java.text.SimpleDateFormat
import javax.transaction.Transactional

@Transactional
class LoteService {

    CrudService crudService
    OracleService oracleService
    LogOperacaoService logOperacaoService
    ImpressoraService impressoraService
    SessionFactory sessionFactory

    List<FaturamentoDTO> getFaturamentos(FiltroFaturamento filtro, Fornecedor fornecedor) {
        String sql = getSqlFaturamentos(filtro, fornecedor)
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("numeroLote", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("statusLote", new StringType())
        query.addScalar("ano", new IntegerType())
        query.addScalar("quantidade", new IntegerType())
        query.addScalar("quantidadeMaxima", new IntegerType())
        query.addScalar("quantidadePorCaixa", new IntegerType())
        query.addScalar("semana", new StringType())
        query.addScalar("ordemDeFabricacao", new StringType())
        query.addScalar("local", new StringType())
        query.addScalar("dataFechamento", new StringType())
        query.addScalar("idImpressao", new LongType())
        query.setResultTransformer(Transformers.aliasToBean(FaturamentoDTO.class))

        query.setFirstResult(filtro.paginacao.offSet)
        if(filtro.paginacao.max) {
            query.setMaxResults(filtro.paginacao.max)
        }

        return query.list()

    }

    String getSqlFaturamentos(FiltroFaturamento filtro, Fornecedor fornecedor) {
        return """
            SELECT l.id as id, 
                l.numero_lote as numeroLote,
                l.codigo_produto as codigoProduto,
                nvl(prod.descricao, l.descricao_produto) as descricaoProduto,
                l.status_lote as statusLote,
                l.ano as ano,
                count(distinct sf.id) as quantidade,
                l.quantidade_maxima as quantidadeMaxima,
                l.semana as semana,
                l.quantidade_por_caixa as quantidadePorCaixa,
                case when ofab.id is not null then ofab.numero || '-' || ofab.ano else null end as ordemDeFabricacao,
                gl.nome as local,
                to_char(${FiltroFaturamento.montaSubQueryDataFechamento()}, 'DD/MM/YYYY HH24:MI') as dataFechamento,
                IAL.ID as idImpressao
            FROM gp40.LOTE l
                LEFT JOIN gp40.ORDEM_DE_FABRICACAO ofab
                    ON ofab.id = l.ordem_de_fabricacao_id
                JOIN gp40.GRUPO_LINHA_PRODUCAO gl
                    ON gl.id = l.grupo_linha_de_producao_id
                LEFT JOIN GP40.PARAMETRO_LOG_OPERACAO PLO 
                    ON plo.tipo = '${TipoParametroLogOperacao.CODIGO_LOTE}' 
                    AND plo.valor = l.numero_lote || LPAD(l.semana, 2, '0') || l.ano
                LEFT JOIN GP40.LOG_OPERACAO LO
                    ON LO.ID=PLO.LOG_OPERACAO_ID
                    AND LO.TIPO_LOG_OPERACAO='${TipoLogOperacao.FECHAR_LOTE_INCOMPLETO}'
                LEFT JOIN GP40.LOTE_SERIAL LS 
                    ON LS.lote_id=L.ID
                LEFT JOIN GP40.SERIAL_FABRICACAO SF 
                    ON SF.ID=LS.SERIAL_ID
                LEFT JOIN GP40.IMPR_APONT_LOTE IAL 
                    ON IAL.LOTE_ID=L.ID 
                JOIN FORNECEDOR F 
                    ON F.ID=gl.FORNECEDOR_ID
                LEFT join produto prod
                    on prod.codigo=L.codigo_produto
                    and prod.organization_id=f.organization_id 
            ${filtro.gerarWhere()}
            AND l.status_lote not in('${StatusLote.getStatusNaoVisiveisListagem().join("', '")}')
            AND gl.fornecedor_id=${fornecedor.id}
            group by l.id, l.numero_lote, l.codigo_produto, nvl(prod.descricao, l.descricao_produto), l.status_lote, 
            l.ano, l.quantidade_maxima, l.semana, l.quantidade_por_caixa, 
case when ofab.id is not null then ofab.numero || '-' || ofab.ano else null end, gl.nome, ial.id
            ${filtro.gerarOrderBy()}
        """
    }

    Integer getTotalFaturamentos(FiltroFaturamento filtro, Fornecedor fornecedor) {
        String sql = getSqlFaturamentos(filtro, fornecedor)

        String countSql = """SELECT Count(*) 
                        from (${sql})
                      """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(countSql)

        return query.uniqueResult() as Integer
    }

    Lote adicionaSerialAoLote(GrupoLinhaDeProducao grupoLinhaProducao,
                              OrdemDeFabricacao ordemDeFabricacao,
                              SerialFabricacao serialFabricacao,
                              LinhaDeProducao linhaDeProducaoApontamento,
                              GrupoRecurso grupoRecurso,
                              Recurso recurso,
                              Organizacao organizacao) {
        String roteiroOP = ordemDeFabricacao.ordemDeProducao.roteiro
        ProdutoGrupoLinhaDeProducao produto = ProdutoGrupoLinhaDeProducao.findByCodigoAndRoteiroAndGrupoLinha(ordemDeFabricacao.codigoProduto, roteiroOP, grupoLinhaProducao)

        if (!produto && !roteiroOP) {
            produto = ProdutoGrupoLinhaDeProducao.findByCodigoAndRoteiroAndGrupoLinha(ordemDeFabricacao.codigoProduto, "00", grupoLinhaProducao)
        } else if (!produto && roteiroOP == "00") {
            produto = ProdutoGrupoLinhaDeProducao.findByCodigoAndRoteiroAndGrupoLinha(ordemDeFabricacao.codigoProduto, null, grupoLinhaProducao)
        }

        if (!produto) {
            throw new LoteException("lote.protudoGrupoLinhaInvalido.message", ordemDeFabricacao.codigoProduto, roteiroOP ?: "00", grupoLinhaProducao.nome)
        }

        List<Lote> lotes = lotesDisponiveisParaOSerial(ordemDeFabricacao, grupoLinhaProducao, serialFabricacao)

        if (lotes.isEmpty()) {
            return criarLote(grupoLinhaProducao, ordemDeFabricacao, serialFabricacao, produto, grupoRecurso, organizacao)
        } else {
            Lote loteExistente = null
            if(lotes.size() > 1 && recurso) {
                //priorizar lote que tenha apenas a ultima caixa aberta neste recurso, e depois, o lote que esteja aberto, ainda com possibilidade de criar caixas
                Lote loteComApenasAUltimaCaixaAbertaNoRecurso = lotes.find {it.possuiApenasAUltimaCaixaAbertaNoRecurso(recurso) }
                Lote loteComApenasUmaCaixaAbertaNoRecurso = lotes.find {it.possuiAlgumaCaixaAbertaNoRecurso(recurso) }
                Lote loteQueAindaPodeCriarCaixasNoRecurso = lotes.find { it.aindaPodeCriarCaixasParaRecurso() }

                loteExistente = loteComApenasAUltimaCaixaAbertaNoRecurso ?: loteComApenasUmaCaixaAbertaNoRecurso ?: loteQueAindaPodeCriarCaixasNoRecurso ?: lotes.first()
            } else {
                loteExistente = lotes.first()
            }

            return atualizaLoteExistente(loteExistente, grupoLinhaProducao, ordemDeFabricacao, serialFabricacao, produto, grupoRecurso, recurso, organizacao)
        }
    }

    Lote criarLote(GrupoLinhaDeProducao grupoLinhaDeProducao, OrdemDeFabricacao ordemDeFabricacao, SerialFabricacao serialFabricacao, ProdutoGrupoLinhaDeProducao produto, GrupoRecurso grupoRecurso, Organizacao organizacao) {
        String descricaoProduto = oracleService.getDescricaoDoProduto(ordemDeFabricacao.codigoProduto, organizacao)
        Date data = new Date()
        String ano  = new SimpleDateFormat("YY").format(data)
        String semana = new SimpleDateFormat("ww").format(data)
        ProdutoEtiqueta produtoEtiqueta = ProdutoEtiqueta.createCriteria().get {
            eq 'codigoProduto', ordemDeFabricacao.codigoProduto
            grupos {
                eq 'id', grupoRecurso.id
            }
        }

        Lote lote = new Lote()
        lote.numeroLote = gerarNumeroLote(semana, ano.toInteger())
        lote.codigoProduto = ordemDeFabricacao.codigoProduto
        lote.quantidade = 1
        lote.grupoLinhaDeProducao = grupoLinhaDeProducao
        lote.ano = ano.toInteger()
        lote.semana = semana
        lote.quantidadeMaxima = produto.quantidadePorPallet
        lote.descricaoProduto = descricaoProduto
        lote.quantidadePorCaixa = produtoEtiqueta?.quantidadeDeEtiquetas
        if (serialFabricacao.isSegregrado()){
            lote.ordemDeFabricacao = serialFabricacao.ordemDeFabricacao
        }
        lote.addToSeriais(serialFabricacao)

        if (lote.quantidadeMaxima != null && lote.quantidade == lote.quantidadeMaxima) {
            lote.statusLote = StatusLote.FECHADO
        }

        crudService.salvar(lote)

        ImpressaoApontamentoLote impressao = ImpressaoApontamentoLote.criarNovaImpressao(lote, serialFabricacao, grupoRecurso)

        if(!impressao.produtoEtiqueta) {
            throw new LoteException("lote.produtoEtiquetaInvalido.message", ordemDeFabricacao.codigoProduto)
        }

        crudService.salvar(impressao)

        return lote
    }

    String gerarNumeroLote(String semana, Integer ano) {
        String ultimoNumeroLote = Lote.createCriteria().get {
            eq('ano', ano)
            eq('semana', semana)
            projections {
                max('numeroLote')
            }
        }

        int ultimoLote = Integer.parseInt((ultimoNumeroLote ?: "0"),16)
        Integer proximoLote = ultimoLote + 1

        return String.format('%4s', Integer.toHexString(proximoLote)).replace(' ', '0').toUpperCase()
    }

    Lote clonarLote(Lote antigo){
        Calendar data = Calendar.getInstance()
        String semana = new SimpleDateFormat("ww").format(data)
        String ano  = new SimpleDateFormat("YY").format(data.getTime())
        Lote lote = new Lote()
        lote.numeroLote = gerarNumeroLote(semana, ano.toInteger())
        lote.codigoProduto = antigo.codigoProduto
        lote.quantidade = antigo.quantidade
        lote.grupoLinhaDeProducao = antigo.grupoLinhaDeProducao
        lote.ano = ano.toInteger()
        lote.semana = semana
        lote.quantidadeMaxima = antigo.quantidadeMaxima
        lote.descricaoProduto = antigo.descricaoProduto
        lote.quantidadePorCaixa = antigo.quantidadePorCaixa
        lote.statusLote = StatusLote.FECHADO
        lote.save(flush: true, failOnError: true)
        return lote
    }

    List<RetornoImpressao> fecharLoteIncompleto(Long id, String codigoLote, String justificativa, Impressora impressora) {
        Lote lote = Lote.findById(id)

        if(justificativa && lote.isIncompleto()) {
            logOperacaoService.fecharLoteIncompleto(codigoLote, justificativa)
        }

        fecharLote(lote)
        return imprimirEtiquetasSeriaisAoFecharLote(lote, impressora)
    }

    void fecharLote(Lote lote) {
        lote.statusLote = StatusLote.FECHADO
        crudService.salvar(lote)
    }


    List<RetornoImpressao> imprimirEtiquetasSeriaisAoFecharLote(Lote lote, Impressora impressora){
        List<RetornoImpressao> retornoEtiquetas = []
        ImpressaoApontamentoLote impressaoLote = ImpressaoApontamentoLote.findByLote(lote)
        if(impressaoLote) {
            ImpressaoApontamentoCaixa ultimaCaixa = impressaoLote.getCaixaAberta()
            if(ultimaCaixa) {
                retornoEtiquetas.addAll(impressoraService.getEtiquetaSerialAposApontamento(impressora, ultimaCaixa, null))
            }
        }

        return retornoEtiquetas
    }

    List<Lote> lotesDisponiveisParaOSerial(OrdemDeFabricacao ordemDeFabricacao, GrupoLinhaDeProducao grupoLinhaProducao, SerialFabricacao serial) {
        return Lote.createCriteria().list({
            eq('codigoProduto', ordemDeFabricacao.codigoProduto)
            eq('statusLote', StatusLote.ABERTO)

            eq('grupoLinhaDeProducao', grupoLinhaProducao)
            if (serial.isSegregrado()){
                eq 'ordemDeFabricacao', serial.ordemDeFabricacao
            } else {
                isNull 'ordemDeFabricacao'
            }
        }) as ArrayList<Lote>
    }

    Lote atualizaLoteExistente(Lote loteAtual,
                               GrupoLinhaDeProducao grupoLinhaDeProducao,
                               OrdemDeFabricacao ordemDeFabricacao,
                               SerialFabricacao serialFabricacao,
                               ProdutoGrupoLinhaDeProducao produto,
                               GrupoRecurso grupoRecurso,
                               Recurso recurso,
                               Organizacao organizacao) {
        ProdutoEtiqueta produtoEtiqueta = ProdutoEtiqueta.createCriteria().get {
            eq 'codigoProduto', loteAtual.codigoProduto
            grupos {
                eq 'id', grupoRecurso.id
            }
        }
        loteAtual = Lote.findByNumeroLoteAndSemanaAndAno(loteAtual.numeroLote, loteAtual.semana, loteAtual.ano) ?: loteAtual
        ImpressaoApontamentoLote impressao = ImpressaoApontamentoLote.findByLoteAndProdutoEtiqueta(loteAtual, produtoEtiqueta)
        if (impressao?.atingiuQuantidadeMaximaDeCaixasNoRecurso(recurso) || impressao?.possuiApenasAUltimaCaixaAbertaEmOutroRecurso(recurso)){
            return criarLote(grupoLinhaDeProducao, ordemDeFabricacao, serialFabricacao, produto, grupoRecurso, organizacao)
        }
        if (produto.quantidadePorPallet && loteAtual.quantidadeMaxima == null) {
            fecharLote(loteAtual)
            criarLote(grupoLinhaDeProducao, ordemDeFabricacao, serialFabricacao, produto, grupoRecurso, organizacao)
        } else {
            if (!produto.quantidadePorPallet && loteAtual.quantidadeMaxima != null) {
                loteAtual.quantidadeMaxima = null
                crudService.salvar(loteAtual)
            }
            adicionaSerial(loteAtual, serialFabricacao)
            impressao?.adicionarSerial(serialFabricacao, recurso)
        }
        loteAtual.refresh()
        if (podeFecharLote(Lote.get(loteAtual?.id) ?: loteAtual)) {
            fecharLote(loteAtual)
        }

        if (impressao) {
            crudService.salvar(impressao)
        }
        return loteAtual
    }

    void adicionaSerial(Lote lote, SerialFabricacao serial) {
        String sql = "insert into gp40.lote_serial(lote_id, serial_id) values(${lote.id}, ${serial.id})"

        sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
    }

    boolean podeFecharLote(Lote loteAtual) {
        loteAtual.quantidadeMaxima != null && loteAtual.quantidade == loteAtual.quantidadeMaxima
    }

    void abrirLote(Long id) {
        Lote lote = Lote.get(id)

        if((!lote.quantidadeMaxima || (lote.quantidade <= lote.quantidadeMaxima)) && !lote.foiAgrupado()) {
                lote.statusLote = StatusLote.ABERTO
                crudService.salvar(lote)
        } else {
            throw new LoteException("faturamento.lote.aberto.erro")
        }
    }

    Date getDataFechamentoLote(Lote lote) {
        String sql = """
            SELECT Greatest(
                (SELECT Max(data) data
                 FROM   log_operacao lo
                        INNER JOIN parametro_log_operacao plo
                                ON plo.log_operacao_id = lo.id
                 WHERE  plo.tipo = '${TipoParametroLogOperacao.CODIGO_LOTE}'
                        AND plo.valor = '${lote.getCodigoLote()}'
                        AND
                lo.tipo_log_operacao = '${TipoLogOperacao.FECHAR_LOTE_INCOMPLETO}'), (
                SELECT Max(data_ultimo_apontamento)
                FROM   serial_fabricacao sf
                INNER JOIN lote_serial ls
                        ON ls.serial_id = sf.id
                INNER JOIN lote l
                        ON l.id = ls.lote_id
                WHERE  l.numero_lote
                || l.semana
                || l.ano = '${lote.getCodigoLote()}')) as dataFechamento
                FROM   dual 
        """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Date
    }

    void concluirOPs(List lotesIDs) {
        List<Lote> lotes = Lote.getAll(lotesIDs)
        List<OrdemDeProducao> ordensDosLotes = lotes.collect {it.seriais.collect {it.ordemDeProducao}}.flatten().unique()

        ordensDosLotes.each {op ->
            List<Lote> lotesDaOP = lotes.findAll {it.seriais.any {it.ordemDeProducao == op}}
            List<LoteQuantidadeRecebimento> lotesQuantidades = lotesDaOP.collectEntries {lote ->
                return [lote.getCodigoLote(), lote.getQuantidadePorOP(op.getCodigoOrdem())]
            }.findAll {it.value}.collect {new LoteQuantidadeRecebimento(codigoLote: it.key, quantidade: it.value)}

            RecebimentoNF recebimentoNF = new RecebimentoNF(interfaceTransactionId: 0,
                    ordemDeProducao: op.getCodigoOrdem(),
                    quantidade: lotesQuantidades.sum {it.quantidade},
                    lotesQuantidades: lotesQuantidades,
                    sequenciaOperacao: 10,
                    dataCriacao: new Date(),
                    dataUltimaAtualizacao: new Date())

            recebimentoNF.save(failOnError: true)
        }

        lotes.each {
            it.statusLote = StatusLote.CONCLUIDO
            it.save(failOnError: true)
        }
    }
}
