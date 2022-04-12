package br.com.furukawa.service

import br.com.furukawa.dtos.FornecedorListaRoteiroEBSDTO
import br.com.furukawa.dtos.GeracaoOrdemProducaoErrosDTO
import br.com.furukawa.dtos.OrdensSelecionadasComOVDTO
import br.com.furukawa.dtos.importer.ImportResponse
import br.com.furukawa.dtos.importer.Importer
import br.com.furukawa.dtos.importer.OrdemDeProducaoImporter
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.OrdemDeProducaoException
import br.com.furukawa.model.ClassePorPlanejador
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.utils.DateUtils
import grails.gorm.transactions.Transactional
import org.apache.commons.io.FileUtils
import org.apache.commons.io.IOUtils
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.springframework.web.multipart.MultipartFile

import java.text.SimpleDateFormat

@Transactional
class OrdemDeProducaoService {
    SessionFactory sessionFactory
    OracleService oracleService
    ClassePorPlanejadorService classePorPlanejadorService
    MensagemService mensagemService
    CrudService crudService

    List<GeracaoOrdemProducaoErrosDTO> gerarOrdemDeProducaoComOv(List<OrdensSelecionadasComOVDTO> ordensSelecionadas, Organizacao organizacao) {
        List<GeracaoOrdemProducaoErrosDTO> erros = []
        ordensSelecionadas.each { OrdensSelecionadasComOVDTO ordem ->
            String planejador = oracleService.getPlanejadorDoProduto(organizacao, ordem.codigoProduto)
            Long classePorPlanejadorId = classePorPlanejadorService.getClassePorPlanejador(planejador, organizacao)
            Fornecedor fornecedor = Fornecedor.findByVendorId(ordem.fornecedor as Long)
            List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros = oracleService.getFornecedoresListasRoteiros(organizacao, ordem.codigoProduto)
            String lista = ordem.lista == '00'? null : ordem.lista
            String roteiro = ordem.roteiro == '00'? null : ordem.roteiro
            FornecedorListaRoteiroEBSDTO fornecedorListaRoteiro = fornecedoresListasRoteiros.find {
                it.idFornecedor == fornecedor?.vendorId && it.lista == lista && it.roteiro == roteiro
            }

            OrdemDeProducao ordemDeProducao = new OrdemDeProducao(
                    codigoProduto: ordem.codigoProduto as String,
                    roteiro: roteiro,
                    fornecedor: fornecedor as Fornecedor,
                    lista: lista,
                    quantidade: ordem.quantidade as Long,
                    status: StatusOrdemProducao.EXPORTACAO_INICIADA,
                    quantidadeDisponivelFabricacao: ordem.quantidade as Long,
                    descricaoProduto: oracleService.getDescricaoDoProduto(ordem.codigoProduto, organizacao),
                    dataPrevisaoFinalizacao: DateUtils.corrigeAnoData(new SimpleDateFormat("dd/MM/yyyy").parse(ordem.dataFinalizacao)),
                    quantidadePorCaixa: 1,
                    planejador: planejador as String,
                    justificativa: ordem.justificativa,
                    idSite: fornecedorListaRoteiro?.idSite
            )

            ordemDeProducao.numero = gerarCodigoOrdemDeProducao(fornecedor)

            List<GeracaoOrdemProducaoErrosDTO> retorno = montaMensagensDeErro(ordem.key as Long, fornecedor, classePorPlanejadorId, planejador)

            erros.addAll(retorno)

            if (retorno[0].message == "sucesso") {
                ordemDeProducao.save(flush: true)

                ClassePorPlanejador classePorPlanejador = ClassePorPlanejador.findByIdAndOrganizacao(classePorPlanejadorId, organizacao)

                oracleService.exportarOrdemDeProducao(ordemDeProducao, organizacao, classePorPlanejador.classeContabil)
            }
        }

        return erros
    }

