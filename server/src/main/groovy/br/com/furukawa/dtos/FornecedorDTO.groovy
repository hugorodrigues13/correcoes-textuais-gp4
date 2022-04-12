package br.com.furukawa.dtos

import org.json.JSONObject

public class FornecedorDTO {
    Long organizationID
    Long vendorID
    String segment1
    String vendorName

    FornecedorDTO() {

    }

    FornecedorDTO(JSONObject object) {
        this.organizationID = object.organizationID
        this.vendorID = object.vendorID
        this.segment1 = object.segment1
        this.vendorName = object.vendorName
    }
}
