package br.com.furukawa.model

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.service.OracleService
import br.com.furukawa.utils.Audit

import java.text.SimpleDateFormat

class OrdemDeFabricacao extends Audit {

    private static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyy HH:mm")

    String numero
    String codigoProduto
    Long quantidadeTotal
    StatusOrdemFabricacao status
    String ano
    Fornecedor fornecedor
    LinhaDeProducao linhaDeProducao
    Integer ordem
    OrdemDeProducao ordemDeProducao
    Date dataPrevisaoSeparacao
    Date dataSeparacao
    String usuarioSeparacao
    String comentarios
    Boolean segregarLotes

    OracleService oracleService

    static belongsTo = [grupoLinhaProducao: GrupoLinhaDeProducao]

    static hasMany = [seriais: SerialFabricacao, materiasPrimasSeparacao: MateriaPrimaSeparacao]

    static constraints = {
        numero unique: ['fornecedor', 'ano']
        linhaDeProducao nullable: true
        materiasPrimasSeparacao nullable: true
        dataPrevisaoSeparacao nullable: true
        dataSeparacao nullable: true
        usuarioSeparacao nullable: true
        comentarios nullable: true
    }

    static transients = ['oracleService']

    static mapping = {
        id generator: 'sequence', params: [sequence: 'ordem_de_fabricacao_seq']
        materiasPrimasSeparacao cascade: 'all-delete-orphan'
        autowire true
    }

    static String getProximoNumeroOrdem(Fornecedor fornecedor, String numeroAno) {
        int totalOrdens = countByFornecedorAndAno(fornecedor, numeroAno)

        return String.format("%06d", totalOrdens+1)
    }

    static int getPosicaoOrdemDeFabricacao(GrupoLinhaDeProducao grupoLinhaDeProducao, String ano) {
        return countByGrupoLinhaProducaoAndAnoAndStatusInList(grupoLinhaDeProducao, ano, StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento())
    }

    String getCodigoOrdemDeFabricacao() {
        return "${numero}-${ano}"
    }

    String getCodigoOrdemDeProducao() {
        return ordemDeProducao?.getCodigoOrdem()
    }

    String getDescricaoDoProduto() {
        return ordemDeProducao?.descricaoProduto
    }

    String getDataPrevisaoFormatada() {
        return dataPrevisaoSeparacao ? SDF.format(dataPrevisaoSeparacao) : null
    }

    String getDataCriacaoFormatada(){
        return SDF.format(dataCriacao)
    }

    Organizacao getOrganizacaoDoFornecedor() {
        return fornecedor.getOrganizacaoDoFornecedor()
    }

    List<LogOperacao> getLogsImpressoes(){
        return LogOperacao.createCriteria().list {
            eq 'tipoLogOperacao', TipoLogOperacao.IMPRIMIR_ETIQUETA_OF
            parametros {
                eq 'tipo', TipoParametroLogOperacao.ORDEM_FABRICACAO
                eq 'valor', getCodigoOrdemDeFabricacao()
            }
        }
    }

    boolean visivelNoSequenciamento() {
        return StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento().contains(status)
    }
    boolean isFinalizada() {
        return status.isFinalizada()
    }

    boolean isCancelada() {
        return status.isCancelada()
    }

    Date getDataPrevisaoFinalizacao() {
        return getOrdemDeProducao().getDataPrevisaoFinalizacao()
    }

    Boolean podeTrocarLinhaProducao(){
        return (this.status == StatusOrdemFabricacao.ABERTA || this.status == StatusOrdemFabricacao.EM_SEPARACAO) && !getLogsImpressoes()
    }


    String getModelo(){
        return ItemCatalogo.findByNomeAndCodigoProdutoAndOrganizationId(ItensCatalogoFixos.MODELO, this.codigoProduto, this.fornecedor.organizationId)?.valor
    }

    String getComprimento(){
        return ItemCatalogo.findByNomeAndCodigoProdutoAndOrganizationId(ItensCatalogoFixos.COMPRIMENTO, this.codigoProduto, this.fornecedor.organizationId)?.valor
    }

    Long getQuantidadeFinalizada(){
        return SerialFabricacao.countByOrdemDeFabricacaoAndStatusSerialInList(this, [StatusSerialFabricacao.APONTAMENTO_FINALIZADO])
    }

    boolean isPrimeiroDoSequenciamento(){
        Integer minOrdem = OrdemDeFabricacao.createCriteria().get {
            eq 'grupoLinhaProducao', this.grupoLinhaProducao
            eq 'status', StatusOrdemFabricacao.EM_SEPARACAO
            projections {
                min('ordem')
            }
        }

        return minOrdem == this.ordem
    }

    Long getQuantidadeIniciada(){
        return SerialFabricacao.createCriteria().get {
            eq 'ordemDeFabricacao', this
            'in' 'statusSerial', StatusSerialFabricacao.getStatusIniciados()
            projections {
                count 'id'
            }
        }
    }

    boolean podeSerCancelada() {
        return isAberta() || isEmSeparacao() && getQuantidadeIniciada() == 0
    }

    boolean isAberta() {
        status.isAberta()
    }

    boolean isEmSeparacao() {
        status.isEmSeparacao()
    }

    static OrdemDeFabricacao getByCodigo(String codigoOrdem, Fornecedor fornecedor) {
        String numero = codigoOrdem.split("-")[0]
        String ano = codigoOrdem.split("-")[1]


        return findByNumeroAndAnoAndFornecedor(numero, ano, fornecedor)
    }

    String getRoteiro() {
        return ordemDeProducao.getRoteiro()
    }
}
