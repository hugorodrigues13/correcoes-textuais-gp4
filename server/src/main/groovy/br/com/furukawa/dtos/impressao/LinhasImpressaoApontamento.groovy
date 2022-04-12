package br.com.furukawa.dtos.impressao

import br.com.furukawa.model.SerialFabricacao
import org.json.JSONObject

class LinhasImpressaoApontamento {
    String numeroSerie
    String lote

    LinhasImpressaoApontamento(SerialFabricacao serial) {
        this.numeroSerie = serial.getCodigoCompleto()
        this.lote = serial.getLote()?.getCodigoLote()
    }

    JSONObject toJSONObject() {
        return new JSONObject(
            "numero_serie": numeroSerie,
            "lote": lote,
        )
    }
}
