package br.com.furukawa.controller

import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.Lote
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.SerialService
import grails.converters.*

class ReimpressaoEtiquetasController {

    CrudService crudService
    SerialService serialService
    PesquisaService pesquisaService

    def reimprimir(){
        params.putAll(getParametros())
        Lote lote = Lote.buscaPorCodigoLote(params.lote as String)

        ImpressaoApontamentoLote impressaoLote = ImpressaoApontamentoLote.findByLote(lote)

        if (!lote){
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "reimpressaoEtiquetas.lote.naoEncontrado.message", getLocale()) as JSON
            return
        }

        if(!impressaoLote) {
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "reimpressaoEtiquetas.lote.semImpressoes.message", getLocale()) as JSON
            return
        }

        Integer numeroCaixa = params.numeroCaixa
        Integer copias = params.copias

        List<ImpressaoApontamentoCaixa> caixas = []
        if(numeroCaixa) {
            ImpressaoApontamentoCaixa caixa = impressaoLote.caixas.find { it.numeroCaixa == numeroCaixa }

            if(!caixa) {
                render status: 404, crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, "reimpressaoEtiquetas.lote.caixaNaoEncontrada.message", [numeroCaixa, impressaoLote.getCodigoLote()] as Object[], getLocale()) as JSON
                return
            }

            caixas = [caixa]
        } else {
            caixas = impressaoLote.caixas.toList()
        }

        def model = [:]

        if (params.tipo == "pdf"){
            List<RetornoImpressao> etiquetas = serialService.gerarEtiquetasDoLote(impressaoLote, caixas, copias)
            model.put("etiquetas", etiquetas)
        } else if (params.tipo == "impressora"){
            Impressora impressora = Impressora.get(params.long('impressora'))
            List<RetornoImpressao> etiquetas = serialService.reimprimirLote(impressora, caixas, copias)
            model.put("impressora", impressora)
            model.put("etiquetas", etiquetas)
        }

        respond model

    }

    def impressoras(){
        List<Impressora> impressoras = Impressora.findAllByFornecedor(crudService.getFornecedorLogado())

        def model = [:]
        model.put("impressoras", impressoras)

        respond model
    }

    def pesquisarDados() {
        def model = [:]
        model.put("lotes", pesquisaService.getLotes(crudService.getFornecedorLogado(), params.lote as String))

        respond model
    }

    def getLocale() {
        def lang = getLingua()
        return crudService.getLocale(lang)
    }

    String getLingua() {
        return request.getHeader("locale") ?: "pt-BR"
    }

    Map getParametros() {
        def lang = getLingua()
        def parameters = JSON.parse(request.getReader()) as Map
        def locale = crudService.getLocale(lang)
        parameters["locale"] = locale
        return parameters
    }

}
