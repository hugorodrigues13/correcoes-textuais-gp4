package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.FaturamentoDTO
import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioFaturamentoListagemItem implements RelatorioDTO{

    String codigoLote
    String codigoProduto
    String descricaoProduto
    String local
    String agrupamento
    String quantidade
    String quantidadeMaxima
    String quantidadePorCaixa
    String statusLote
    String ordemFabricacao

    RelatorioFaturamentoListagemItem(FaturamentoDTO lote) {
        this.codigoLote = lote.codigoLote
        this.codigoProduto = lote.codigoProduto
        this.descricaoProduto = lote.descricaoProduto
        this.local = lote.local
        this.agrupamento = lote.isAgrupamento()
        this.quantidade = lote.quantidade
        this.quantidadeMaxima = lote.quantidadeMaxima
        this.quantidadePorCaixa = lote.quantidadePorCaixa
        this.statusLote = lote.statusLote
        this.ordemFabricacao = lote.ordemDeFabricacao
    }
}
