package br.com.furukawa.dtos

import br.com.furukawa.dtos.ebs.CodigoDun
import br.com.furukawa.dtos.ebs.OperacaoWIP
import org.json.JSONArray
import org.json.JSONObject

import java.text.DateFormat
import java.text.SimpleDateFormat

class PedidoEBSDTO {
    String lote
    String wipStatusType
    String pedido
    String statusOC
    Long release
    String statusRelease
    String linha
    String codigoProduto
    String tipo
    String inventoryItemStatusCode
    Long qtde
    Long qtdeComplete
    Date dataEntrega
    String codigoServico
    BigDecimal precoCompra
    String statusEntregaLinha
    String fornecedor
    Long organizationID
    Long wipEntityID
    Long inventoryItemID
    Long inventoryItemIDServ
    Long resourceID
    String resourceCode
    Integer operationSeqNum
    Integer resourceSeqNum
    Long vendorID
    Integer statusType
    String descricaoProduto
    String cancelFlag
    String plannerCode
    BigDecimal pesoEmbalagem
    BigDecimal peso
    String ean13
    List<CodigoDun> codigosDun = new ArrayList<>()

    PedidoEBSDTO(String lote, String codigoProduto, String dataFormatoDiaMesAno, Long qtde) {
        this.lote = lote
        this.codigoProduto = codigoProduto
        this.dataEntrega = new SimpleDateFormat("dd/MM/yyyy").parse(dataFormatoDiaMesAno)
        this.qtde = qtde
    }

    PedidoEBSDTO(JSONObject object) {
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss")
        this.lote = object.lote
        this.wipStatusType = object.wipStatusType

        this.codigoProduto = object.codigoProduto
        this.tipo = object.tipo
        this.inventoryItemStatusCode = object.inventoryItemStatusCode
        this.qtde = object.qtde
        this.qtdeComplete =object.qtdeComplete
        this.dataEntrega =  df.parse( object.dataEntrega.toString() )

        this.organizationID = object.organizationID
        this.wipEntityID = object.wipEntityID
        this.inventoryItemID = object.inventoryItemID


        this.statusType = object.statusType

        if(object.has("pedido")) {
            this.pedido = object.pedido
        }

        if(object.has("statusOC")) {
            this.statusOC = statusOC
        }

        if(object.has("release")) {
            this.release = object.release
        }

        if(object.has("statusRelease")) {
            this.statusRelease = object.statusRelease
        }

        if(object.has("linha")) {
            this.linha = object.linha
        }

        if(object.has("codigoServico")) {
            this.codigoServico = object.codigoServico
        }

        if(object.has("precoCompra")) {
            this.precoCompra = new BigDecimal(object.precoCompra.toString())
        }

        if(object.has("statusEntregaLinha")) {
            this.statusEntregaLinha = object.statusEntregaLinha
        }

        if(object.has("fornecedor")) {
            this.fornecedor = object.fornecedor
        }

        if(object.has("vendorID")) {
            this.vendorID = object.vendorID
        }

        if(object.has("inventoryItemIDServ")) {
            this.inventoryItemIDServ = object.inventoryItemIDServ
        }

        if(object.has("resourceID")) {
            this.resourceID = object.resourceID
        }

        if(object.has("resourceCode")) {
            this.resourceCode = object.resourceCode
        }

        if(object.has("operationSeqNum")) {
            this.operationSeqNum = object.operationSeqNum
        }

        if(object.has("resourceSeqNum")) {
            this.resourceSeqNum = object.resourceSeqNum
        }

        if(object.has("cancelFlag")) {
            this.cancelFlag = object.cancelFlag
        }

        if(object.has("ean13")) {
            this.ean13 = object.ean13
        }

        if(object.has("plannerCode")) {
            this.plannerCode = object.plannerCode
        }

        if(object.has("peso")) {
            this.peso = new BigDecimal(object.peso.toString())
        }

        if(object.has("pesoEmbalagem")) {
            this.pesoEmbalagem = new BigDecimal(object.pesoEmbalagem.toString())
        }

        if(object.has("descricaoProduto")) {
            this.descricaoProduto = object.descricaoProduto
        }

        try {
            if(object.has("codigosDun")) {
                if(object.codigosDun instanceof JSONObject) {
                    if(object.codigosDun.codigoDun instanceof JSONObject) {
                        this.codigosDun.add(new CodigoDun(object.codigosDun.codigoDun as JSONObject))
                    } else if(object.codigosDun.codigoDun instanceof JSONArray) {
                        (0..object.codigosDun.codigoDun.length()-1).each {
                            this.codigosDun.add(new CodigoDun( ((JSONArray) object.codigosDun.codigoDun).opt(it) as JSONObject) )
                        }
                    }
                } else if(object.codigosDun instanceof JSONArray) {
                    (0..object.codigosDun.length()-1).each {
                        this.codigosDun.add(new CodigoDun( ((JSONArray) object.codigosDun).opt(it) as JSONObject) )
                    }
                }
            }
        } catch(e) {
            println 'erro codigosDun'
        }
    }

    String getDataFormatadaDiaMesAno() {
        return new SimpleDateFormat("dd/MM/YYYY").format(dataEntrega)
    }

    boolean possuiFlagCancelado() {
        return cancelFlag == "Y"
    }
}
