package br.com.furukawa.service

import br.com.furukawa.dtos.OrdemDeProducaoDTO
import br.com.furukawa.dtos.ProgramacaoOrdemDeProducaoDTO
import br.com.furukawa.dtos.QuantidadeProgramadaOrdemDeProducaoDTO
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.RecebimentoNF
import br.com.furukawa.utils.DateUtils
import grails.gorm.transactions.Transactional
import groovy.time.TimeCategory
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.sql.JoinType
import org.hibernate.transform.Transformers
import org.hibernate.type.IntegerType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import java.text.SimpleDateFormat

@Transactional
class HomeService {

    SessionFactory sessionFactory
    CrudService crudService
    UserService userService

    int getLotesByLocal(Fornecedor fornecedorFiltro, StatusLote statusLote) {
        return Lote.createCriteria().get {
            createAlias('grupoLinhaDeProducao', 'g', JoinType.LEFT_OUTER_JOIN)
            eq "statusLote", statusLote
            or {
                eq 'g.fornecedor', fornecedorFiltro
            }
            projections {
                rowCount()
            }
        } as int
    }

    ProgramacaoOrdemDeProducaoDTO getProgramacaoOrdensDeProducao(Long idGrupoDeLinhas, Fornecedor fornecedor) {
        Date agora = new Date()
        QuantidadeProgramadaOrdemDeProducaoDTO ordensHoje = buscaOrdensDeProducao(idGrupoDeLinhas, fornecedor, DateUtils.inicioDoDia(agora), DateUtils.fimDoDia(agora))
        QuantidadeProgramadaOrdemDeProducaoDTO ordensSemana = buscaOrdensDeProducao(idGrupoDeLinhas, fornecedor, DateUtils.inicioDoDia(agora), DateUtils.dataMaisSeteDias(agora))
        QuantidadeProgramadaOrdemDeProducaoDTO ordensMes = buscaOrdensDeProducao(idGrupoDeLinhas, fornecedor, DateUtils.inicioDoDia(agora), DateUtils.dataMaisTrintaDias(agora))

        return new ProgramacaoOrdemDeProducaoDTO(
                opProgramadasParaHoje: ordensHoje,
                opProgramadasParaAProximaSemana: ordensSemana,
                opProgramadasParaOProximoMes: ordensMes)
    }

    QuantidadeProgramadaOrdemDeProducaoDTO buscaOrdensDeProducao (Long idGrupoDeLinhas, Fornecedor fornecedor, Date dataInicial, Date dataFinal) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yy HH:mm:ss")

        String sql = """SELECT Count(*)-sum(produzida) AS quantidadePendente,
                               Sum(produzida) AS quantidadeProduzida
                        FROM  (SELECT idop,
                                      quantidade,
                                      qf,
                                      CASE
                                        WHEN qf >= quantidade THEN 1
                                        ELSE 0
                                      END AS produzida
                               FROM   (SELECT gop.id                                 AS idOP,
                                              gop.quantidade,
                                              Nvl(Sum((SELECT COUNT(*) FROM SERIAL_FABRICACAO s WHERE s.ORDEM_DE_FABRICACAO_ID = gof.id AND s.STATUS_SERIAL = '${StatusSerialFabricacao.APONTAMENTO_FINALIZADO.name()}')), 0) AS QF
                                       FROM   ordem_de_fabricacao gof
                                              RIGHT JOIN ordem_de_producao gop
                                                      ON gof.ordem_de_producao_id = gop.id
                                            left join produto_grupo_linha pgl on gop.codigo_produto=pgl.codigo
                                       WHERE  gop.fornecedor_id = ${fornecedor.id}
                                              AND gop.data_previsao_finalizacao BETWEEN
                                                  To_date('${sdf.format(dataInicial)}', 'DD/MM/YY HH24:MI:SS') AND To_date('${sdf.format(dataFinal)}', 'DD/MM/YY HH24:MI:SS')
                                              ${idGrupoDeLinhas ? " AND pgl.grupo_linha_id=${idGrupoDeLinhas}" : ""}   
                                              AND ( gof.id IS NULL
                                                     OR gof.status != '${StatusOrdemFabricacao.CANCELADA.name()}' )
                                       GROUP  BY gop.id,
                                                 gop.quantidade))"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        .addScalar("quantidadePendente", new IntegerType())
        .addScalar("quantidadeProduzida", new IntegerType())
        .setResultTransformer(Transformers.aliasToBean(QuantidadeProgramadaOrdemDeProducaoDTO.class))

        return query.uniqueResult() as QuantidadeProgramadaOrdemDeProducaoDTO
    }

    Long totalBuscaOrdensDeProducaoAtrasadas (Long idGrupoLinha)    {
        Fornecedor fornecedor = crudService.getFornecedorLogado()

        String sql = """SELECT COUNT(*) FROM (${getSQLOrdensAtrasadas(fornecedor, idGrupoLinha)}) """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    Long getOpsComErros(Long idGrupoLinha){
        List<Fornecedor> fornecedores = userService.getUsuarioLogado().getAcessos()*.getFornecedores().flatten()
        String sql = """SELECT COUNT(*) 
            FROM ORDEM_DE_PRODUCAO op
                LEFT JOIN produto_grupo_linha pgl 
                    ON op.codigo_produto=pgl.codigo
            WHERE op.STATUS = 'ERRO_EXPORTACAO'
            AND op.FORNECEDOR_ID IN (${fornecedores*.id.collect({"'$it'"}).join(", ")})
            AND op.STATUS_WIP = '${StatusOrdemDeProducaoWIP.LIBERADO.name()}'
            ${idGrupoLinha ? " AND pgl.grupo_linha_id=${idGrupoLinha}" : ""}
        """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    Long getRecebimentosErro(Fornecedor fornecedor){
        String sql = """
            SELECT COUNT(r.id)
            FROM RECEBIMENTO_NF r
            WHERE r.version > 10
                AND r.status <> 'CONCLUIDA'
                AND UPPER(r.ORDEM_DE_PRODUCAO) LIKE UPPER('${fornecedor.prefixoProducao}%')
                AND r.is_concluir_manualmente = 0
        """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    List<OrdemDeProducaoDTO> buscaOrdensDeProducaoAtrasadas (Long grupoLinhas, Integer offset, Integer max, String sort, String order) {

        Fornecedor fornecedor = crudService.getFornecedorLogado()

        String sql = """${getSQLOrdensAtrasadas(fornecedor, grupoLinhas)} 
                                  ORDER BY ${sort} ${order}"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("codigoOrdem", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("pedido", new StringType())
        query.addScalar("roteiro", new StringType())
        query.addScalar("dataPrevisaoFinalizacao", new StringType())
        query.addScalar("quantidade", new LongType())
        query.setResultTransformer(Transformers.aliasToBean(OrdemDeProducaoDTO.class))

