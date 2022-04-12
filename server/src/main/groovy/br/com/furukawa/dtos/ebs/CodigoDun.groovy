package br.com.furukawa.dtos.ebs

import org.json.JSONObject

class CodigoDun {
    BigDecimal conversionRate
    String codigoDun
    String unidade

    CodigoDun() {

    }

    CodigoDun(JSONObject object) {
        if(object.has("conversionRate")) {
            this.conversionRate = object.conversionRate
        }

        if(object.has("codigoDun")) {
            this.codigoDun = object.codigoDun
        }

        if(object.has("unidade")) {
            this.unidade = object.unidade
        }
    }
}
