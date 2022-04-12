package br.com.furukawa.dtos

import org.json.JSONArray
import org.json.JSONObject

import java.text.SimpleDateFormat

class ProdutoEBSDTO {
    Long inventoryItemId
    String codigo
    String descricao
    String plannerCode
    String status
    Long organizationId
    String language
    List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros

    ProdutoEBSDTO(JSONObject object) {
        this.inventoryItemId = object.inventoryItemId
        this.codigo = object.codigo
        this.descricao = object.descricao
        this.status = object.status
        this.organizationId = object.organizationId
        this.language = object.language
        if(object.has("plannerCode")) {
            this.plannerCode = object.plannerCode
        }
    }
}
