package br.com.furukawa.service

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.filtros.FiltroOrdemFabricacao
import br.com.furukawa.dtos.OrdemDeFabricacaoDTO
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaSeriaisOrdemDeFabricacao
import br.com.furukawa.dtos.impressao.LinhasImpressaoSeriais
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.exceptions.OrdemDeFabricacaoException
import br.com.furukawa.model.ConfiguracaoGeral
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.MateriaPrimaSeparacao
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.ProdutoEtiqueta
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.model.User
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import javax.persistence.Query

@Transactional
class OrdemDeFabricacaoService {

    SessionFactory sessionFactory
    LogOperacaoService logOperacaoService
    OracleService oracleService

    List<ImpressaoEtiquetaSeriaisOrdemDeFabricacao> montaImpressaoEtiquetaDTO(OrdemDeFabricacao ordemDeFabricacao) {
        String codigoLote = ordemDeFabricacao.ordemDeProducao.codigoOrdem
        ProdutoEtiqueta produtoEtiqueta = ProdutoEtiqueta.findByCodigoProdutoAndSerialAndFornecedor(ordemDeFabricacao.codigoProduto, true, ordemDeFabricacao.fornecedor)
        ArrayList<LinhasImpressaoSeriais> linhas = montaLinhasImpressaoEtiquetaDTO(ordemDeFabricacao, produtoEtiqueta, codigoLote)
        Set<String> identificadores = produtoEtiqueta?.etiquetas ?: [ConfiguracaoGeral.getIdentificadorDaEtiquetaSeriaisDaOrdemFabricacao()]

        return identificadores.collect({identificador ->
            return new ImpressaoEtiquetaSeriaisOrdemDeFabricacao(
                    identificador: identificador,
                    codigoLote   : codigoLote,
                    linhas       : linhas
            )
        })
    }

    private ArrayList<LinhasImpressaoSeriais> montaLinhasImpressaoEtiquetaDTO(OrdemDeFabricacao ordemDeFabricacao, ProdutoEtiqueta produtoEtiqueta, String codigoLote) {
        List<SerialFabricacao> seriais = SerialFabricacao.findAllByOrdemDeFabricacao(ordemDeFabricacao, [sort: 'codigo'])
        List<LinhasImpressaoSeriais> linhas = new ArrayList<>()
        int agrupamento = produtoEtiqueta?.serial ? (produtoEtiqueta?.quantidadeDeEtiquetas ?: 4) : 4
        int totalLinhas = Math.ceil(seriais.size() / agrupamento)

        totalLinhas.times { idxLinha ->
            int inicioLinha = agrupamento * idxLinha
            int fimLinha = Math.min(inicioLinha + agrupamento, seriais.size())
            List<String> seriaisLinha = seriais.subList(inicioLinha, fimLinha).collect({it?.codigoCompleto})

            linhas.add(new LinhasImpressaoSeriais(seriaisLinha, codigoLote, agrupamento))
        }
        return linhas
    }

