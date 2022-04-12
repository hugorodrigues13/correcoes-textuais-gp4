package br.com.furukawa.controller

import br.com.furukawa.dtos.MotivoDeParadaDTO
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.enums.TipoMotivoParada
import br.com.furukawa.model.Defeito
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.Recurso
import br.com.furukawa.service.MotivoDeParadaService
import br.com.furukawa.service.PesquisaService
import grails.gorm.transactions.Transactional
import grails.rest.*
import grails.converters.*

class MotivoDeParadaController extends CrudController {

    MotivoDeParadaService motivoDeParadaService

    MotivoDeParadaController() {
        super(MotivoDeParada)
    }

    def index() {
        params.max = Math.min(params.int('max') ?: 10,100)

        List<MotivoDeParadaDTO> entities = motivoDeParadaService.getMotivosDeParada(getFornecedorLogado(), params.motivo as String, params.tipo as String, params.gruposRecurso as String, params.status as String, params.sort as String, params.order as String, params.offset as int, params.max as int)
        Integer total = motivoDeParadaService.getTotalMotivosDeParada(getFornecedorLogado(), params.motivo as String, params.tipo as String, params.gruposRecurso as String, params.status as String)

        def model = [:]
        model.put('entities', entities)
        model.put('total', total)
        model.put('tipos', TipoMotivoParada.values() as List)

        respond model
    }

    @Override
    def delete() {
        super.delete()
    }

    @Override
    boolean temAssociacao(Object instance) {
        return instance.getGruposRecurso()
    }

    def prepareEdit(){
        MotivoDeParada motivo = MotivoDeParada.findByIdAndFornecedor(params.id as long, getFornecedorLogado())
        if (!motivo){
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.not.found.message", getLocale()) as JSON
            return
        }
        def model = getModelPadrao()
        model.put('entityInstance', motivo)
        respond model
    }

    def prepareNew(){
        def model = getModelPadrao()

        respond model
    }

    def getModelPadrao(){
        def model = [:]
        model.put('tipos', TipoMotivoParada.values() as List)
        model.put("listGrupoRecurso", GrupoRecurso.findAllByFornecedor(getFornecedorLogado()))
        return model
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.fornecedor = getFornecedorLogado()
    }

    @Transactional
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

            MotivoDeParada entity = instance
            List<Integer> novosIds = params.gruposRecurso
            List<GrupoRecurso> grupos = GrupoRecurso.getAll(novosIds)
            motivoDeParadaService.atualizarGrupos(entity, grupos)
            afterSave(instance)
        }
    }
}
