package br.com.furukawa.dtos.relatorios.pdf.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioLoteItem implements RelatorioDTO {

    String lote, codigo, descricao
    Integer quantidade

    RelatorioLoteItem(String lote, String codigo, String descricao, Integer quantidade) {
        this.lote = lote
        this.codigo = codigo
        this.descricao = descricao
        this.quantidade = quantidade
    }
}
