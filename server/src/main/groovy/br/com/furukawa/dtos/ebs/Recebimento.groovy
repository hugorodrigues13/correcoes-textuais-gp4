package br.com.furukawa.dtos.ebs

import org.json.JSONObject

class Recebimento {
    Long interfaceTransactionId
    String ordemDeProducao
    String notaFiscal
    BigDecimal quantidade
    Integer sequenciaOperacao

    Recebimento(JSONObject object) {
        this.interfaceTransactionId = object.has("interfaceTransactionId") ? object.interfaceTransactionId : null
        this.ordemDeProducao = object.has("ordemDeProducao") ? object.ordemDeProducao : null
        this.notaFiscal = object.has("notaFiscal") ? object.notaFiscal : null
        this.quantidade = object.has("quantidade") ? object.quantidade : null
        this.sequenciaOperacao = object.has("sequenciaOperacao") ? object.sequenciaOperacao : null
    }
}
