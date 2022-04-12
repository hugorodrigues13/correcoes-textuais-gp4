package br.com.furukawa.dtos

import org.json.JSONObject

import java.text.DateFormat
import java.text.SimpleDateFormat

class OrdemDeVendaEBSDTO {

    private static final DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy")

    Long numeroOV
    String cliente
    String tipoProduto
    String codigoProduto
    String descricao
    Date dataEmissao
    Date scheduleShipDate
    Long quantidadePedida
    String statusLinha
    Long headerID
    String attribute6
    Long idLinha
    String attribute15
    String attribute7
    String attribute14
    String attribute8
    String creditoAprovado
    Long numeroLinha
    List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros = new ArrayList<>()

    OrdemDeVendaEBSDTO(JSONObject object) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")

        this.numeroOV = object.numeroOV
        this.cliente = object.cliente
        this.tipoProduto = object.tipoProduto
        this.codigoProduto = object.codigoProduto
        this.descricao = object.descricao
        this.dataEmissao = df.parse(object.dataEmissao as String)
        this.scheduleShipDate = df.parse(object.scheduleShipDate as String)
        this.quantidadePedida = object.quantidadePedida
        this.statusLinha = object.statusLinha
        this.headerID = object.headerID
        this.idLinha = object.idLinha
        this.attribute14 = object.attribute14
        this.attribute8 = object.attribute8
        this.creditoAprovado = object.creditoAprovado
        this.numeroLinha = object.numeroLinha

        if(object.has("attribute6")) {
            this.attribute6 = object.attribute6
        }
        if(object.has("attribute15")) {
            this.attribute15 = object.attribute15
        }
        if(object.has("attribute7")) {
            this.attribute7 = object.attribute7
        }
    }

    def getScheduleShipDateFormatted(){
        return dateFormat.format(scheduleShipDate)
    }

}
