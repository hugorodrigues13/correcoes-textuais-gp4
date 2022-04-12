package br.com.furukawa.dtos

import org.json.JSONObject

class ItemCatalogoEBSDTO {
    Long inventoryItemId
    String codigoProduto
    Long organizationId
    String nome
    String valor

    ItemCatalogoEBSDTO(JSONObject object) {
        this.inventoryItemId = object.inventoryItemId
        this.codigoProduto = object.codigoProduto
        this.organizationId = object.organizationId
        this.nome = object.nome
        if(object.has("valor")) {
            this.valor = object.valor
        }
    }
}
