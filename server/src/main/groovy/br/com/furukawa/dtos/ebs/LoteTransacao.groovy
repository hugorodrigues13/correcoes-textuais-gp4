package br.com.furukawa.dtos.ebs

import org.json.JSONObject

import java.text.DateFormat
import java.text.SimpleDateFormat

class LoteTransacao {
    String numeroLote
    Date data
    BigDecimal quantidadeDisponivel

    LoteTransacao(JSONObject object) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")
        this.numeroLote = object.has('numeroLote') ? object.numeroLote : null
        this.data = object.has('data') ? df.parse(object.data.toString()) : null
        this.quantidadeDisponivel = object.has('quantidadeDisponivel') ? object.quantidadeDisponivel : null
    }
}
