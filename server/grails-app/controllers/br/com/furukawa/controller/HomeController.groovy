package br.com.furukawa.controller

import br.com.furukawa.dtos.ProgramacaoOrdemDeProducaoDTO
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.HomeService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.SequenciamentoService
import br.com.furukawa.service.UserService
import br.com.furukawa.service.SerialService

class HomeController {

    SequenciamentoService sequenciamentoService
    CrudService crudService
    UserService userService
    SerialService serialService
    HomeService homeService
    PesquisaService pesquisaService

    def dashboardCadastro() {
        respond true
    }

    def dashboardProgramacao() {
        Fornecedor fornecedor = crudService.getFornecedorLogado()
        Long idGrupoDeLinhas = params.grupoLinhas ? params.grupoLinhas as Long : null

        ProgramacaoOrdemDeProducaoDTO ordensProgramadas = homeService.getProgramacaoOrdensDeProducao(idGrupoDeLinhas, fornecedor)

        def model = [:]
        model.put("ordensProgramadas", ordensProgramadas)
        model.put("totalOPAtraso", homeService.totalBuscaOrdensDeProducaoAtrasadas(idGrupoDeLinhas))
        model.put("opsNaoAssociadas", sequenciamentoService.getTotalOrdensDeProducaoProdutosSemGrupoAssociado(fornecedor, null, null))
        model.put("opsComErros", homeService.getOpsComErros(idGrupoDeLinhas))
        model.put("recebimentosErro", homeService.getRecebimentosErro(fornecedor))
        model.put("listGrupoLinhas", GrupoLinhaDeProducao.findAllByFornecedor(fornecedor))

        respond model
    }

    def dashboardRelatorios() {
        respond true
    }

    def dashboardAuditoria() {
        respond true
    }

    def dashboardConfiguracoes() {
        respond true
    }

    def dashboardSeguranca() {
        respond true
    }

}
