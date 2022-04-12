package br.com.furukawa.enums

enum TipoPaginaColunas {

    SERIAIS(["serial", "codigoProduto", "descricaoProduto", "ordemFabricacao", "ordemProducao", "lote", "status"]),
    ACOMPANHAMENTO_DE_OP(["ordemDeProducao", "codigoProduto", "descricaoProduto", "quantidade", "planejador"]),
    DASHBOARD_PRODUCAO(["periodo", "grupoLinhas", "turno", "linhaProducao", "grupoRecursos", "recurso"]),
    ORDEM_FABRICACAO(["ordemFabricacao", "codigoProduto", "descricaoProduto", "ordemProducao", "dataCriacao"]);

    List<String> padrao

    TipoPaginaColunas(List<String> padrao) {
        this.padrao = padrao
    }
}
