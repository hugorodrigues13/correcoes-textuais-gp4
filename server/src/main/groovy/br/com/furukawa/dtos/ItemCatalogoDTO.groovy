package br.com.furukawa.dtos

import org.json.JSONObject
import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.model.ItemCatalogo

class ItemCatalogoDTO {
    String codigoProduto
    Long organizationId
    String nome
    String valor

    ItemCatalogoDTO() {

    }

    ItemCatalogoDTO(JSONObject object) {
        this.codigoProduto = object.codigoProduto
        this.organizationId = object.organizationId
        this.nome = object.nome
        if(object.has("valor")) {
            this.valor = object.valor
        }
    }

    ItemCatalogoDTO(ItemCatalogo itemCatalogo) {
        this.codigoProduto = itemCatalogo.codigoProduto
        this.organizationId = itemCatalogo.organizationId
        this.nome = itemCatalogo.nome
        this.valor = itemCatalogo.valor
    }

    boolean isModelo() {
        return nome == ItensCatalogoFixos.MODELO
    }

    boolean isComprimento() {
        return nome == ItensCatalogoFixos.COMPRIMENTO
    }
}
