package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.ClassePorPlanejador
import br.com.furukawa.service.ClassePorPlanejadorService
import br.com.furukawa.service.OracleService
import grails.rest.*
import grails.converters.*

class ClassePorPlanejadorController extends CrudController {

    OracleService oracleService
    ClassePorPlanejadorService classePorPlanejadorService

    ClassePorPlanejadorController(){
        super(ClassePorPlanejador)
    }

    @Override
    Object index(){
        params.max = Math.min(params.int('max') ?: 10, 100)

        def entities = classePorPlanejadorService.getClassesPorPlanejador(params.classeContabil as String, params.planejador as String, params.max as int, params.offset as int, params.order as String, params.sort as String, getOrganizacaoLogada())
        int total = classePorPlanejadorService.getClassesPorPlanejadorTotal(params.classeContabil as String, params.planejador as String, getOrganizacaoLogada())

        def model = [:]
        model.put('entities', entities)
        model.put("total", total)

        respond model
    }

    @Override
    def prepareNew() {
        def model = [entityInstance: entity.newInstance(params)]
        model.put("planejadores", oracleService.getPlanejadores(getOrganizacaoLogada()))
        respond model
    }

    @Override
    def prepareEdit() {
        def model = [:]
        ClassePorPlanejador entityInstance = entity.get(params.id)
        model.put('entityInstance', entityInstance);
        model.put("planejadores", oracleService.getPlanejadores(getOrganizacaoLogada()))
        respond model;
    }

    @Override
    def save() {
        params.putAll(getParametros())
        println(params)
        log.println(params)

        if (handleReadOnly()) {
            return
        }

        def instance = getInstanceEntity()

        beforeSave(instance)

        if (instance.errors.allErrors.size() > 0 || !instance.validate()) {
            print instance.errors
            render status: 422, crudService.montaListaDeErrors(instance.errors.allErrors, getLocale()) as JSON
            return
        } else {
            crudService.salvar(instance)

            afterSave(instance)
        }
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.organizacao = getOrganizacaoLogada()
    }


}
