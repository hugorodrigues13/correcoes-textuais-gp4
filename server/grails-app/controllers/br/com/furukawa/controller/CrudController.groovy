package br.com.furukawa.controller

import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.ApontamentoException
import br.com.furukawa.exceptions.FaturamentoException
import br.com.furukawa.exceptions.OracleException
import br.com.furukawa.exceptions.ImpressoraException
import br.com.furukawa.exceptions.OrdemDeFabricacaoException
import br.com.furukawa.exceptions.OrdemDeProducaoException
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.exceptions.SequenciamentoException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.EmailService
import grails.converters.JSON
import grails.gorm.transactions.Transactional
import grails.rest.RestfulController
import grails.web.http.HttpHeaders
import org.springframework.security.access.AccessDeniedException

import java.text.Normalizer

class CrudController extends RestfulController {

    Class entity

    def beforeInterceptor = {}

    CrudService crudService

    EmailService emailService

    CrudController(Class entity) {
        super(entity)
        this.entity = entity
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = entity.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)
        def model = [:]

        model.put("entities", entities)
        model.put("total", entities.totalCount)
        respond model
    }

    def prepareNew() {
        def model = getModelPadrao()
        model.entityInstance = entity.newInstance(params)
        model = editaModelPrepareNew(model)
        respond model
    }

    def prepareEdit() {
        def entityInstance = entity.get(params.id)
        if(entityInstance) {
            def model = getModelPadrao()
            model.entityInstance = entityInstance
            model = editaModelPrepareEdit(model)
            respond model
        }else{
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.not.found.message", getLocale()) as JSON
        }
    }

    def getModelPadrao(){
        def model = [:]

        return model
    }

    def editaModelPrepareNew(def model)
    {
        return model
    }

    def editaModelPrepareEdit(def model)
    {
        return model
    }

    def beforeList() {}

    def beforeSave(entityInstance) {}

    def setCollettions(entityInstance) {}

    def setAlteracoesEspecificas( entityInstance ){}

    def getInstanceEntity() {
        def entityInstance
        if (params.id) {
            entityInstance = entity.get(params.id)
            println(entityInstance)
            entityInstance.properties = params
        } else {
            entityInstance = entity.newInstance(params)
        }

        if( entityInstance.hasProperty( 'organizacao' ) ){
            entityInstance.organizacao = getOrganizacaoLogada()
        }

        setCollettions(entityInstance)

        setAlteracoesEspecificas( entityInstance )

        entityInstance
    }

    @Transactional
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

    @Transactional
    def delete() {
        if (handleReadOnly()) {
            return
        }

        def instance = entity.get(params.id)
        if (instance == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        beforeDelete()

        if (instance.hasProperty("isRemovivel") && instance.isRemovivel == false) {
            respond crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'default.denied.delete.message', getLocale())
        } else if (!temAssociacao(instance) && crudService.excluir(instance)){
            respond crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.deleted.message', getLocale())
        } else if(instance.hasProperty("isAtivo") && instance.isAtivo) {
            crudService.ativarOuDesativar(instance, false)
            respond crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.inactived.message', getLocale())
        } else {
            respond crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'default.denied.delete.message', getLocale())
        }
    }

    boolean temAssociacao(instance){
        return false
    }

    void beforeDelete(instance){}

    def afterSave(instance) {
        response.addHeader(HttpHeaders.LOCATION,
                grailsLinkGenerator.link(resource: this.controllerName, action: 'show', id: instance.id, absolute: true,
                        namespace: hasProperty('namespace') ? this.namespace : null))
        String message = params.id ? 'default.updated.message' : 'default.created.message'
        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, message, getLocale()) as JSON
    }

    List parseLista(listaGenerica) {
        print listaGenerica;
        if (listaGenerica instanceof String) {
            List lista = new ArrayList()
            lista.add(listaGenerica)

            return lista
        } else {
            return listaGenerica
        }
    }

    @Transactional
    def update() {
        save()
    }

    Map getParametros() {
        def lang = getLingua()
        def parameters = JSON.parse(request.getReader()) as Map
        def locale = crudService.getLocale(lang)
        parameters["locale"] = locale
        return parameters
    }

    def getLocale(){
        def lang = getLingua()
        return crudService.getLocale(lang)
    }

    def getIdiomaPeloLocale(){
        def lang = getLingua()
        return Idioma.getIdiomaPeloLocale( lang )
    }

    /**
     * Este método funciona para entidades que possuem apenas dois
     * estados: ATIVO/INATIVO.
     */

    @Transactional
    def ativarOuDesativar() {
        try {
            params.putAll(getParametros())
            if(params.id) {
                def instance = entity.get(params.id)
                crudService.ativarOuDesativar(instance, !instance.isAtivo)
                afterSave(instance)
            }else{
                render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
            }
        }catch(e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", getLocale()) as JSON
        }
    }

    /**
     * O método é invocado quando a respectiva exceção é lançada
     */
    def connectException(final ConnectException exception) {
        respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'default.erro.conexao.message', getLocale())
    }

    def accessDeniedException(final AccessDeniedException exception){
        respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'default.accesDenied.message', getLocale())
    }

    def exception(final Exception exception){
        emailService.enviaEmailDeErro(exception)
        respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'default.erroDefault.message', getLocale())
    }

    def sequenciamentoException(SequenciamentoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def ordemDeProducaoException(OrdemDeProducaoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(exception.warning ? TipoMensagem.WARNING_TYPE : TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def apontamentoException(ApontamentoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def oracleException(OracleException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def faturamentoException(FaturamentoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def impressoraException(ImpressoraException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def relatorioException(RelatorioException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def ordemFabricacaoException(OrdemDeFabricacaoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    private void logException(final Exception exception) {
        log.error "Exception occurred. ${exception?.message}", exception
    }

    Organizacao getOrganizacaoLogada(){
        return crudService.getOrganizacaoLogada()
    }

    Fornecedor getFornecedorLogado(){
        return crudService.getFornecedorLogado()
    }

    void tLike(String column, String value, delegate) {
        value = Normalizer.normalize(value.toUpperCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").trim().replaceAll(/(%\W+|\W+%)/, '%')

        def query = {
            sqlRestriction("translate(UPPER(${column}), 'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝ', 'SZszYACEIOUAEIOUAEIOUAOEUIONY') like '${value}'")
        }
        query.delegate = delegate
        query()
    }

    void checaAtivo(delegate){
        def query = {
            if (params.status){
                if (params.status != "TODOS"){
                    boolean ativo = params.status == "ATIVO"
                    eq 'isAtivo', ativo
                }
            } else {
                eq 'isAtivo', true
            }
        }
        query.delegate = delegate
        query()
    }

    protected String getLingua(){
        return request.getHeader("locale") ?: "pt-BR"
    }
}
