package br.com.furukawa.model

import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.service.LoteService
import br.com.furukawa.utils.Audit

import java.text.SimpleDateFormat

class Lote extends Audit {

    static final SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy HH:mm")

    String codigoProduto
    String descricaoProduto
    String numeroLote
    String semana
    Integer ano
    GrupoLinhaDeProducao grupoLinhaDeProducao
    Integer quantidade
    Integer quantidadeMaxima
    Integer quantidadePorCaixa
    OrdemDeFabricacao ordemDeFabricacao //lote segregado
    OrdemDeFabricacao apontamentoOF //para o caso de apontamento por OF

    LoteService loteService

    static transients = ['loteService']

    StatusLote statusLote = StatusLote.ABERTO

    static hasMany = [seriais: SerialFabricacao]

    static constraints = {
        numeroLote unique: ['semana', 'ano']
        grupoLinhaDeProducao nullable: true
        quantidadeMaxima nullable: true
        quantidadePorCaixa nullable: true
        ordemDeFabricacao nullable: true
        apontamentoOF nullable: true
    }

    String isGrupoLinhaDeProducao(){
        def nomeLinhaDeProducao = grupoLinhaDeProducao ? grupoLinhaDeProducao.nome : ""
        return nomeLinhaDeProducao
    }

    Boolean isSegregracao(){
        return this.ordemDeFabricacao != null
    }

    Boolean isAgrupamento() {
        return this.quantidadeMaxima
    }

    boolean isFechado() {
        return statusLote.isFechado()
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'lote_seq']
        seriais joinTable: [name: 'lote_serial', key: 'lote_id', column: 'serial_id']
        autowire true
    }

    String getCodigoLote() {
        return "${numeroLote}${semana}${ano}"
    }

    Long getQuantidadePorOP(String ordemProducao){
        return seriais.count {it.ordemDeFabricacao.ordemDeProducao.getCodigoOrdem() == ordemProducao}
    }

    String getCodigoLoteAndQuantidade() {
        return "${getCodigoLote()} (${quantidade})"
    }

    Integer getQuantidade() {
        return seriais?.size()
    }

    boolean isIncompleto() {
        return quantidadeMaxima && getQuantidade() < quantidadeMaxima
    }

    ImpressaoApontamentoLote getImpressao() {
        ImpressaoApontamentoLote.findByLote(this)
    }

    List<ImpressaoApontamentoCaixa> getCaixas(){
        return getImpressao().caixas as List
    }

    boolean hasImpressoesPendentes(){
        return ImpressaoApontamentoLote.findAllByLote(this).any({imp -> imp.caixas.any({!it.seriais.isEmpty()})})
    }

    boolean possuiAlgumaCaixaAbertaNoRecurso(Recurso recurso) {
        return getImpressao()?.possuiAlgumaCaixaAbertaNoRecurso(recurso)
    }

    boolean aindaPodeCriarCaixasParaRecurso() {
        getImpressao()?.aindaPodeCriarCaixaParaRecurso()
    }

    boolean possuiApenasAUltimaCaixaAbertaNoRecurso(Recurso recurso) {
        return getImpressao()?.possuiApenasAUltimaCaixaAbertaNoRecurso(recurso)
    }

    Integer getQuantidadeMaximaDeCaixas(){
        return Math.ceil(quantidadeMaxima / quantidadePorCaixa)
    }

    boolean isRomaneio() {
        return statusLote.isRomaneio()
    }

    Romaneio getRomaneio(){
        return Romaneio.createCriteria().get {
            lotes {
                eq 'id', this.id
            }
        }
    }

    List<OrdemDeProducao> getOrdensDeProducao(){
        return seriais*.ordemDeFabricacao*.ordemDeProducao.unique()
    }

    String getDataFechamentoFormatada(){
        Date date = loteService.getDataFechamentoLote(this)
        return date ? SDF.format(date) : null
    }

    static Lote buscaPorCodigoLote(String codigoLote) {
        return Lote.createCriteria().get {
            sqlRestriction "UPPER(numero_lote||semana||ano) = UPPER('${codigoLote}')"
        } as Lote
    }

    boolean foiAgrupado() {
        List<LogOperacao> logs = LogOperacao.createCriteria().list({
            eq "tipoLogOperacao", TipoLogOperacao.AGRUPAR_LOTE
            parametros {
                eq "tipo", TipoParametroLogOperacao.CODIGO_LOTE
                eq "valor", this.getCodigoLote()
            }
        })
        return logs?.size()
    }

    Fornecedor getFornecedorDoLote() {
        return grupoLinhaDeProducao?.fornecedor
    }

    String getDescricaoProduto() {
        return Produto.findByCodigoAndOrganizationId(codigoProduto, getFornecedorDoLote()?.organizationId)?.descricao ?: descricaoProduto
    }
}
