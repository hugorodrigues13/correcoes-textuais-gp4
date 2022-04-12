package br.com.furukawa.dtos.impressao

import br.com.furukawa.model.SerialFabricacao
import org.json.JSONObject

class LinhasImpressaoSeriais {

    String codigoLote
    List<String> seriais
    Integer agrupamento

    LinhasImpressaoSeriais(List<String> seriais, String codigoLote, Integer agrupamento) {
        this.codigoLote = codigoLote
        this.seriais = seriais
        this.agrupamento = agrupamento
    }


    JSONObject toJSONObject() {
        JSONObject jsonObject =  new JSONObject(
            "codigo_lote": codigoLote,
        )
        seriais.eachWithIndex { serial, index ->
            jsonObject.put("numero_serie" + (index == 0 ? "" : "_"+(index + 1)), serial)
        }
        for (int i = seriais.size(); i < agrupamento; i++){
            jsonObject.put("numero_serie" + (i == 0 ? "" : "_"+(i + 1)), "")
        }
        return jsonObject
    }

}
