package br.com.furukawa.dtos.impressao

import org.json.JSONObject

class ImpressaoEtiquetaSeriaisOrdemDeFabricacao {
    String identificador
    String codigoLote
    List<LinhasImpressaoSeriais> linhas

    JSONObject toJsonObject() {
        return new JSONObject(
            "identificador": identificador,
            "etiquetas": linhas.collect {it.toJSONObject()}
        )
    }

    String getJsonStringEtiqueta() {
        return this.toJsonObject().toString()
    }
}
