package br.com.furukawa.controller

import br.com.furukawa.dtos.DadosGraficoSeriaisApontadosUltimas24HorasDTO
import br.com.furukawa.dtos.StatusSeriaisGraficoDTO
import br.com.furukawa.dtos.filtros.FiltroDashboardProducao
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.HomeService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.SerialService

class DashboardProducaoController {

    SerialService serialService
    HomeService homeService
    PesquisaService pesquisaService
    CrudService crudService

    def index() {
        Fornecedor fornecedor = crudService.getFornecedorLogado()

        def model = [:]
        model.put("gruposLinhas", pesquisaService.getGruposLinhasDeProducao(fornecedor))
        model.put("linhasProducao", pesquisaService.getLinhasDeProducao(fornecedor))
        model.put("recursos", pesquisaService.getRecursos(fornecedor))
        model.put("gruposRecursos", pesquisaService.getGruposRecursos(fornecedor))
        model.put("turnos", pesquisaService.getTurnos(fornecedor))

        respond model
    }

    def buscarStatusDosSeriais() {
        def model = [:]
        Fornecedor fornecedor = crudService.getFornecedorLogado()
        FiltroDashboardProducao filtro = new FiltroDashboardProducao(params.periodoInicial as String, params.periodoFinal  as String, params.grupoLinhas  as String, params.linhaProducao  as String, params.grupoRecursos  as String, params.recurso  as String, params.turno as String)
        List<StatusSeriaisGraficoDTO> statusSeriais = serialService.getSeriaisDoDia(filtro, fornecedor)

        model.put("statusSeriais", statusSeriais)

        respond model
    }

    def buscarSeriaisDoDia() {
        def model = [:]
        Fornecedor fornecedor = crudService.getFornecedorLogado()
        FiltroDashboardProducao filtro = new FiltroDashboardProducao(params.periodoInicial as String, params.periodoFinal  as String, params.grupoLinhas  as String, params.linhaProducao  as String, params.grupoRecursos  as String, params.recurso  as String, params.turno as String)

        DadosGraficoSeriaisApontadosUltimas24HorasDTO dadosSeriais = serialService.getSeriaisApontadosNoUltimoDia(fornecedor, filtro)

        model.put("dadosSeriais", dadosSeriais)

        respond model
    }

    def buscarIndicadores() {
        def model = [:]
        Fornecedor fornecedor = crudService.getFornecedorLogado()
        Integer lotesAbertos = homeService.getLotesByLocal(fornecedor, StatusLote.ABERTO)
        Integer lotesFechados = homeService.getLotesByLocal(fornecedor, StatusLote.FECHADO)

        model.put("lotesAbertos", lotesAbertos)
        model.put("lotesFechados", lotesFechados)

        respond model
    }
}
