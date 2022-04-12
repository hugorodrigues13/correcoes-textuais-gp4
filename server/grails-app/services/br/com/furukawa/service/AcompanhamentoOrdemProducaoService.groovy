package br.com.furukawa.service

import br.com.furukawa.dtos.OrdemDeProducaoDTO
import br.com.furukawa.dtos.filtros.FiltroAcompanhamentoOP
import br.com.furukawa.dtos.importer.AlteracaoOPImporter
import br.com.furukawa.dtos.importer.ImportResponse
import br.com.furukawa.dtos.importer.Importer
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.exceptions.OrdemDeProducaoException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import grails.gorm.transactions.Transactional
import org.apache.commons.io.FileUtils
import org.apache.commons.io.IOUtils
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.StringType
import org.springframework.web.multipart.MultipartFile

import java.text.SimpleDateFormat

@Transactional
class AcompanhamentoOrdemProducaoService {

    SessionFactory sessionFactory
    OracleService oracleService
    MensagemService mensagemService

    SimpleDateFormat SDF = new SimpleDateFormat('dd/MM/yyyy');

    List<OrdemDeProducaoDTO> getOrdensDeProducao(List<Fornecedor> userFornecedores, FiltroAcompanhamentoOP filtro) {
        String sql = getSqlAcompanhamentosOrdemDeProducao(userFornecedores, filtro)
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("codigoOrdem", new StringType())
        query.addScalar("status", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("lista", new StringType())
        query.addScalar("roteiro", new StringType())
        query.addScalar("fornecedor", new StringType())
        query.addScalar("pedido", new StringType())
        query.addScalar("quantidade", new LongType())
        query.addScalar("quantidadeRestante", new LongType())
        query.addScalar("quantidadeEntregue", new LongType())
        query.addScalar("quantidadePendenteRomaneio", new LongType())
        query.addScalar("quantidadeTransito", new LongType())
        query.addScalar("planejador", new StringType())
        query.addScalar("dataCriacao", new StringType())
        query.addScalar("dataPrevisaoFinalizacao", new StringType())
        query.addScalar("erroExportacao", new StringType())
        query.addScalar("statusOracle", new StringType())
        query.addScalar("release", new StringType())
        query.addScalar("codigoServico", new StringType())
        query.addScalar("linha", new StringType())
        query.addScalar("justificativa", new StringType())
        query.addScalar("totalSequenciado", new LongType())
        query.addScalar("totalPecasProducao", new LongType())
        query.addScalar("totalPecasFinalizadas", new LongType())
        query.addScalar("grupoLinhas", new StringType())
        query.addScalar("modelo", new StringType())
        query.addScalar("comprimento", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(OrdemDeProducaoDTO.class))

        query.setFirstResult(filtro.paginacao.offSet)
        if(filtro.paginacao.max) {
            query.setMaxResults(filtro.paginacao.max)
        }
        return query.list()
    }

    Integer getTotalOrdensDeProducao(List<Fornecedor> userFornecedores, FiltroAcompanhamentoOP filtro) {
        String sql = getSqlAcompanhamentosOrdemDeProducao(userFornecedores, filtro)

        String countSql = """SELECT Count(*) 
                        from (${sql})
                      """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(countSql)

        return query.uniqueResult() as Integer
    }

    String getSqlAcompanhamentosOrdemDeProducao(List<Fornecedor> userFornecedores, FiltroAcompanhamentoOP filtro) {
        String fornecedores = userFornecedores.collect({it.id}).join(", ")

        return """
            SELECT op.id AS id,
                f.nome as fornecedor,
                op.pedido as pedido,
                op.codigo_produto as codigoProduto,
                NVL(PROD.DESCRICAO, op.descricao_produto) as descricaoProduto,
                op.lista as lista,
                op.roteiro as roteiro,
                op.status as status,
                op.status_wip as statusOracle,
                op.release as release,
                op.linha as linha,
                op.codigo_servico as codigoServico,
                op.erro_exportacao as erroExportacao,
                op.quantidade as quantidade,
                op.quantidade_entregue as quantidadeEntregue,
                (op.quantidade - op.quantidade_entregue) as quantidadeRestante,
                (${FiltroAcompanhamentoOP.montaSubQueryTotalPecasPendentesRomaneio()}) as quantidadePendenteRomaneio,
                (${FiltroAcompanhamentoOP.montaSubQueryTotalPecasEmRomaneio()} - op.quantidade_entregue) as quantidadeTransito,
                (f.prefixo_producao || '-' || op.numero) as codigoOrdem,
                op.planejador as planejador,
                to_char(op.data_criacao, 'DD/MM/YYYY HH24:MI') as dataCriacao,
                to_char(op.data_previsao_finalizacao, 'DD/MM/YYYY') as dataPrevisaoFinalizacao,
                op.justificativa as justificativa,
                ${FiltroAcompanhamentoOP.montaSubQueryTotalSequenciado()} as totalSequenciado,
                ${FiltroAcompanhamentoOP.montaSubQueryTotalPecasProducao()} as totalPecasProducao,
                ${FiltroAcompanhamentoOP.montaSubQueryTotalPecasFinalizadas()} as totalPecasFinalizadas,
                ${FiltroAcompanhamentoOP.montaSubQueryGrupoLinha()} as grupoLinhas,
                client.valor as modelo,
                comp.valor as comprimento
            FROM ORDEM_DE_PRODUCAO op
                INNER JOIN FORNECEDOR f
                    ON f.id = op.fornecedor_id
                 LEFT JOIN ITEM_CATALOGO comp
                    ON comp.CODIGO_PRODUTO = op.codigo_produto AND comp.NOME = 'COMPRIMENTO' AND comp.organization_id = f.organization_ID
                LEFT JOIN ITEM_CATALOGO client
                    ON client.CODIGO_PRODUTO = op.codigo_produto AND client.NOME = 'MODELO' AND client.organization_id = f.organization_ID
                left join gp40.produto prod
                    on prod.codigo=op.codigo_produto
                    and prod.organization_id=f.organization_id
                ${filtro.gerarWhere()}
                    AND f.id in (${fornecedores})
                ${filtro.gerarOrderBy()}  
            """
    }

    void editarOrdemDeProducao(OrdemDeProducao ordemProducao, Long quantidade, StatusOrdemDeProducaoWIP status, Date dataPrometida, Organizacao organizacao){
        checaAlteracoesNaOP(ordemProducao, quantidade, status, dataPrometida)
        validaAlteracoesNaOP(ordemProducao, quantidade, status, dataPrometida)

        ordemProducao.quantidade = quantidade
        ordemProducao.dataPrevisaoFinalizacao = dataPrometida
        ordemProducao.wipStatusType = status
        ordemProducao.save(flush: true, failOnError: true)

        oracleService.alterarOrdemDeProducao(ordemProducao, organizacao)
    }

    void checaAlteracoesNaOP(OrdemDeProducao ordemProducao, Long quantidade, StatusOrdemDeProducaoWIP status, Date dataPrometida) {
        if (ordemProducao.quantidade != quantidade) return
        if (ordemProducao.wipStatusType != status) return
        if (OrdemDeProducao.SDF_DIA.format(ordemProducao.dataPrevisaoFinalizacao) != OrdemDeProducao.SDF_DIA.format(dataPrometida)) return
        throw new OrdemDeProducaoException("acompanhamento.op.erro.nadaAlterado", null, true)
    }

    void validaAlteracoesNaOP(OrdemDeProducao ordemProducao, Long quantidade, StatusOrdemDeProducaoWIP status, Date dataPrometida) {
        if (ordemProducao.wipStatusType == null){
            throw new OrdemDeProducaoException("acompanhamento.op.erro.naoCriada")
        }
        if (quantidade > ordemProducao.quantidade){
            throw new OrdemDeProducaoException("acompanhamento.op.erro.quantidade.aumentar")
        }
        if (quantidade < ordemProducao.totalPecasSequenciadas){
            throw new OrdemDeProducaoException("acompanhamento.op.erro.quantidade")
        }
        if (dataPrometida < new Date()){
            throw new OrdemDeProducaoException("acompanhamento.op.erro.dataPrometida")
        }
    }

    ImportResponse editarEmMassa(MultipartFile multipartFile, Organizacao organizacao, Locale locale) {
        File file = File.createTempFile('temp', '.xls')
        FileUtils.writeByteArrayToFile(file, IOUtils.toByteArray(multipartFile.getInputStream()))

        Importer importer = new AlteracaoOPImporter(file, organizacao, oracleService, mensagemService, locale)

        ImportResponse resultado = importer.get()

        resultado.validos.each { op ->
            OrdemDeProducao ordemDeProducao = OrdemDeProducao.getByCodigo(op.ordemDeProducao as String)

            editarOrdemDeProducao(
                    ordemDeProducao,
                    op.quantidade ? op.quantidade as Long : ordemDeProducao.quantidade,
                    op.statusWIP ? op.statusWIP as StatusOrdemDeProducaoWIP : ordemDeProducao.wipStatusType,
                    op.dataFinalizacao ? SDF.parse(op.dataFinalizacao as String) as Date : ordemDeProducao.dataPrevisaoFinalizacao,
                    organizacao
            )
        }

        return new ImportResponse(
                fileCorrigida: file,
                validos: resultado.validos,
                invalidos: resultado.invalidos
        )
    }
}