        query.setFirstResult(offset)
        query.setMaxResults(max)

        return query.list()
    }

    String getSQLOrdensAtrasadas(Fornecedor fornecedor, Long idGrupoLinha) {
        Date data = DateUtils.inicioDoDia(new Date())
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yy HH:mm:ss")

        return """
               SELECT quantidade,
                       f.prefixo_producao
                       || '-'
                       || numero                 AS codigoOrdem,
                       codigo_produto            AS codigoProduto,
                       nvl(prod.descricao, c.descricao_produto)         AS descricaoProduto,
                       pedido,
                       roteiro,
                       to_char(data_previsao_finalizacao, 'DD/MM/YYYY') AS dataPrevisaoFinalizacao
                FROM   (SELECT gop.fornecedor_id,
                               gop.quantidade,
                               gop.numero,
                               gop.codigo_produto,
                               gop.descricao_produto,
                               gop.pedido,
                               gop.roteiro,
                               gop.data_previsao_finalizacao,
                               Nvl(Sum((SELECT COUNT(*) FROM SERIAL_FABRICACAO s WHERE s.ORDEM_DE_FABRICACAO_ID = gof.id AND s.STATUS_SERIAL = '${StatusSerialFabricacao.APONTAMENTO_FINALIZADO.name()}')), 0) AS QF
                        FROM   ordem_de_fabricacao gof
                               RIGHT JOIN ordem_de_producao gop
                                       ON gof.ordem_de_producao_id = gop.id
                                LEFT JOIN produto_grupo_linha pgl 
                                       ON gop.codigo_produto = pgl.codigo
                        WHERE  gop.fornecedor_id = ${fornecedor.id}
                               AND gop.status_wip not in('${StatusOrdemDeProducaoWIP.CANCELADO.name()}', 
                                                         '${StatusOrdemDeProducaoWIP.CONCLUIDO.name()}',
                                                         '${StatusOrdemDeProducaoWIP.FECHADO.name()}')
                               AND gop.data_previsao_finalizacao <
                                   To_date('${sdf.format(data)}', 'DD/MM/YY HH24:MI:SS')
                               AND ( gof.id IS NULL
                                      OR gof.status != '${StatusOrdemFabricacao.CANCELADA.name()}' )
                                ${idGrupoLinha ? " AND pgl.grupo_linha_id=${idGrupoLinha}" : ""}
                        GROUP  BY gop.fornecedor_id,
                                  gop.quantidade,
                                  gop.numero,
                                  gop.codigo_produto,
                                  gop.descricao_produto,
                                  gop.pedido,
                                  gop.roteiro,
                                  gop.data_previsao_finalizacao) c
                       INNER JOIN fornecedor f
                               ON f.id = c.fornecedor_id
                       LEFT JOIN produto prod
                                ON PROD.CODIGO=C.CODIGO_PRODUTO 
                                AND PROD.ORGANIZATION_ID=F.ORGANIZATION_ID
                WHERE  quantidade > qf 
          """
    }
}
