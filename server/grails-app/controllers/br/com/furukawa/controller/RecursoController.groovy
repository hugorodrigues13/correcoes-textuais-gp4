package br.com.furukawa.controller

import br.com.furukawa.model.Conector
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.Recurso
import br.com.furukawa.model.Teste
import br.com.furukawa.service.RecursoService
import br.com.furukawa.service.TesteService
import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService

class RecursoController extends CrudController {

    SpringSecurityService springSecurityService
    TesteService testeService
    RecursoService recursoService

    def query = {
        checaAtivo(delegate)
        if(params.nome) {
            tLike("nome", "%" + params.nome + "%", delegate)
        }

        if(params.metaOEE) {
            tLike("meta_oee", "%" + params.metaOEE + "%", delegate)
        }

        if(params.codigoOracle) {
            tLike("codigo_oracle", "%" + params.codigoOracle + "%", delegate)
        }

        if(params.conector) {
            conectores{
                eq('id', params.long('conector'))
            }
        }

        if(params.sort) {
            order(params.sort, params.order)
        } else {
            order( 'nome' )
        }

        eq('fornecedor', springSecurityService.getPrincipal().fornecedor)
    }

    RecursoController() {
        super(Recurso)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = Recurso.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def model = [:]

        model.put('entities', entities)
        model.put('listConectores', Conector.getAll())
        model.put("total", entities.totalCount)

        respond model
    }

    @Override
    def editaModelPrepareNew(def model)
    {
        model.put("listConectores", Conector.list())
        model.put("tiposTeste", testeService.getTiposTeste())

        return model
    }

    @Override
    def editaModelPrepareEdit(def model)
    {
        model.put("listConectores", Conector.list())
        model.put("tiposTeste", testeService.getTiposTeste())

        return model
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.fornecedor = springSecurityService.getPrincipal().fornecedor
    }

    @Override
    def getInstanceEntity() {
        Recurso entityInstance
        if (params.id) {
            entityInstance = entity.get(params.id)
            entityInstance.testes.clear()

            entityInstance.properties = params
        } else {
            entityInstance = entity.newInstance(params)
        }

        setCollettions(entityInstance)

        setAlteracoesEspecificas( entityInstance )

        entityInstance
    }
}
