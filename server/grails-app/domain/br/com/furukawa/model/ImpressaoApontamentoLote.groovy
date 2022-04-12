package br.com.furukawa.model

class ImpressaoApontamentoLote {

    Lote lote
    ProdutoEtiqueta produtoEtiqueta

    static hasMany = [caixas: ImpressaoApontamentoCaixa]

    static constraints = {

    }

    static mapping = {
        table 'impr_apont_lote'
        id generator: 'sequence', params: [sequence: 'impr_apont_lote_seq']
        caixas cascade: 'all-delete-orphan'
    }

    static ImpressaoApontamentoLote criarNovaImpressao(Lote lote, SerialFabricacao serialFabricacao, GrupoRecurso grupoRecurso){
        ProdutoEtiqueta produtoEtiqueta = ProdutoEtiqueta.createCriteria().get {
            eq 'codigoProduto', lote.codigoProduto
            grupos {
                eq 'id', grupoRecurso.id
            }
        }
        ImpressaoApontamentoLote impressao = new ImpressaoApontamentoLote()
        impressao.lote = lote
        impressao.produtoEtiqueta = produtoEtiqueta
        ImpressaoApontamentoCaixa caixa = new ImpressaoApontamentoCaixa()
        caixa.numeroCaixa = 1
        caixa.impressaoLote = impressao
        caixa.seriais = [serialFabricacao]
        impressao.addToCaixas(caixa)

        return impressao
    }

    void adicionarSerial(SerialFabricacao serialFabricacao, Recurso recurso){
        ImpressaoApontamentoCaixa caixa = getUltimaCaixaCriadaNoRecurso(recurso)
        if (!caixa || caixa.isFechado()){
            caixa = criarNovaCaixa()
            this.addToCaixas(caixa)
        }
        caixa.addToSeriais(serialFabricacao)
    }

    ImpressaoApontamentoCaixa criarNovaCaixa(Integer numero){
        ImpressaoApontamentoCaixa caixa = new ImpressaoApontamentoCaixa()
        caixa.impressaoLote = this
        caixa.numeroCaixa = numero
        return caixa
    }

    ImpressaoApontamentoCaixa criarNovaCaixa(){
        return criarNovaCaixa(getUltimaCaixaCriada().numeroCaixa + 1)
    }

    ImpressaoApontamentoCaixa getUltimaCaixaCriada(){
        return this.caixas.max({it.numeroCaixa})
    }

    ImpressaoApontamentoCaixa getCaixaAberta() {
        return caixas.find {!it.isFechado()}
    }

    ImpressaoApontamentoCaixa getUltimaCaixaCriadaNoRecurso(Recurso recurso) {
        return caixas.findAll {it.utilizadaNoRecurso(recurso)}.max({it.numeroCaixa})
    }

    boolean possuiApenasUmaCaixaAberta() {
        return caixas.findAll {!it.isFechado()}.size() == 1
    }

    boolean possuiApenasAUltimaCaixaAberta() {
        return lote.quantidadeMaxima &&
                !lote.isFechado() &&
                (lote.quantidadeMaxima - lote.quantidade <= lote.quantidadePorCaixa) &&
                atingiuQuantidadeMaximaDeCaixas() &&
                possuiApenasUmaCaixaAberta()
    }

    boolean possuiApenasAUltimaCaixaAbertaEmOutroRecurso(Recurso recurso) {
        return possuiApenasAUltimaCaixaAberta() && getCaixaAberta().possuiPeloMenosUmSerialApontadoEmOutroRecurso(recurso)
    }

    boolean possuiAlgumaCaixaAbertaNoRecurso(Recurso recurso) {
        ImpressaoApontamentoCaixa ultimaCaixaRecurso = getUltimaCaixaCriadaNoRecurso(recurso)
        return ultimaCaixaRecurso && !ultimaCaixaRecurso.isFechado()
    }

    boolean atingiuQuantidadeMaximaDeCaixasNoRecurso(Recurso recurso) {
        return atingiuQuantidadeMaximaDeCaixas() && !possuiAlgumaCaixaAbertaNoRecurso(recurso)
    }

    boolean atingiuQuantidadeMaximaDeCaixas() {
       return lote.quantidadeMaxima && lote.quantidadePorCaixa && (Math.ceil(lote.quantidadeMaxima / lote.quantidadePorCaixa) ==  caixas.size())
    }

    boolean aindaPodeCriarCaixaParaRecurso() {
        if((lote.quantidadeMaxima && lote.quantidadePorCaixa))
            return !atingiuQuantidadeMaximaDeCaixas() && (lote.quantidadeMaxima - lote.quantidade) >= lote.quantidadePorCaixa
        else
            return true // se  não tiver quantidade maxima ou por caixa permite a criação de caixas
    }

    boolean possuiApenasAUltimaCaixaAbertaNoRecurso(Recurso recurso) {
        return atingiuQuantidadeMaximaDeCaixas() && possuiAlgumaCaixaAbertaNoRecurso(recurso)
    }

    String getCodigoLote() {
        return lote?.getCodigoLote()
    }

    Integer getQuantidadePorCaixa() {
        return lote.quantidadePorCaixa
    }

    ImpressaoApontamentoCaixa getCaixa(Integer numero){
        return caixas.find({it.numeroCaixa == numero})
    }

    ImpressaoApontamentoLote clone(){
        ImpressaoApontamentoLote clone = new ImpressaoApontamentoLote()
        clone.lote = lote
        clone.produtoEtiqueta = produtoEtiqueta
        return clone
    }

}
