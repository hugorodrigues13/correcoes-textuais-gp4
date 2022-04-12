package br.com.furukawa.controller

import br.com.furukawa.dtos.filtros.FiltroAsaichi
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.PlanejamentoDiario
import br.com.furukawa.service.AsaichiService
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.PesquisaService

import java.text.SimpleDateFormat

class AsaichiController {

    AsaichiService asaichiService
    CrudService crudService
    PesquisaService pesquisaService

    def index() {
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro

        def model = [:]

        String data = new SimpleDateFormat("dd/MM/yyyy").format(filtro.data ?: new Date())
        model.put("linhasProducao", filtroPadrao.linhasProducao)
        model.put("observacoes", pesquisaService.getObservacoesDiarias(data, filtro.linhaProducao, getFornecedorLogado()))
        model.put("turnos", pesquisaService.getTurnos(data, getFornecedorLogado()))
        model.put("conectores", pesquisaService.getConectores())

        respond model
    }

    Map montaFiltroPadrao() {
        Fornecedor fornecedor = getFornecedorLogado()
        FiltroAsaichi filtro = new FiltroAsaichi(params)
        String data = new SimpleDateFormat("dd/MM/yyyy").format(filtro.data ?: new Date())
        List<String> linhasProducao = asaichiService.getLinhasDeProducao(data, fornecedor)
        filtro.linhaProducao = filtro.linhaProducao ?: !linhasProducao.isEmpty() ? linhasProducao.first() : null
        filtro.idFornecedor = fornecedor?.id

        return [filtro: filtro, linhasProducao: linhasProducao?.sort(), fornecedor: fornecedor]
    }

    def tabelaProducao() {
        def model = [:]
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro
        model.put("tabelaProducao", asaichiService.getTabelaProducao(filtro))

        respond model
    }

    def tabelaDefeitos() {
        def model = [:]
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro
        model.put("tabelaDefeitos", asaichiService.getTabelaDefeitos(filtro))

        respond model
    }

    def tabelaProdutividade() {
        def model = [:]
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro
        model.put("tabelaProdutividade", asaichiService.getTabelaProdutividade(filtro))

        respond model
    }

    def producaoDiaria() {
        def model = [:]
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro
        model.put("producaoDiaria", asaichiService.getGraficoProducaoDiaria(filtro))

        respond model
    }

    def producaoSemanal() {
        def model = [:]
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro
        model.put("producaoSemanal", asaichiService.getGraficoProducaoSemanal(filtro))

        respond model
    }

    def producaoMensal() {
        def model = [:]
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro
        model.put("producaoMensal", asaichiService.getGraficoProducaoMensal(filtro))

        respond model
    }

    def graficoDefeitos() {
        def model = [:]
        Map filtroPadrao = montaFiltroPadrao()
        FiltroAsaichi filtro = filtroPadrao.filtro
        model.put("graficoDefeitos", asaichiService.getGraficoDefeitos(filtro))

        respond model
    }

    // boilerplate abaixo

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
