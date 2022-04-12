package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioEtiquetaItem implements RelatorioDTO {
    String codigoProduto
    String etiquetas
    Integer quantidadeAgrupamento
    Integer copias
    Boolean serial
    String grupos

    RelatorioEtiquetaItem(Boolean serial, String codigoProduto, String etiquetas, Integer quantidadeAgrupamento, Integer copias, String grupos) {
        this.serial = serial
        this.codigoProduto = codigoProduto
        this.etiquetas = etiquetas
        this.quantidadeAgrupamento = quantidadeAgrupamento
        this.copias = copias
        this.grupos = grupos
    }

}
