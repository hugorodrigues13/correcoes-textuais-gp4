package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao
import br.com.furukawa.dtos.Periodo
import grails.converters.JSON

class FiltroAuditLog {
    String username
    String tipo
    String operacao
    String entidade
    String propriedade
    String valorAntigo
    String valorNovo
    Long entidadeId
    Periodo periodoAtualizacao
    Periodo periodo
    Ordenacao ordenacao
    Paginacao paginacao
    Integer max
    Integer offset

    def getOrdenacao(){
        return ordenacao ?: new Ordenacao()
    }

    def getPaginacao(){
        return  paginacao ?: new Paginacao()
    }

    void setOffset(String offset) {
        this.offset = offset ? Integer.valueOf(offset) : 0
    }

    void setMax(String max) {
        this.max = max ? Integer.valueOf(max) : 0
    }

    static build(Map params){

        def paginacao = JSON.parse(params.paginacao)

        return new FiltroAuditLog(
                username: params.username,
                tipo: params.tipo,
                entidade: params.entidade,
                operacao: params.operacao,
                propriedade: params.propriedade,
                valorAntigo: params.valorAntigo,
                valorNovo: params.valorNovo,
                entidadeId: params.entidadeId as Long,
                periodoAtualizacao: new Periodo(params.periodoAtualizaoInicial, params.periodoAtualizaoFinal),
                periodo: new Periodo(params.periodoCriacaoInicial,params.periodoCriacaoFinal),
                ordenacao: new Ordenacao(sort: params.sort, order: params.order),
                paginacao: new Paginacao(offset: paginacao.offset, max: paginacao.max),
                offset: params.offset,
                max: params.max
        )
    }
}
