package br.com.furukawa.model

import br.com.furukawa.constantes.ItensCatalogoFixos

class ItemCatalogo {

    String codigoProduto
    Long organizationId
    String nome
    String valor

    static constraints = {
        codigoProduto unique: ['organizationId', 'nome']
        valor nullable: true
    }

    static mapping = {
        table 'item_catalogo'
        id generator: 'sequence', params: [sequence: 'item_catalogo_seq']
    }

    boolean isModelo() {
        return nome == ItensCatalogoFixos.MODELO
    }

    boolean isComprimento() {
        return nome == ItensCatalogoFixos.COMPRIMENTO
    }
}