    void gerarOrdemDeProducaoSemOv(String codigoProduto,
                                   String roteiro,
                                   String lista,
                                   Fornecedor fornecedor,
                                   Long quantidade,
                                   Organizacao organizacao,
                                   String dataPrevisaoFinalizacao,
                                   String planejador,
                                   Long classePorPlanejadorId,
                                   String justificativa,
                                   Long idSite) {
        if (!classePorPlanejadorId) {
            throw new OrdemDeProducaoException('geracaoOrdemProducao.errorClasseContabil.message', [planejador] as Object[])
        }

        OrdemDeProducao ordemDeProducao = new OrdemDeProducao(codigoProduto: codigoProduto,
                roteiro: roteiro,
                fornecedor: fornecedor,
                lista: lista,
                quantidade: quantidade,
                status: StatusOrdemProducao.EXPORTACAO_INICIADA,
                quantidadeDisponivelFabricacao: quantidade,
                descricaoProduto: oracleService.getDescricaoDoProduto(codigoProduto, organizacao),
                dataPrevisaoFinalizacao: DateUtils.corrigeAnoData(new SimpleDateFormat("dd/MM/yyyy").parse(dataPrevisaoFinalizacao)),
                quantidadePorCaixa: 1,
                planejador: planejador,
                idSite: idSite,
                justificativa: justificativa
        )

        ordemDeProducao.numero = gerarCodigoOrdemDeProducao(fornecedor)

        ordemDeProducao.save(flush: true, failOnError: true)

        ClassePorPlanejador classePorPlanejador = ClassePorPlanejador.findByIdAndOrganizacao(classePorPlanejadorId, organizacao)

        String classeContabil = classePorPlanejador.classeContabil

        oracleService.exportarOrdemDeProducao(ordemDeProducao, organizacao, classeContabil)
    }

    List<GeracaoOrdemProducaoErrosDTO> montaMensagensDeErro(Long tabIndex, Fornecedor fornecedor, Long classePorPlanejadorId, String planejador) {
        List<GeracaoOrdemProducaoErrosDTO> erros = []
        if (!classePorPlanejadorId) {
            erros.add(new GeracaoOrdemProducaoErrosDTO([
                    index  : tabIndex,
                    message: mensagemService.getMensagem("geracaoOrdemProducao.errorClasseContabil.message", null, [planejador] as Object[]),
                    value  : planejador
            ]))
        }
        if (fornecedor) {
            if (!fornecedor?.prefixoProducao) {
                erros.add(new GeracaoOrdemProducaoErrosDTO([
                        index  : tabIndex,
                        message: mensagemService.getMensagem("geracaoOrdemProducao.errorPrefixFornVazio.message",null, [fornecedor.nome] as Object[])
                ]))
            }
            if (fornecedor?.prefixoProducao?.size() != 3) {
                erros.add(new GeracaoOrdemProducaoErrosDTO([
                        index  : tabIndex,
                        message: mensagemService.getMensagem("geracaoOrdemProducao.errorPrefixFornTamanho.message",null, [fornecedor.nome] as Object[])
                ]))
            }
        } else {
            erros.add(new GeracaoOrdemProducaoErrosDTO([
                    index  : tabIndex,
                    message: mensagemService.getMensagem("geracaoOrdemProducao.errorFornecedorNull.message")
            ]))
        }

        if (!erros.size()) {
            erros.add(new GeracaoOrdemProducaoErrosDTO([
                    index  : tabIndex,
                    message: "sucesso"
            ]))
        }

        return erros
    }

    String gerarCodigoOrdemDeProducao(Fornecedor fornecedor) {
        Integer maxNumber = OrdemDeProducao.countByFornecedor(fornecedor)
        Integer proximaOrdem = maxNumber + 1

        return String.format('%6s', Integer.toHexString(proximaOrdem)).replace(' ', '0').toUpperCase()
    }

    void atualizaQuantidadeOrdemDeFabricacao(OrdemDeProducao ordemDeProducao, Long quantidade) {
        ordemDeProducao.quantidadeDisponivelFabricacao -= quantidade

        ordemDeProducao.save(flush: true, failOnError: true)
    }

