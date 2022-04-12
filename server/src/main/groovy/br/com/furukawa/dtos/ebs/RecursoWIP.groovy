package br.com.furukawa.dtos.ebs

import org.json.JSONObject

class RecursoWIP {
    Long operationSequence
    String resourceCode
    String resourceDescription

    RecursoWIP() {

    }

    RecursoWIP(JSONObject object) {
        this.operationSequence = object.operationSequence
        this.resourceCode = object.has("resourceCode") ? object.resourceCode : null
        this.resourceDescription = object.has("resourceDescription") ? object.resourceDescription : null
    }
}
