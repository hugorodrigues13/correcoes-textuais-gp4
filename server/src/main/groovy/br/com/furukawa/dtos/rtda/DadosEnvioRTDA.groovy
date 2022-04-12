package br.com.furukawa.dtos.rtda

import org.hibernate.query.NativeQuery
import org.json.JSONObject

class DadosEnvioRTDA {
    String id = "dados"
    String n = "STF"
    String org = "FEL"
    String source = "gp40"
    String topic = "gp40"
    List<LinhaDadoRTDA> linhas

    JSONObject toJsonObject() {
        return new JSONObject(
                "id": id,
                "v": linhas.collect {linha -> linha.toJsonObject()}
        )
    }

    String getJsonString() {
        return this.toJsonObject().toString()
    }
}
