package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao

class FiltroGrupoRecurso {
    String nome
    String operacao
    String recurso
    Integer tempoPadrao
    Integer tempoMaximoSemApontamento
    Ordenacao ordenacao
    Paginacao paginacao
    Integer max
    Integer offset
    String status

    def getOrdenacao() {
        return ordenacao ?: new Ordenacao()
    }

    void setOffset(String offset) {
        this.offset = offset ? Integer.valueOf(offset) : 0
    }

    void setMax(String max) {
        this.max = max ? Integer.valueOf(max) : 0
    }

    static build(Map params) {

        return new FiltroGrupoRecurso(
                nome: params.nome,
                operacao: params.operacao,
                recurso: params.recurso,
                tempoPadrao: params.tempoPadrao?.isNumber() ? params.tempoPadrao.toInteger() : null,
                tempoMaximoSemApontamento: params.tempoMaximoSemApontamento?.isNumber() ? params.tempoMaximoSemApontamento.toInteger() : null,
                ordenacao: new Ordenacao(sort: params.sort ?: "numero", order: params.order),
                paginacao: new Paginacao(offset: params.offset as Integer, max: params.max as Integer),
                offset: params.offset,
                max: params.max,
                status: params.status
        )
    }
}
