package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class PedidoReposicaoMaterial extends Audit {
    Recurso recurso
    String chavePrimaria
    Date previsaoEntrega
    boolean isLiberado = false

    static hasMany = [itens: ItemPedidoReposicaoMaterial]

    static constraints = {
    }

    static mapping = {
        table name: 'pedido_rep_material'
        id generator: 'sequence', params: [sequence: 'pedido_rep_material_seq']
    }
}
