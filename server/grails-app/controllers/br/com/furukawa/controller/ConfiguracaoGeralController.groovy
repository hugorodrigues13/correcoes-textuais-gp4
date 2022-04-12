package br.com.furukawa.controller

import br.com.furukawa.enums.TipoDeDado
import br.com.furukawa.model.ConfiguracaoGeral
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.SpringSecurityService
import grails.converters.*

class ConfiguracaoGeralController extends CrudController{

    SpringSecurityService springSecurityService

    ConfiguracaoGeralController() {
        super(ConfiguracaoGeral)
    }

    def query = {
        if (params.descricao){
            tLike('descricao', '%' + params.descricao + '%', delegate)
        }

        if(params.valor){
            tLike('valor', '%' + params.valor + '%', delegate)
        }

        if(params.tipoDeDado){
            eq('tipoDeDado', params.tipoDeDado as TipoDeDado )
        }

        if(params.sort){
            order(params.sort, params.order)
        }else{
            order( 'descricao' )
        }

    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = ConfiguracaoGeral.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offsetBusca)
        def model = [:]
        JSON json = entities.collect{
            [id: it.id , descricao: it.descricao, valor: ( !it.tipoDeDado.isBoolean() ? it.valor : it.valor.equals("0") ? "NÃO" : "SIM" ), tipoDeDado: it.tipoDeDado.getDescricao() ]
        } as JSON
        def jsonRetorno = JSON.parse(json.toString())

        model.put("entities", jsonRetorno)
        model.put("total", entities.totalCount)

        respond model
    }

    @Override
    def getInstanceEntity(){
        println params
        def entityInstance
        if(params.id){
            entityInstance = ConfiguracaoGeral.get( params.id as long )
            entityInstance.properties = params
        } else {
            entityInstance = entity.newInstance(params)
        }
        entityInstance
    }

    @Override
    @Transactional
    def update(){
        params.putAll(getParametros())
        ConfiguracaoGeral configuracaoGeral = getInstanceEntity()
        configuracaoGeral.valor = params.valor
        configuracaoGeral.save()
        respond configuracaoGeral
    }

}
