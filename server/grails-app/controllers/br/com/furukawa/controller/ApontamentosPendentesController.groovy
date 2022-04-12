package br.com.furukawa.controller

import br.com.furukawa.dtos.ApontamentoPendenteDTO
import br.com.furukawa.dtos.filtros.FiltroApontamentosPendentes
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.HistoricoApontamento
import br.com.furukawa.service.ApontamentoService
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.RelatorioService
import grails.converters.*

class ApontamentosPendentesController {

    CrudService crudService
    ApontamentoService apontamentoService
    RelatorioService relatorioService

    def index() {
        def model = [:]
        params.max = Math.min(params.int('max') ?: 10,100)
        FiltroApontamentosPendentes filtro = new FiltroApontamentosPendentes(params)
        List<ApontamentoPendenteDTO> entities = apontamentoService.buscarApontamentosPendentes(getFornecedorLogado(), filtro)

        model.put('entities', entities)
        model.put('total', entities.size())

        respond model
    }

    Fornecedor getFornecedorLogado(){
        return crudService.getFornecedorLogado()
    }

    def exportar() {
        params.putAll(getParametros())
        List<String> colunas = params.colunas
        Map<String, String> filtros = colunas?.collectEntries({[it, params."$it"]}).findAll({it.value})

        FiltroApontamentosPendentes filtro = new FiltroApontamentosPendentes(params)
        filtro.paginacao.setOffset(0)
        filtro.paginacao.setMax(100000)

        List<ApontamentoPendenteDTO> apontamentosPendentes = apontamentoService.buscarApontamentosPendentes(getFornecedorLogado(), filtro)

        File file = relatorioService.gerarRelatorioApontamentosPendentesListagem(apontamentosPendentes, colunas, filtros, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

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
