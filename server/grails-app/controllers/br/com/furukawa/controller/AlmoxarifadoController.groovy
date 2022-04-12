package br.com.furukawa.controller

import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.AlmoxarifadoException
import br.com.furukawa.exceptions.GrupoRecursoException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.ItemPedidoReposicaoMaterial
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.ConfiguracaoGeral
import br.com.furukawa.model.PedidoReposicaoMaterial
import br.com.furukawa.service.AlmoxarifadoService
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.UserService
import grails.gorm.transactions.Transactional
import grails.converters.*
import org.hibernate.NullPrecedence
import org.hibernate.criterion.Order
import org.hibernate.sql.JoinType

import java.text.SimpleDateFormat

class AlmoxarifadoController {

    CrudService crudService
    AlmoxarifadoService almoxarifadoService
    UserService userService
    PesquisaService pesquisaService

    def query = {
        def codigoProduto =  "%${params.codigoProduto ?: ""}%"
        def ordemInterna = "%${params.ordemInterna ?: ""}%"
        def codigoMp = "%${params.codigoMp ?: ""}%"
        createAlias "fornecedor", "f"
        createAlias "ordemDeProducao", "op"

        if(params.codigoProduto) {
            ilike "codigoProduto", codigoProduto
        }

        if(params.grupoLinhas) {
            grupoLinhaProducao {
                ilike "nome", "%${params.grupoLinhas ?: ""}%"
            }
        }

        if(params.linhaProducao) {
            linhaDeProducao {
                ilike "nome", "%${params.linhaProducao ?: ""}%"
            }
        }
        if (params.codigoMp){
            createAlias "materiasPrimasSeparacao", "mp"
            ilike "mp.codigoProduto", codigoMp
        }
        if(params.ordemInterna) {
            sqlRestriction "this_.numero || '-' || ano LIKE '$ordemInterna'"
        }

        if (params.ordemProducao){
            if(params.ordemProducao.split("-").size() > 1) {
                ilike "op.numero", "%"+params.ordemProducao.split("-")[1]+"%"
            }

            if(params.ordemProducao.split("-").size() > 0) {
                ilike "f.prefixoProducao",  "%"+params.ordemProducao.split("-")[0]+"%"
            }

        }
        if (params.dataPrevisaoFinalizacaoInicial){
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy")
            Date inicial = sdf.parse(params.dataPrevisaoFinalizacaoInicial)
            Date finalData = sdf.parse(params.dataPrevisaoFinalizacaoFinal)
            between 'op.dataPrevisaoFinalizacao', inicial, finalData
        }

        eq "f.id", crudService.getFornecedorLogado()?.getId()
        eq "status", StatusOrdemFabricacao.EM_SEPARACAO
        order "ordem", "asc"
    }

    def index() {
        params.max = Math.min(params.int('max') ?: 12,100)

        def entities = OrdemDeFabricacao.createCriteria().list (query, max: params.max, offset: params.offset)
        Integer limiteSeparacaoEmHoras = ConfiguracaoGeral.getLimiteSeparacaoEmHoras()
        Fornecedor fornecedor = crudService.getFornecedorLogado()

        def model = [:]
        model.put("limiteSeparacaoEmHoras", limiteSeparacaoEmHoras)
        model.put("entities", entities)
        model.put("total", entities.totalCount)
        model.put("gruposLinhas", pesquisaService.getGruposLinhasDeProducao(fornecedor))
        model.put("linhasProducao", pesquisaService.getLinhasDeProducao(fornecedor))

        respond model
    }

    def liberarOrdemDeFabricacao(){
        params.putAll(getParametros())

        Long id = params.id
        OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.get(id)
        String justificativa = params.justificativa

        almoxarifadoService.liberarOrdemDeFabricacaoSeparacao(ordemDeFabricacao, userService.getUsuarioLogado(), justificativa)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, "almoxarifado.ordemLiberadaComSucesso.message", getLocale()) as JSON
    }

    def listarMateriais(){
        params.max = Math.min(params.int('max') ?: 12,100)
        println params
        def entities = almoxarifadoService.getPedidosReposicaoMaterial(crudService.getFornecedorLogado(),
                params.recurso as String, params.linhaProducao as String, params.codigoProduto as String, params.descricaoProduto as String, params.max as int, params.offset as int)
        int total = almoxarifadoService.getTotalPedidosReposicaoMaterial(crudService.getFornecedorLogado(),
                params.recurso as String, params.linhaProducao as String, params.codigoProduto as String, params.descricaoProduto as String)

        def model = [:]
        model.put("entities", entities)
        model.put("total", total)

        respond model
    }

    def almoxarifadoException(AlmoxarifadoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    Map getParametros() {
        def parameters = JSON.parse(request.getReader()) as Map
        return parameters
    }

    def getLocale(){
        return crudService.getLocale(request.getHeader("locale") ?: "pt-BR")
    }
}
