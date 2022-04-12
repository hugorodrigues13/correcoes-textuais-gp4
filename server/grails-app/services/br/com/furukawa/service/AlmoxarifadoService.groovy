package br.com.furukawa.service

import br.com.furukawa.dtos.ItemPedidoReposicaoMaterialDTO
import br.com.furukawa.dtos.PedidoReposicaoMaterialDTO
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.exceptions.AlmoxarifadoException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.ItemPedidoReposicaoMaterial
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.User
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.BigDecimalType
import org.hibernate.type.BooleanType
import org.hibernate.type.DateType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

@Transactional
class AlmoxarifadoService {

    SessionFactory sessionFactory
    LogOperacaoService logOperacaoService

    void liberarOrdemDeFabricacaoSeparacao(OrdemDeFabricacao ordemDeFabricacao, User usuarioSeparacao, String justificativa) {
        boolean isPrimeira = ordemDeFabricacao.isPrimeiroDoSequenciamento()
        if (!justificativa && !isPrimeira){
            throw new AlmoxarifadoException("almoxarifado.precisaJustificativa.message")
        }
        ordemDeFabricacao.status = StatusOrdemFabricacao.ABERTA
        ordemDeFabricacao.usuarioSeparacao = usuarioSeparacao.username
        ordemDeFabricacao.dataSeparacao = new Date()

        ordemDeFabricacao.save(flush: true, failOnError: true)
        if (!isPrimeira){
            logOperacaoService.liberarOrdemFabricacao(ordemDeFabricacao, justificativa)
        }
    }

    List<PedidoReposicaoMaterialDTO> getPedidosReposicaoMaterial(Fornecedor fornecedor, String recurso, String linhaProducao, String codigoProduto, String descricaoProduto, int max, int offset){
        String sql = getSqlPedidosReposicaoMaterial(fornecedor, recurso, linhaProducao, codigoProduto, descricaoProduto)
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("recurso", new LongType())
        query.addScalar("recursoNome", new StringType())
        query.addScalar("linha", new StringType())
        query.addScalar("chavePrimaria", new StringType())
        query.addScalar("previsaoEntrega", new StringType())
        query.addScalar("isLiberado", new BooleanType())
        query.setResultTransformer(Transformers.aliasToBean(PedidoReposicaoMaterialDTO.class))

        query.setFirstResult(offset)
        query.setMaxResults(max)
        List<PedidoReposicaoMaterialDTO> dtos = query.list()
        dtos.each {it.itens = getItensPedidosReposicao(it)}
        return dtos
    }

    int getTotalPedidosReposicaoMaterial(Fornecedor fornecedor, String recurso, String linhaProducao, String codigoProduto, String descricaoProduto){
        String sql = getSqlPedidosReposicaoMaterial(fornecedor, recurso, linhaProducao, codigoProduto, descricaoProduto)

        String countSql = """SELECT Count(*) 
                        from (${sql})
                      """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(countSql)

        return query.uniqueResult() as Integer
    }

    String getSqlPedidosReposicaoMaterial(Fornecedor fornecedor, String recurso, String linhaProducao, String codigoProduto, String descricaoProduto){
        return """
            SELECT DISTINCT ped.id AS id,
                ped.recurso_id as recurso,
                ped.chave_primaria as chavePrimaria,
                to_char(ped.previsao_entrega, 'dd/mm/yyyy hh24:mi') as previsaoEntrega,
                ped.previsao_entrega,
                ped.is_liberado as isLiberado,
                rec.nome as recursoNome,
                ldp.nome as linha,
                ped.data_criacao
            FROM PEDIDO_REP_MATERIAL ped
                INNER JOIN ITEM_PEDIDO_REPOSICAO it
                    ON it.pedido_reposicao_id = ped.id
                INNER JOIN RECURSO rec
                    ON rec.id = ped.recurso_id
                INNER JOIN RECURSO_GRUPO recgr
                    ON rec.id = recgr.recurso_id
                INNER JOIN GRUPO_RECURSO grec
                    ON grec.id = recgr.grupo_id
               inner join processo_lp pl 
                    on pl.grupo_recurso_id=grec.id
                INNER JOIN LINHA_DE_PRODUCAO ldp
                    ON ldp.id = pl.linha_de_producao_id
            WHERE rec.fornecedor_id = ${fornecedor.id}
                AND ped.is_liberado = 0
                ${recurso ? "AND (UPPER(rec.nome) LIKE UPPER('%${recurso}%'))" : ""}
                ${linhaProducao ? "AND (UPPER(ldp.nome) LIKE UPPER('%${linhaProducao}%'))" : ""}
                ${codigoProduto ? "AND (UPPER(it.codigo_produto) LIKE UPPER('%${codigoProduto}%'))" : ""}
                ${descricaoProduto ? "AND (UPPER(it.descricao_produto) LIKE UPPER('%${descricaoProduto}%'))" : ""}
            ORDER BY ped.previsao_entrega DESC NULLS LAST, ped.data_criacao ASC    
"""
    }

    List<ItemPedidoReposicaoMaterialDTO> getItensPedidosReposicao(PedidoReposicaoMaterialDTO pedido){
        String sql = """
            SELECT it.id as id,
                   it.codigo_produto as codigoProduto,
                   it.descricao_produto as descricaoProduto,
                   it.quantidade as quantidade
            FROM item_pedido_reposicao it
            WHERE it.pedido_reposicao_id = ${pedido.id}
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("quantidade", new BigDecimalType())
        query.setResultTransformer(Transformers.aliasToBean(ItemPedidoReposicaoMaterialDTO.class))
        ItemPedidoReposicaoMaterial
        return query.list()
    }

}
