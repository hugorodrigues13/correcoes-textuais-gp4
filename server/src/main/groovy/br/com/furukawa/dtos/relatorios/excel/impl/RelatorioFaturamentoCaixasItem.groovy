package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.model.ImpressaoApontamentoCaixa

class RelatorioFaturamentoCaixasItem implements RelatorioDTO {

    String numeroCaixa
    String recurso
    String linhaProducao
    String total
    String apontados

    RelatorioFaturamentoCaixasItem(ImpressaoApontamentoCaixa caixa){
        this.numeroCaixa = caixa.numeroCaixa
        this.recurso = caixa.recurso?.nome
        this.linhaProducao = caixa.linhaDeProducao?.nome
        this.total = caixa.impressaoLote.lote.quantidadeMaxima
        this.apontados = caixa.seriais.size()
    }
}
