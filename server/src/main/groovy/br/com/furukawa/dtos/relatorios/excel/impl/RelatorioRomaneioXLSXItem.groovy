package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.model.ProdutoRomaneio
import br.com.furukawa.model.ServicoRomaneio
import br.com.furukawa.utils.Utils


class RelatorioRomaneioXLSXItem implements RelatorioDTO {
    String codigo
    String unidade
    String descricao
    Long quantidade
    BigDecimal valorUnitario
    BigDecimal valorTotal
    String ordemDeProducao
    String pedidoDeCompra
    String contrato
    String release
    String linha

    RelatorioRomaneioXLSXItem(ServicoRomaneio servico) {
        this.codigo = servico.codigo
        this.unidade = servico.unidade
        this.quantidade = servico.quantidade
        this.valorUnitario = servico.valorUnitario
        this.valorTotal = servico.valorTotal
        this.descricao = servico.descricao
    }

    RelatorioRomaneioXLSXItem(ProdutoRomaneio produto) {
        this.codigo = produto.codigo
        this.unidade = produto.unidade
        this.quantidade = produto.quantidade
        this.ordemDeProducao = produto.ordemDeProducao?.codigoOrdem
        this.pedidoDeCompra = produto.release ? "000000" : Utils.preencher(produto.pedidoDeCompra, 6, "0")
        this.contrato = produto.release ? Utils.preencher(produto.pedidoDeCompra, 6, "0") : "000000"
        this.release = produto.release ?: "000"
        this.linha = Utils.preencher(produto.linha, 3 , "0")
        this.descricao = produto.getDescricao()
    }
}
