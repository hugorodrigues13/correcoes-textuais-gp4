package br.com.furukawa.dtos.rtda

import org.json.JSONObject

class LinhaDadoRTDA {
    String codigoProduto
    String ordemDeFabricacao
    Long quantidade
    String ordemProducao
    String lote
    String comprimento
    String modelo
    String fornecedor
    String organizacao
    String recurso
    String dataInicio
    String dataFim

    JSONObject toJsonObject() {
        return new JSONObject(
            "codigoProduto": codigoProduto,
            "ordem_fabricacao": ordemDeFabricacao,
            "quantidade": quantidade,
            "ordem_producao": ordemProducao,
            "lote": lote,
            "comprimento": comprimento,
            "modelo": modelo,
            "fornecedor": fornecedor,
            "organizacao": organizacao,
            "recurso": recurso,
            "data_inicio": dataInicio,
            "data_fim": dataFim
        )
    }
}