    void validaOrdemDeProducaoParaSequenciamento(String codigoOrdemDeProducao, Fornecedor fornecedor, Long quantidade) {
        if (!codigoOrdemDeProducao.contains("-")) {
            throw new OrdemDeProducaoException("sequenciamento.codigoOrdemDeProducaoInvalido.message", codigoOrdemDeProducao)
        }

        String prefixoProd = codigoOrdemDeProducao.split("-")[0]
        String numeroOrdem = codigoOrdemDeProducao.split("-")[1]

        if (!Fornecedor.findByPrefixoProducao(prefixoProd)) {
            throw new OrdemDeProducaoException("sequenciamento.fornecedorNaoEncontrado.message", prefixoProd)
        }

        if (fornecedor.prefixoProducao != prefixoProd) {
            throw new OrdemDeProducaoException("sequenciamento.ordemNaoPertenceAoFornecedor.message", codigoOrdemDeProducao, fornecedor.nome)
        }

        OrdemDeProducao ordemDeProducao = OrdemDeProducao.findByFornecedorAndNumero(fornecedor, numeroOrdem)

        if (!ordemDeProducao) {
            throw new OrdemDeProducaoException("sequenciamento.ordemNaoPertenceAoFornecedor.message", codigoOrdemDeProducao, fornecedor.nome)
        }

        if (ordemDeProducao.quantidadeDisponivelFabricacao < quantidade) {
            throw new OrdemDeProducaoException("sequenciamento.quantidadeOrdemDeProducaoParaSequenciamentoAlcancada.message", quantidade, ordemDeProducao.quantidadeDisponivelFabricacao)
        }
    }

    ImportResponse importar(MultipartFile multipartFile, Organizacao organizacao, Fornecedor fornecedor, Locale locale) {
        File file = File.createTempFile("temp", ".xls")
        FileUtils.writeByteArrayToFile(file, IOUtils.toByteArray(multipartFile.getInputStream()))

        Importer importer = new OrdemDeProducaoImporter(file, organizacao, fornecedor, oracleService, classePorPlanejadorService, mensagemService, locale)
        ImportResponse resultado = importer.get()
        resultado.validos.each { op ->
            gerarOrdemDeProducaoSemOv(op.codigoProduto, op.roteiro, op.lista, op.fornecedor, op.quantidade, organizacao, op.dataFinalizacao, op.planejador, op.classePorPlanejador, op.justificativa, op.idSite)
        }
        return new ImportResponse(
                validos: resultado.validos,
                invalidos: resultado.invalidos,
                fileCorrigida: file
        )

    }

    List<Long> getOrdensDeProducaoIdsParaAtualizacaoMP() {
        String sql = """SELECT op.id
                        FROM   gp40.ordem_de_producao op
                               INNER JOIN gp40.fornecedor f
                                       ON f.id = op.fornecedor_id
                        WHERE  op.status_wip = 'LIBERADO'
                               AND (SELECT Count(ser.id)
                                    FROM   gp40.serial_fabricacao ser
                                           INNER JOIN gp40.ordem_de_fabricacao odf
                                                   ON odf.id = ser.ordem_de_fabricacao_id
                                    WHERE  odf.ordem_de_producao_id = op.id
                                           AND ser.status_serial IN ( '${StatusSerialFabricacao.PENDENTE_APONTAMENTO.name()}',
                                                                      '${StatusSerialFabricacao.APONTAMENTO_INICIADO.name()}',
                                                                      '${StatusSerialFabricacao.PENDENTE_APOIO.name()}' )) > 0"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.getResultList() as List<Long>
    }

    boolean opPodeSerAtualizada(OrdemDeProducao ordemDeProducao) {
        String sql = """SELECT count(op.id)
                        FROM   gp40.ordem_de_producao op
                               INNER JOIN gp40.fornecedor f
                                       ON f.id = op.fornecedor_id
                        WHERE op.id=${ordemDeProducao?.id} and  (op.status_wip = 'LIBERADO'
                              OR (SELECT Count(ser.id)
                                    FROM   gp40.serial_fabricacao ser
                                           INNER JOIN gp40.ordem_de_fabricacao odf
                                                   ON odf.id = ser.ordem_de_fabricacao_id
                                    WHERE  odf.ordem_de_producao_id = op.id
                                           AND ser.status_serial IN ( '${StatusSerialFabricacao.PENDENTE_APONTAMENTO.name()}',
                                                                      '${StatusSerialFabricacao.APONTAMENTO_INICIADO.name()}',
                                                                      '${StatusSerialFabricacao.PENDENTE_APOIO.name()}' )) > 0)"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() > 0
    }
}
