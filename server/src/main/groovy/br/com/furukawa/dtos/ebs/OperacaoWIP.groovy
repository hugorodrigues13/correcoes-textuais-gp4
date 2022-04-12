package br.com.furukawa.dtos.ebs

import org.json.JSONObject

class OperacaoWIP {
    Long operationSequence
    String operationCode
    String operationDescription
    List<ComponenteWIP> componentes = new ArrayList<>()
    List<RecursoWIP> recursos = new ArrayList<>()

    OperacaoWIP() {

    }

    OperacaoWIP(JSONObject object) {
        this.operationSequence = object.operationSequence
        this.operationCode = object.operationCode
        this.operationDescription = object.operationDescription
        this.recursos = new ArrayList<RecursoWIP>()
        this.componentes = new ArrayList<ComponenteWIP>()

        if(object.has("recursos")) {
            if(object.recursos instanceof JSONObject) {
                this.recursos.add(new RecursoWIP(object.recursos as JSONObject))
            } else {
                object.recursos.myArrayList.each { jsonItem ->
                    this.recursos.add(new RecursoWIP(jsonItem as JSONObject))
                }
            }
        }

        if(object.has("componentes")) {
            if(object.componentes instanceof JSONObject) {
                this.componentes.add(new ComponenteWIP(object.componentes as JSONObject))
            } else {
                object.componentes.myArrayList.each { jsonItem ->
                    this.componentes.add(new ComponenteWIP(jsonItem as JSONObject))
                }
            }
        }
    }
}
