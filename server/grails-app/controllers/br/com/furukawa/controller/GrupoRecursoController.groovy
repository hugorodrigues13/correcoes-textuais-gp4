package br.com.furukawa.controller

import br.com.furukawa.auth.MyUserDetails
import br.com.furukawa.dtos.filtros.FiltroGrupoRecurso
import br.com.furukawa.dtos.GrupoRecursoEntitiesETotalDTO
import br.com.furukawa.dtos.TipoRegraExibicaoMP
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.GrupoRecursoException
import br.com.furukawa.model.Defeito
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.ProcessoLinhaDeProducao
import br.com.furukawa.model.Recurso
import br.com.furukawa.service.GrupoRecursoService
import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService

class GrupoRecursoController extends CrudController{
    SpringSecurityService springSecurityService

    GrupoRecursoService grupoRecursoService

    GrupoRecursoController() {
        super(GrupoRecurso)
    }

    @Override
    Object index() {

        Map model = [:]
        FiltroGrupoRecurso filter = FiltroGrupoRecurso.build(params) as FiltroGrupoRecurso

        GrupoRecursoEntitiesETotalDTO retorno = grupoRecursoService.buscarGrupoRecursoPorFiltros(filter)

        model.put("entities", retorno.entities)
        model.put("total", retorno.total)

        respond model
    }

    def getModelPadrao(){
        def model = [:]
        List<Recurso> recursos =  Recurso.findAllByFornecedorAndIsAtivo(getFornecedorLogado(), true)
        List<Defeito> defeitos = Defeito.findAllByFornecedorAndIsAtivo(getFornecedorLogado(), true)
        List<MotivoDeParada> motivos = MotivoDeParada.findAllByFornecedorAndIsAtivo(getFornecedorLogado(), true)
        GrupoRecurso entityInstance = entity.get(params.id)
        if(entityInstance) {
            recursos += entityInstance.recursos
            defeitos += entityInstance.defeitos
            motivos += entityInstance.motivosDeParada
        }
        model.put("recursos",recursos)
        model.put("defeitos", defeitos)
        model.put("listMotivosParadas", motivos)
        model.put("listTiposRegras", TipoRegraExibicaoMP.values() as List)
        return model
    }

    @Override
    def prepareNew() {
        def model = getModelPadrao()
        model["entityInstance"]= entity.newInstance(params)
        respond model
    }

    @Override
    def prepareEdit(){
        GrupoRecurso entityInstance = entity.get(params.id)

        if(entityInstance == null){
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.not.found.message", getLocale()) as JSON
            return;
        }
        def model = getModelPadrao()
        model.put('entityInstance', entityInstance)
        respond model
    }

    @Override
    def beforeSave(Object entityInstance) {
        entityInstance.fornecedor = (springSecurityService.getPrincipal() as MyUserDetails).fornecedor
    }

    @Override
    def getInstanceEntity() {
        GrupoRecurso entityInstance
        if (params.id) {
            entityInstance = entity.get(params.id)
            entityInstance.regras.clear()

            entityInstance.properties = params
        } else {
            entityInstance = entity.newInstance(params)
        }

        setCollettions(entityInstance)

        setAlteracoesEspecificas( entityInstance )

        entityInstance
    }

    @Override
    def update() {
        params.putAll(getParametros())
        println(params)
        log.println(params)

        if (handleReadOnly()) {
            return
        }

        GrupoRecurso grupoAntigo = GrupoRecurso.get(params.id)
        grupoRecursoService.validaRecursos(getFornecedorLogado(), params.recursos as ArrayList<Long>, params.id as Long)
        int tempoAntigo = grupoAntigo.tempoPadrao

        def instance = getInstanceEntity()

        beforeSave(instance)

        if (instance.errors.allErrors.size() > 0 || !instance.validate()) {
            print instance.errors
            render status: 422, crudService.montaListaDeErrors(instance.errors.allErrors, getLocale()) as JSON
            return
        } else {
            crudService.salvar(instance)
            grupoRecursoService.atualizaVigencias(instance as GrupoRecurso, tempoAntigo)
            afterSave(instance)
        }
    }

    @Override
    def delete() {
        super.delete()
    }

    @Override
    boolean temAssociacao(Object instance) {
        return ProcessoLinhaDeProducao.findByGrupoRecurso(instance)
    }

    def grupoRecursoException(GrupoRecursoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

}
