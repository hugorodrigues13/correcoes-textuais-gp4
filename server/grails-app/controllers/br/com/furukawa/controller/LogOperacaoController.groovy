package br.com.furukawa.controller

import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.model.LogOperacao
import br.com.furukawa.enums.TipoLogOperacao
import grails.converters.JSON

import java.text.SimpleDateFormat


class LogOperacaoController extends CrudController{

    LogOperacaoController() {
        super(LogOperacao)
    }

    def query={
        if (params.usuario){
            tLike('usuario', '%' + params.usuario + '%', delegate)
        }

        if(params.tipoLogOperacao){
            eq("tipoLogOperacao", params.tipoLogOperacao as TipoLogOperacao)
        }

        if(params.dataInicial){
            Date dataInicial = new SimpleDateFormat('dd/MM/yyyy HH:mm').parse(params.dataInicial)
            ge("data", dataInicial)
        }

        if(params.dataFinal){
            Date dataFinal = new SimpleDateFormat('dd/MM/yyyy HH:mm').parse(params.dataFinal)
            le("data", dataFinal)
        }
        if (params.valor){
            parametros {
                ilike "valor", "%$params.valor%"
            }
        }

        if (params.tipoParametro){
            parametros {
                eq "tipo", TipoParametroLogOperacao.valueOf(params.tipoParametro)
            }
        }

        if(params.sort){
            order(params.sort, params.order)
        }else{
            order( 'data' )
        }

    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)

        def criteria = LogOperacao.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)
        def model = [:]

        model.put("entities", entities)
        model.put("total", entities.totalCount)
        model.put("tipos", TipoLogOperacao.values() as List)
        model.put("tiposParametro", TipoParametroLogOperacao.values() as List)

        respond model
    }

    def show(Long id) {
        respond LogOperacao.get(id)
    }
}
