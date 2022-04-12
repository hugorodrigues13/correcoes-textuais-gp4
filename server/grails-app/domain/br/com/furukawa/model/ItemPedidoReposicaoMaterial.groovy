package br.com.furukawa.model

class ItemPedidoReposicaoMaterial {
    String codigoProduto
    String descricaoProduto
    BigDecimal quantidade

    static belongsTo = [pedidoReposicao: PedidoReposicaoMaterial]

    static mapping = {
        table name: 'item_pedido_reposicao'
        id generator: 'sequence', params: [sequence: 'item_pedido_rep_seq']
    }
}
