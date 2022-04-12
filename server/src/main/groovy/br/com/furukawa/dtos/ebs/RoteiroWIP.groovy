package br.com.furukawa.dtos.ebs

import org.json.JSONObject

import java.text.DateFormat
import java.text.SimpleDateFormat

class RoteiroWIP {
    String codigoLote
    String codigoProduto
    String descricaoProduto
    String statusProduto
    BigDecimal startQuantity
    Date scheduledStartDate
    Date scheduledCompletionDate
    Date dataEntregue
    Date dataFechamento
    String unidade
    String codigoSubinventario
    Long completionLocatorId
    Long inventoryItemId

    List<OperacaoWIP> operacoes = new ArrayList<>()

    RoteiroWIP() {

    }

    RoteiroWIP(JSONObject object) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")

        this.codigoLote = object.codigoLote
        this.codigoProduto = object.codigoProduto
        this.descricaoProduto = object.descricaoProduto
        this.statusProduto = object.statusProduto
        this.startQuantity = object.startQuantity
        this.unidade = object.has("unidade") ? object.unidade : null
        this.scheduledStartDate = df.parse( object.scheduledStartDate.toString() )
        this.scheduledCompletionDate = df.parse( object.scheduledCompletionDate.toString() )
        this.dataEntregue = object.has("dataEntregue") ? df.parse( object.dataEntregue.toString() ) : null
        this.dataFechamento = object.has("dataFechamento") ? df.parse( object.dataFechamento.toString() ) : null
        this.codigoSubinventario = object.has("codigoSubinventario") ? object.codigoSubinventario : null
        this.completionLocatorId = object.has("completionLocatorId") ? object.completionLocatorId : null
        this.inventoryItemId = object.has("inventoryItemId") ? object.inventoryItemId : null

        this.operacoes = new ArrayList<OperacaoWIP>()

        if(object.has("operacoes")) {
            if(object.operacoes instanceof JSONObject) {
                this.operacoes.add(new OperacaoWIP(object.operacoes as JSONObject))
            } else {
                object.operacoes.myArrayList.each { jsonItem ->
                    this.operacoes.add(new OperacaoWIP(jsonItem as JSONObject))
                }
            }
        }
    }

    Integer getSequenciaPrimeiraOperacao() {
        return getPrimeiraOperacao()?.operationSequence
    }

    Integer getSequenciaUltimaOperacao() {
        return getUltimaOperacao()?.operationSequence
    }

    OperacaoWIP getPrimeiraOperacao() {
        return operacoes.min {it.operationSequence}
    }

    OperacaoWIP getUltimaOperacao() {
        return operacoes.max {it.operationSequence}
    }
}
