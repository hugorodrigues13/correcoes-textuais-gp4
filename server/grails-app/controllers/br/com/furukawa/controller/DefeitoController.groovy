package br.com.furukawa.controller

import br.com.furukawa.model.Defeito
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.service.DefeitoService
import grails.converters.*

class DefeitoController extends CrudController {
    DefeitoService defeitoService

    def query = {
        checaAtivo(delegate)
        if(params.nome) {
            tLike("nome", "%" + params.nome + "%", delegate)
        }

        eq('fornecedor', getFornecedorLogado())

        order( 'nome', params.order )
    }

    DefeitoController() {
        super(Defeito)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def entities
        def model = [:]
        Integer total = defeitoService.quantidadeDefeitosPorGrupoRecurso(params.nome, params.grupoRecurso, query, params.max, params.offset)
        entities = defeitoService.defeitoPorGrupoRecurso(params.nome, params.grupoRecurso, params.status, query, params.max, params.offset, params.order)
        model.put('entities', entities)
        model.put('total', total)
        model.put('listGrupoRecurso', GrupoRecurso.findAllByFornecedor(getFornecedorLogado()))

        respond model
    }

    @Override
    def editaModelPrepareNew(def model) {
        model.put("listGrupoRecurso", GrupoRecurso.findAllByFornecedor(getFornecedorLogado()))

        return model
    }

    @Override
    def editaModelPrepareEdit(def model) {
        model.put("listGrupoRecurso",  GrupoRecurso.findAllByFornecedor(getFornecedorLogado()))

        return model
    }

    @Override
    def save() {
        params.putAll(getParametros())
        println(params)
        log.println(params)

        if (handleReadOnly()) {
            return
        }

        Defeito instance = getInstanceEntity() as Defeito

        beforeSave(instance)

        if (instance.errors.allErrors.size() > 0 || !instance.validate()) {
            print instance.errors
            render status: 422, crudService.montaListaDeErrors(instance.errors.allErrors, getLocale()) as JSON
            return
        } else {
            crudService.salvar(instance)
            defeitoService.atualizarDefeitosGrupoRecurso( instance, params.grupos )
            afterSave(instance)
        }
    }

    @Override
    def delete() {
        super.delete()
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.fornecedor = getFornecedorLogado()
    }
}
