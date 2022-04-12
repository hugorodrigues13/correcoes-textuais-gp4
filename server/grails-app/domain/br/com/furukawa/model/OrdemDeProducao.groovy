package br.com.furukawa.model

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.utils.Audit

import java.text.SimpleDateFormat

class OrdemDeProducao extends Audit {

    private static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy HH:mm")
    public static SimpleDateFormat SDF_DIA = new SimpleDateFormat("dd/MM/yyyy")

    String numero
    StatusOrdemProducao status
    String codigoProduto
    String roteiro
    String lista
    Long quantidade
    Long quantidadeEntregue = 0
    String pedido
    String planejador
    Long quantidadeDisponivelFabricacao
    Long release
    Date dataPrevisaoFinalizacao
    String linha
    String descricaoProduto
    String erroExportacao
    Long wipEntityID
    Integer quantidadePorCaixa
    StatusOrdemDeProducaoWIP wipStatusType
    String codigoServico
    String justificativa
    Long idSite

    static belongsTo = [fornecedor: Fornecedor]

    static constraints = {
        status nullable: true
        roteiro nullable: true
        lista nullable: true
        pedido nullable: true
        planejador nullable: true
        quantidadeDisponivelFabricacao nullable: true
        linha nullable: true
        descricaoProduto nullable: true
        release nullable: true
        erroExportacao nullable: true
        wipEntityID nullable: true
        wipStatusType nullable: true
        codigoServico nullable: true
        justificativa nullable: true
        dataPrevisaoFinalizacao validator: {date, object -> return object.id || date >= new Date()}
        idSite nullable: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'ordem_de_producao_seq']
        quantidadeDisponivelFabricacao column: 'qtd_disp_fabricacao'
        wipEntityID column: 'wip_entity_id'
        wipStatusType column: 'status_wip'
    }

    Long getQuantidadeRestante() {
        return quantidade - quantidadeEntregue
    }

    String getCodigoOrdem() {
        return "${fornecedor?.prefixoProducao}-${numero}"
    }

    String getDataCriacaoFormatada(){
        return SDF.format(dataCriacao)
    }

    String getDataPrevisaoFinalizacaoFormatada(){
        return SDF_DIA.format(dataPrevisaoFinalizacao)
    }

    String getDataPrevisaoFinalizacaoFormatadaHHmm(){
        return SDF.format(dataPrevisaoFinalizacao)
    }

    Integer getTotalPecasSequenciadas(){
        return SerialFabricacao.createCriteria().get {
            'in' 'statusSerial', [StatusSerialFabricacao.PENDENTE_APONTAMENTO, StatusSerialFabricacao.APONTAMENTO_INICIADO, StatusSerialFabricacao.PENDENTE_APOIO, StatusSerialFabricacao.APONTAMENTO_FINALIZADO]
            ordemDeFabricacao {
                ordemDeProducao {
                    eq 'id', this.id
                }
            }
            projections {
                count('id')
            }
        } as Integer
    }

    static OrdemDeProducao getByCodigo(String codigoOrdem) {
        String prefixoFornecedor = codigoOrdem.split("-")[0]
        String numeroOrdem = codigoOrdem.split("-")[1]

        Fornecedor fornecedor = Fornecedor.findByPrefixoProducao(prefixoFornecedor?.toUpperCase())

        return findByNumeroAndFornecedor(numeroOrdem?.toUpperCase(), fornecedor)
    }

    Organizacao getOrganizacaoOP() {
        return Organizacao.findByOrganizationID(fornecedor?.organizationId?.toString())
    }

    Map<String, BigDecimal> getLotesDaNF(String notaFiscal) {
        Romaneio romaneio = Romaneio.createCriteria().get {
            notaFiscalEncomenda {
                eq 'codigo', notaFiscal
            }
        } as Romaneio

        if(romaneio) {
            return romaneio.getQuantidadesPorLotesDaOrdemDeProducao(getCodigoOrdem())
        }

        return new HashMap<String, BigDecimal>()
    }

    String getDescricaoProduto() {
        return Produto.findByCodigoAndOrganizationId(codigoProduto, fornecedor?.organizationId)?.descricao ?: descricaoProduto
    }

    boolean isInvalidaNoWip() {
        return wipStatusType != StatusOrdemDeProducaoWIP.LIBERADO
    }

    String getModelo(){
        return ItemCatalogo.findByNomeAndCodigoProdutoAndOrganizationId(ItensCatalogoFixos.MODELO, this.codigoProduto, this.fornecedor.organizationId)?.valor
    }

    String getComprimento(){
        return ItemCatalogo.findByNomeAndCodigoProdutoAndOrganizationId(ItensCatalogoFixos.COMPRIMENTO, this.codigoProduto, this.fornecedor.organizationId)?.valor
    }
}
