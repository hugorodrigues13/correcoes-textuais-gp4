package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao
import grails.converters.JSON

class FiltroRomaneio {
    String codigoProduto
    String romaneio
    String lote
    String nota
    String dataInicial
    String dataFinal
    String numero
    String ordemProducao
    String ordemFabricacao
    String ultimas24Horas
    String status
    Ordenacao ordenacao
    Paginacao paginacao
    Integer max
    Integer offset

    def getOrdenacao() {
        return ordenacao ?: new Ordenacao()
    }

    void setOffset(String offset) {
        this.offset = offset ? Integer.valueOf(offset) : 0
    }

    void setMax(String max) {
        this.max = max ? Integer.valueOf(max) : 0
    }

    static build(Map params, boolean patch=false) {

        def paginacao = patch ? params.paginacao : JSON.parse(params.paginacao as String)

        return new FiltroRomaneio(
                codigoProduto: params.codigoProduto,
                romaneio: params.romaneio,
                lote: params.lote,
                nota: params.nota,
                dataInicial: params.dataInicial,
                dataFinal: params.dataFinal,
                numero: params.numero,
                ordemProducao: params.ordemProducao,
                ordemFabricacao: params.ordemFabricacao,
                ultimas24Horas: params.ultimas24horas,
                status: params.status,
                ordenacao: new Ordenacao(sort: params.sort ?: "numero", order: params.order),
                paginacao: new Paginacao(offset: paginacao.offset, max: paginacao.max),
                offset: params.offset,
                max: params.max
        )
    }
}
