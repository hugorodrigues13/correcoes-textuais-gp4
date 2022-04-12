package br.com.furukawa.controller

import br.com.furukawa.enums.TipoImpressao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.ImpressoraException
import br.com.furukawa.model.Impressora
import br.com.furukawa.service.ImpressoraService
import grails.plugin.springsecurity.SpringSecurityService


class ImpressoraController extends CrudController {

    ImpressoraService impressoraService

    SpringSecurityService springSecurityService

    def query = {
        if (params.nome) {
            tLike("nome", "%" + params.nome + "%", delegate)
        }

        if (params.apelido) {
            tLike("apelido", "%" + params.apelido + "%", delegate)
        }

        if (params.tipoImpressao) {
            eq('tipoImpressao', params.tipoImpressao as TipoImpressao)
        }

        if (params.ips) {
            createAlias('ips', 'i')
            tLike("i.elements", "%" + params.ips + "%", delegate)
        }

        if (params.sort) {
            order(params.sort, params.order)
        } else {
            order('nome')
        }

        eq('fornecedor', getFornecedorLogado())
    }

    ImpressoraController() {
        super(Impressora)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = Impressora.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        List<TipoImpressao> tiposImpressao = Arrays.asList(TipoImpressao.values())

        def model = [:]
        model.put('entities', entities)
        model.put("total", entities.totalCount)
        model.put("tiposImpressao", tiposImpressao)

        respond model
    }

    @Override
    def prepareNew() {
        def model = [:]
        List<TipoImpressao> tipoImpressaoList = TipoImpressao.findAll()

        List <String> impressorasList = impressoraService.getImpressoras()

        model.put("impressorasList",impressorasList)
        model.put("entityInstance", entity.newInstance(params))
        model.put("tipoImpressaoList", tipoImpressaoList)

        model = editaModelPrepareNew(model)
        respond model
    }

    @Override
    def editaModelPrepareEdit(def model)
    {
        List <String> impressorasList = impressoraService.getImpressoras()

        List<TipoImpressao> tipoImpressaoList = TipoImpressao.findAll()

        model.put("impressorasList",impressorasList)
        model.put("tipoImpressaoList", tipoImpressaoList)

        return model
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.fornecedor = getFornecedorLogado()
    }

    def impressoraException(ImpressoraException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }
}
