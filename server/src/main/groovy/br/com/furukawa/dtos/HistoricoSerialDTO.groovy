package br.com.furukawa.dtos

import java.text.SimpleDateFormat

class HistoricoSerialDTO {
    Date data
    String defeito
    String recurso


    HistoricoSerialDTO(String dataFormatoDiaHora, String defeito, String recurso) {
        this.data = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss").parse(dataFormatoDiaHora)
        this.defeito = defeito
        this.recurso = recurso
    }

    String getDataFormatadaDiaMesAno() {
        return new SimpleDateFormat("dd/MM/YYYY hh:mm").format(data)
    }
}
