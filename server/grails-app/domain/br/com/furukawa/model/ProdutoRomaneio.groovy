package br.com.furukawa.model

import br.com.furukawa.utils.Utils

class ProdutoRomaneio {
    String codigo
    String unidade
    Long quantidade
    BigDecimal valorUnitario
    BigDecimal valorTotal
    OrdemDeProducao ordemDeProducao
    String pedidoDeCompra
    String release
    String linha
    Integer volume

    static belongsTo = [servico: ServicoRomaneio]

    static constraints = {
        release nullable: true
    }

    static mapping = {
        table 'produto_romaneio'
        id generator: 'sequence', params: [sequence: 'produto_romaneio_seq']
    }

    String getDescricao() {
        return "OP: ${ordemDeProducao?.getCodigoOrdem()} " +
                "- PC: ${release ? "000000" : Utils.preencher(pedidoDeCompra, 6, "0")} " +
                "- C: ${release ? Utils.preencher(pedidoDeCompra, 6, "0") : "000000"} " +
                "- R: ${release ?: "000"} " +
                "- L: ${Utils.preencher(linha, 3 , "0")}"
    }
    String getCodigoOrdemDeProducao() {
        return ordemDeProducao.getCodigoOrdem()
    }
}
