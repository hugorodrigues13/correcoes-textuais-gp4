package br.com.furukawa.controller

import br.com.furukawa.dtos.SerialFabricacaoDTO
import br.com.furukawa.dtos.filtros.FiltroSerial
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.GrupoLinhaProducaoException
import br.com.furukawa.exceptions.GrupoRecursoException
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.service.GrupoLinhaDeProducaoService
import br.com.furukawa.service.RelatorioService
import grails.rest.*
import grails.converters.*

class GrupoLinhaProducaoController extends CrudController{

    GrupoLinhaDeProducaoService grupoLinhaDeProducaoService
    RelatorioService relatorioService

    GrupoLinhaProducaoController() {
        super(GrupoLinhaDeProducao)
    }

    def query = {
        checaAtivo(delegate)
        if (params.nome) {
            tLike('nome', '%' + params.nome + '%', delegate)
        }

        if (params.linhas) {
            linhas{
                ilike('nome', "%$params.linhas%")
            }
        }

        if (params.produtos) {
            produtos{
                eq('codigo', params.produtos)
            }
        }

        if(params.sort){
            order(params.sort, params.order)
        }

        eq('fornecedor', getFornecedorLogado())
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10,100)
        def criteria = GrupoLinhaDeProducao.createCriteria()

        def entities = criteria.list(query, max: params.max, offset: params.offset)
        def total = entities.totalCount ? entities.totalCount : 0

        def model = [:]

        model.put('entities', entities)
        model.put('total', total)

        respond model
    }

    @Override
    def prepareNew() {
        def model = [entityInstance: entity.newInstance(params)]
        model.put("listGrupoLinhaProducao", grupoLinhaDeProducaoService.getUltimasVersoesLinhasDeProducao(getFornecedorLogado()))
        respond model
    }

    @Override
    def editaModelPrepareEdit(def model)
    {
        model.put("listGrupoLinhaProducao", grupoLinhaDeProducaoService.getUltimasVersoesLinhasDeProducao(getFornecedorLogado()))
        return model
    }

    @Override
    def getInstanceEntity() {
        GrupoLinhaDeProducao entityInstance
        if (params.id) {
            entityInstance = entity.get(params.id)
            entityInstance.produtos.clear()

            entityInstance.properties = params
        } else {
            entityInstance = entity.newInstance(params)
        }

        setCollettions(entityInstance)

        setAlteracoesEspecificas( entityInstance )

        entityInstance
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.fornecedor = getFornecedorLogado()
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
            grupoLinhaDeProducaoService.checarGruposRecursosRepetidos(getFornecedorLogado(), params.linhas as ArrayList<Long>)
            grupoLinhaDeProducaoService.checarProdutoGrupoLinha(getFornecedorLogado(), params.produtos as List, null)
            crudService.salvar(instance)

            afterSave(instance)
        }
    }

    def update() {
        params.putAll(getParametros())
        println(params)
        log.println(params.id)

        if (handleReadOnly()) {
            return
        }

        grupoLinhaDeProducaoService.validaProdutos(GrupoLinhaDeProducao.get(params.id), params.produtos)

        def instance = getInstanceEntity()

        beforeSave(instance)
        grupoLinhaDeProducaoService.validaLinhasDeProducao(getFornecedorLogado(), params.id as Long, params.linhas as ArrayList<Long>)
        grupoLinhaDeProducaoService.checarProdutoGrupoLinha(getFornecedorLogado(), params.produtos as List, params.id as Long)

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
    def delete() {
        super.delete()
    }

    @Override
    boolean temAssociacao(instance) {
        return OrdemDeFabricacao.findAllByGrupoLinhaProducao(instance)
    }

    def exportar(){
        params.putAll(getParametros())

        List<String> colunas = ['nome', 'codigo', 'roteiro', 'quantidade']
        Map<String, String> filtros = ['nome', 'linhas', 'produtos'].collectEntries({[it, params."$it"]}).findAll({it.value})

        List<GrupoLinhaDeProducao> entities = GrupoLinhaDeProducao.createCriteria()
                .list(query, max: 100000, offset: 0)

        File file = relatorioService.gerarRelatorioGrupoLinhas(entities, colunas, filtros, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

    def grupoLinhaProducaoException(GrupoLinhaProducaoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def grupoRecursoException(GrupoRecursoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

}
