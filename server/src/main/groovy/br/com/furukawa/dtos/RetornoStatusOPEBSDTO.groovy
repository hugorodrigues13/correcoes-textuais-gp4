package br.com.furukawa.dtos

import org.json.JSONObject

class RetornoStatusOPEBSDTO {
    static final String STATUS_ANDAMENTO = "EM_ANDAMENTO"
    static final String STATUS_FALHA = "FALHA"
    static final String STATUS_FINALIZADA = "FINALIZADA"

    String status
    String erro

    RetornoStatusOPEBSDTO(JSONObject object) {
        this.status = object.status
        this.erro = object.erro
    }

    boolean isExportacaoFinalizada() {
        return status == STATUS_FINALIZADA
    }

    boolean hasFalha() {
        return status == STATUS_FALHA
    }

    boolean isExportacaoEmAndamento() {
        return status == STATUS_ANDAMENTO
    }
}
