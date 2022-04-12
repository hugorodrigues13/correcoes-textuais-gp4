package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.LoteException
import br.com.furukawa.exceptions.TransformacaoLoteException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.Lote
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.TransformacaoLoteService
import grails.rest.*
import grails.converters.*

class TransformacaoLoteController {

    TransformacaoLoteService transformacaoLoteService
    CrudService crudService

    def buscarCaixas() {
        Lote lote = Lote.buscaPorCodigoLote(params.lote)
        List<ImpressaoApontamentoCaixa> caixas = lote.impressao.caixas.sort({it.numeroCaixa})

        def model = [:]
        model.put('caixas', caixas)

        respond model
    }

    def dividirLote(){
        params.putAll(getParametros())

        Lote lote = Lote.buscaPorCodigoLote(params.lote)
        List<ImpressaoApontamentoCaixa> novoLoteCaixas = ImpressaoApontamentoCaixa.getAll(params.novoLoteCaixas)

        Lote novoLote = transformacaoLoteService.dividirLote(lote, novoLoteCaixas)

        render status: 200, crudService.montaMensagemDeRespostaCompleta(TipoMensagem.SUCCESS_TYPE, 'transformacaoLotes.divido.message', [novoLote.codigoLote] as Object[], getLocale()) as JSON
    }

    def agruparLote(){
        params.putAll(getParametros())

        Lote lote1 = Lote.buscaPorCodigoLote(params.lote1)
        Lote lote2 = Lote.buscaPorCodigoLote(params.lote2)
        Boolean manterLote1 = params.boolean('manterLote1')

        transformacaoLoteService.agruparLote(lote1, lote2, manterLote1)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def pesquisarLotes(){
        Fornecedor fornecedor = crudService.getFornecedorLogado()
        def model = [:]

        if (params.lote1){
            model.put("lote1", transformacaoLoteService.getLotes(fornecedor, params.lote1))
        }

        if (params.lote2){
            model.put("lote2", transformacaoLoteService.getLotes(fornecedor, params.lote2))
        }

        respond model
    }

    def transformacaoException(TransformacaoLoteException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    // boilerplate abaixo

    Map getParametros() {
        def parameters = JSON.parse(request.getReader()) as Map
        return parameters
    }

    protected String getLingua(){
        return request.getHeader("locale") ?: "pt-BR"
    }

    def getLocale(){
        def lang = getLingua()
        return crudService.getLocale(lang)
    }

}
