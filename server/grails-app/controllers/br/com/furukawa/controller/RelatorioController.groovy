package br.com.furukawa.controller

import br.com.furukawa.dtos.filtros.FiltroRelatorioSerial
import br.com.furukawa.dtos.filtros.FiltroSerial
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.RelatorioService
import grails.converters.JSON

class RelatorioController {

    RelatorioService relatorioService
    CrudService crudService
    PesquisaService pesquisaService

    def getDadosRelatorioSerial() {
        Fornecedor fornecedor = getFornecedorLogado()
        Map model = [:]

        model.put("statusOrdemFabricacao", StatusOrdemFabricacao.values() as List)
        model.put("linhasProducao", pesquisaService.getLinhasDeProducao(fornecedor))
        model.put("gruposLinhas", pesquisaService.getGruposLinhasDeProducao(fornecedor))

        respond model
    }

    def pesquisarDadosRelatorioSerial(){
        Fornecedor fornecedor = getFornecedorLogado()
        def model = [:]

        if (params.lote){
            model.put("lotes", pesquisaService.getLotes(fornecedor, params.lote))
        }
        if (params.codigoProduto){
            model.put("codigosProduto", pesquisaService.getCodigosProdutos(fornecedor, params.codigoProduto))
        }
        if (params.ordemFabricacao){
            model.put("ordensFabricacao", pesquisaService.getOrdensFabricacao(fornecedor, params.ordemFabricacao))
        }
        if (params.ordemProducao){
            model.put("ordensProducao", pesquisaService.getOrdensProducao(fornecedor, params.ordemProducao))
        }

        respond model
    }

    def relatorioSerial() {
        FiltroRelatorioSerial filtro = new FiltroRelatorioSerial(params)
        filtro.paginacao.setOffset(0)
        filtro.paginacao.setMax(100000)

        File file = relatorioService.gerarRelatorioSerial(filtro, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

    def relatorioException(RelatorioException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
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

}
