package br.com.furukawa.controller

import br.com.furukawa.dtos.ProducaoMensalDTO
import br.com.furukawa.dtos.filtros.FiltroProducao
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.RelatorioService
import grails.converters.JSON

class RelatorioProducaoController {
    CrudService crudService
    PesquisaService pesquisaService
    RelatorioService relatorioService

    def pegarDadosIniciaisRelatorio(){
        Fornecedor fornecedor = getFornecedorLogado()
        def model = [:]
        model.put("gruposLinhas", pesquisaService.getGruposLinhasDeProducao(fornecedor))
        respond model
    }

    def exportar() {
        List<String> colunas = ["codigoProduto", "grupoLinha", "periodo", "produzido", "conectores"]
        Map<String, String> filtros = colunas.collectEntries({[it, params."$it"]}).findAll({it.value})

        FiltroProducao filtro = new FiltroProducao(params)
        List<ProducaoMensalDTO> entites = pesquisaService.getProducaoMental(filtro, getFornecedorLogado())

        File file = relatorioService.gerarRelatorioProducaoMensal(entites, filtros, colunas, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

    protected String getLingua(){
        return request.getHeader("locale") ?: "pt-BR"
    }

    def getLocale(){
        def lang = getLingua()
        return crudService.getLocale(lang)
    }

    Fornecedor getFornecedorLogado(){
        return crudService.getFornecedorLogado()
    }

    Map getParametros() {
        def parameters = JSON.parse(request.getReader()) as Map
        return parameters
    }

}
