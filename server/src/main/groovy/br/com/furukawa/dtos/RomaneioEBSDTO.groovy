package br.com.furukawa.dtos

import br.com.furukawa.model.Lote
import org.json.JSONObject

class RomaneioEBSDTO {
    String ordemDeProducao
    String codigoProduto
    String pedido
    String release
    String linha
    String servico
    Long qtde
    BigDecimal precoUnitario
    Integer taxaDeConversao
    String unidade
    // uso interno
    boolean valido
    Set<Lote> lote

    RomaneioEBSDTO() {

    }

    RomaneioEBSDTO(JSONObject object) {
        this.ordemDeProducao = object.ordemDeProducao
        this.codigoProduto = object.codigoProduto
        this.pedido = object.pedido
        this.release = object.has("release") ? object.release : null
        this.linha = object.linha
        this.servico = object.servico
        this.qtde = object.qtde
        this.precoUnitario = object.precoUnitario
        this.taxaDeConversao = object.taxaDeConversao
        this.unidade = object.unidade
    }
}