    List<OrdemDeFabricacaoDTO> getOrdensDeFabricacao(FiltroOrdemFabricacao filtro, Fornecedor fornecedor, boolean paginacao){
        String sql = getOrdensDeFabricacaoSQL(filtro, fornecedor)
        Query query = sessionFactory.currentSession.createSQLQuery(sql)

        query.addScalar("id", new LongType())
        query.addScalar("ordemFabricacao", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("grupoLinhasProducao", new StringType())
        query.addScalar("linhaProducao", new StringType())
        query.addScalar("ordemProducao", new StringType())
        query.addScalar("statusWIP", new StringType())
        query.addScalar("status", new StringType())
        query.addScalar("justificativa", new StringType())
        query.addScalar("dataCriacao", new StringType())
        query.addScalar("ordemSequenciamento", new LongType())
        query.addScalar("cliente", new StringType())
        query.addScalar("comprimento", new StringType())
        query.addScalar("quantidadeProgramada", new LongType())
        query.addScalar("quantidadeProduzida", new LongType())
        query.addScalar("dataPrevisaoFinalizacao", new StringType())
        query.addScalar("dataUltimaImpressao", new StringType())
        query.addScalar("comentarios", new StringType())

        query.setResultTransformer(Transformers.aliasToBean(OrdemDeFabricacaoDTO.class))
        if(paginacao) {
            query.setMaxResults(filtro.paginacao.max)
            query.setFirstResult(filtro.paginacao.offSet)
        }

        return query.list() as List<OrdemDeFabricacaoDTO>
    }

    Integer getOrdensDeFabricacaoTotal(FiltroOrdemFabricacao filtro, Fornecedor fornecedor){
        String sql = getOrdensDeFabricacaoSQL(filtro, fornecedor)
        def sqlCount = """
            SELECT count(*)
            FROM ($sql)
            """

        NativeQuery queryTotal = sessionFactory.currentSession.createSQLQuery(sqlCount)

        return queryTotal.uniqueResult() as Integer
    }

    String getOrdensDeFabricacaoSQL(FiltroOrdemFabricacao filtro, Fornecedor fornecedor){
        String where = filtro.gerarWhere()
        String order = filtro.gerarOrderBy()

        if (filtro.ordemProducao){
            if (filtro.ordemProducao.length == 1){
                String valor = filtro.ordemProducao[0]
                where += " AND ((UPPER(gopf.prefixo_producao) LIKE UPPER('%${valor}%')) OR (UPPER(gop.numero) LIKE UPPER('%${valor}%')))\n"
            } else if (filtro.ordemProducao.length == 2){
                String prefixo = filtro.ordemProducao[0]
                String numero = filtro.ordemProducao[1]
                where += " AND ((UPPER(gopf.prefixo_producao) LIKE UPPER('%${prefixo}%')) AND (UPPER(gop.numero) LIKE UPPER('%${numero}%')))\n"
            }
        }

        where += " AND f.id = '${fornecedor.id}'\n"

        return """
            SELECT DISTINCT gof.id as id,
                gof.numero || '-' || gof.ano as ordemFabricacao,
                gof.codigo_produto as codigoProduto,
                nvl(prod.descricao, gop.descricao_produto) as descricaoProduto,
                gldp.nome as grupoLinhasProducao,
                ldp.nome as linhaProducao,
                gopf.prefixo_producao || '-' || gop.numero as ordemProducao,
                gof.status as status,
                gop.justificativa as justificativa,
                gop.status_wip as statusWIP,
                to_char(gof.data_criacao, 'DD/MM/YYYY HH24:MI') as dataCriacao,
                gof.ordem as ordemSequenciamento,
                gof.comentarios as comentarios,
                client.valor as cliente,
                comp.valor as comprimento,
                gof.quantidade_total as quantidadeProgramada,
                (SELECT COUNT(*) FROM gp40.SERIAL_FABRICACAO s WHERE s.ORDEM_DE_FABRICACAO_ID = gof.id AND s.STATUS_SERIAL = '${StatusSerialFabricacao.APONTAMENTO_FINALIZADO.name()}') as quantidadeProduzida,
                to_char(gop.data_previsao_finalizacao, 'DD/MM/YYYY') as dataPrevisaoFinalizacao,
                (SELECT To_char(Max(log.data), 'DD/MM/YYYY')
                    FROM   gp40.log_operacao log
                           LEFT JOIN gp40.parametro_log_operacao logp
                                  ON logp.log_operacao_id = log.id
                                     AND logp.tipo = '${TipoParametroLogOperacao.ORDEM_FABRICACAO.name()}'
                    WHERE  log.tipo_log_operacao = '${TipoLogOperacao.IMPRIMIR_ETIQUETA_OF.name()}'
                           AND rownum = 1
                           AND logp.valor = gof.numero
                                            || '-'
                                            || gof.ano ) as dataUltimaImpressao
            FROM gp40.ORDEM_DE_FABRICACAO gof
                JOIN gp40.ORDEM_DE_PRODUCAO gop
                    ON gof.ORDEM_DE_PRODUCAO_ID = gop.id
                JOIN gp40.GRUPO_LINHA_PRODUCAO gldp
                    ON gof.GRUPO_LINHA_PRODUCAO_ID = gldp.id
                LEFT JOIN gp40.LINHA_DE_PRODUCAO ldp
                    ON gof.LINHA_DE_PRODUCAO_ID = ldp.id
                JOIN gp40.FORNECEDOR f
                    ON gof.FORNECEDOR_ID = f.id
                LEFT join gp40.produto prod
                    on prod.codigo=gop.codigo_produto
                    and prod.organization_id=f.organization_id 
                JOIN gp40.FORNECEDOR gopf
                    ON gop.FORNECEDOR_ID = gopf.id
                LEFT JOIN gp40.ITEM_CATALOGO comp
                    ON comp.CODIGO_PRODUTO = gof.codigo_produto AND comp.NOME = '${ItensCatalogoFixos.COMPRIMENTO}' and comp.organization_id=${fornecedor.organizationId}
                LEFT JOIN gp40.ITEM_CATALOGO client
                    ON client.CODIGO_PRODUTO = gof.codigo_produto AND client.NOME = '${ItensCatalogoFixos.MODELO}' and client.organization_id=${fornecedor.organizationId}
            $where
            GROUP BY gof.id, gof.numero || '-' || gof.ano, gof.codigo_produto, gof.comentarios,  nvl(prod.descricao, gop.descricao_produto), gldp.nome, ldp.nome, gopf.prefixo_producao || '-' || gop.numero, gof.status, gop.justificativa, gop.status_wip, to_char(gof.data_criacao, 'DD/MM/YYYY HH24:MI'), gof.ordem, client.valor, comp.valor, gof.quantidade_total, to_char(gop.data_previsao_finalizacao, 'DD/MM/YYYY')
            $order
        """
    }

    void enviarParaSeparacao(OrdemDeFabricacao ordemFabricacao, String justificativa, Date dataSeparacao, List<ComponenteWIP> materiasPrimas){
        ordemFabricacao.status = StatusOrdemFabricacao.EM_SEPARACAO
        ordemFabricacao.dataPrevisaoSeparacao = dataSeparacao
        ordemFabricacao.materiasPrimasSeparacao?.clear()
        materiasPrimas.each {
            MateriaPrimaSeparacao materiaPrimaSeparacao = new MateriaPrimaSeparacao()

            materiaPrimaSeparacao.codigoProduto = it.codigoProduto
            materiaPrimaSeparacao.descricaoProduto = it.descricaoProduto
            materiaPrimaSeparacao.quantidade = it.quantidadePorMontagem * (ordemFabricacao.quantidadeTotal - ordemFabricacao.quantidadeFinalizada)

            ordemFabricacao.addToMateriasPrimasSeparacao(materiaPrimaSeparacao)
        }
        logOperacaoService.enviarOFParaSeparacao(ordemFabricacao, justificativa)
        ordemFabricacao.save(flush: true, failOnError: true)
    }

    void alterarQuantidade(OrdemDeFabricacao ordemFabricacao, Long novaQuantidadeTotal){
        Long quantidadeIniciada = ordemFabricacao.quantidadeIniciada
        Long quantidadeTotalAntiga = ordemFabricacao.quantidadeTotal
        if (novaQuantidadeTotal < quantidadeIniciada){
            throw new OrdemDeFabricacaoException("ordemFabricacao.alterarQuantidade.semQuantidade.message", [quantidadeIniciada] as Object[])
        }
        if (novaQuantidadeTotal > quantidadeTotalAntiga){
            throw new OrdemDeFabricacaoException("ordemFabricacao.alterarQuantidade.maiorQueAntiga.message", [quantidadeTotalAntiga] as Object[])
        }
        if (novaQuantidadeTotal < quantidadeTotalAntiga){
            Long diferenca = quantidadeTotalAntiga - novaQuantidadeTotal
            deletarSeriaisNaoIniciados(ordemFabricacao, diferenca)
            ordemFabricacao.ordemDeProducao.quantidadeDisponivelFabricacao += diferenca
            ordemFabricacao.ordemDeProducao.save(flush: true, failOnError: true)
        }
        if(novaQuantidadeTotal == ordemFabricacao.getQuantidadeFinalizada()) {
            ordemFabricacao.status = StatusOrdemFabricacao.FINALIZADA
        }
        ordemFabricacao.quantidadeTotal = novaQuantidadeTotal
        if(!ordemFabricacao.materiasPrimasSeparacao?.isEmpty()) {
            List<ComponenteWIP> componentes = oracleService.getComponentesRoteiroWIP(
                    ordemFabricacao.getCodigoOrdemDeProducao(),
                    ordemFabricacao.fornecedor.organizationId,
                    ordemFabricacao.fornecedor.getOrganizacaoDoFornecedor().idioma,
                    true
            )

            ordemFabricacao.materiasPrimasSeparacao?.each {mp ->
                ComponenteWIP componenteWIP = componentes.find {it.codigoProduto == mp.codigoProduto}
                mp.quantidade = (componenteWIP?.quantidadePorMontagem ?: 1) * (ordemFabricacao.quantidadeTotal - ordemFabricacao.quantidadeFinalizada)
            }
        }

        ordemFabricacao.save(flush: true, failOnError: true)
    }

    void deletarSeriaisNaoIniciados(OrdemDeFabricacao ordemFabricacao, Long quantidade){
        String selectSql = """
            SELECT s.id
            FROM SERIAL_FABRICACAO s
            WHERE s.ORDEM_DE_FABRICACAO_ID = '${ordemFabricacao.id}'
            AND s.STATUS_SERIAL IN (${StatusSerialFabricacao.getStatusNaoIniciados().collect({"'${it.name()}'"}).join(", ")})
            FETCH FIRST ${quantidade} ROWS ONLY
        """
        String deleteQuery = """
            DELETE FROM SERIAL_FABRICACAO s
            WHERE s.id IN ($selectSql)
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(deleteQuery)
        query.executeUpdate()
    }

    void cancelarOrdensFabricacao(List<Integer> ids){
        String updateQuery = """
            UPDATE ORDEM_DE_FABRICACAO odf
            SET odf.STATUS = '${StatusOrdemFabricacao.CANCELADA}'
            WHERE odf.ID IN (${ids.join(", ")})
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(updateQuery)
        query.executeUpdate()
    }
}
