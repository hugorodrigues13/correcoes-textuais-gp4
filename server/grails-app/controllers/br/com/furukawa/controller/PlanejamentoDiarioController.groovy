package br.com.furukawa.controller

import br.com.furukawa.enums.DiaDaSemana
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.enums.DiaDaSemana
import br.com.furukawa.exceptions.GrupoLinhaProducaoException
import br.com.furukawa.exceptions.PlanejamentoDiarioException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.PlanejamentoDiario
import br.com.furukawa.model.TempoApontamentoProduto
import br.com.furukawa.model.Turno
import br.com.furukawa.model.TurnoDuracao
import br.com.furukawa.service.LinhaDeProducaoService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.service.PlanejamentoDiarioService
import br.com.furukawa.service.RelatorioService
import br.com.furukawa.service.UserService
import grails.converters.JSON

class PlanejamentoDiarioController extends CrudController {

    PlanejamentoDiarioService planejamentoDiarioService
    PesquisaService pesquisaService
    RelatorioService relatorioService
    UserService userService

    LinhaDeProducaoService linhaDeProducaoService

    PlanejamentoDiarioController() {
        super(PlanejamentoDiario)
    }

    def query = {
        if (params.dataInicial){
            between "data", PlanejamentoDiario.SDF.parse(params.dataInicial), PlanejamentoDiario.SDF.parse(params.dataFinal)
        }
        if (params.linhaDeProducao){
            linhaDeProducao {
                ilike 'nome', "%${params.linhaDeProducao}%"
            }
        }
        if (params.grupoLinhaDeProducao){
            grupoLinhaDeProducao {
                ilike 'nome', "%${params.grupoLinhaDeProducao}%"
            }
        }
        if (params.turno){
            turno {
                ilike 'nome', "%${params.turno}%"
            }
        }
        if (params.quantidadePessoasPresentes){
            eq 'quantidadePessoasPresentes', params.long('quantidadePessoasPresentes')
        }
        if (params.quantidadePlanejadaPecas){
            eq 'quantidadePlanejadaPecas', params.long('quantidadePlanejadaPecas')
        }
        if (params.quantidadePlanejadaPessoas){
            eq 'quantidadePlanejadaPessoas', params.long('quantidadePlanejadaPessoas')
        }

        linhaDeProducao {
            eq 'fornecedor', getFornecedorLogado()
        }

        if (params.sort){
            order(params.sort, params.order)
        } else {
            order 'data', 'asc'
        }

    }

    def index() {
        params.max = Math.min(params.int('max') ?: 10,100)

        def entities = PlanejamentoDiario.createCriteria()
                .list(query, max: params.max, offset: params.offset)

        def model = [:]
        model.put('entities', entities)
        model.put('total', entities.totalCount)

        respond model
    }

    @Override
    def getModelPadrao() {
        Fornecedor fornecedor = getFornecedorLogado()

        def model = [:]
        model.put("linhasProducao", linhaDeProducaoService.listaUltimaVersao(null, null, fornecedor, null, 1000, 0, null, null))
        model.put("gruposLinhaProducao", GrupoLinhaDeProducao.findAllByFornecedorAndIsAtivo(fornecedor, true))
        model.put("turnos", Turno.findAllByFornecedor(fornecedor))
        model.put("dias", DiaDaSemana.values() as List)

        return model
    }

    @Override
    def getInstanceEntity() {
        params.data = params.data ? PlanejamentoDiario.SDF.parse(params.data as String) : null
        return super.getInstanceEntity()
    }

    @Override
    def beforeSave(Object entityInstance) {
        if(!entityInstance.id) {
            entityInstance.dataCriacao = new Date()
            entityInstance.usuarioCriacao = userService.getUsuarioLogado()?.username
        }

        entityInstance.dataAtualizacao = new Date()
        entityInstance.usuarioAlteracao = userService.getUsuarioLogado()?.username
    }

    @Override
    def save() {
        params.putAll(getParametros())
        println(params)

        def instance = getInstanceEntity()


        if (!params.multiplosDiasInicial){
            if (!instance.getTurnoDuracaoDoDia()){
                respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "planejamentoDiario.nenhumCriado.message", getLocale())
                return
            }
        }

        beforeSave(instance)

        if (!params.id && params.multiplosDiasInicial){
            List<PlanejamentoDiario> planejamentosSalvos = planejamentoDiarioService.criarMultiplosPlanejamentos(instance as PlanejamentoDiario, PlanejamentoDiario.SDF.parse(params.multiplosDiasInicial as String), PlanejamentoDiario.SDF.parse(params.multiplosDiasFinal as String))
            if(planejamentosSalvos.size() > 0){
                afterSave(instance)
                return
            } else {
                respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "planejamentoDiario.nenhumCriado.message", getLocale())
                return
            }
        }

        if (instance.errors.allErrors.size() > 0 || !instance.validate()) {
            print instance.errors
            render status: 422, crudService.montaListaDeErrors(instance.errors.allErrors, getLocale()) as JSON
        } else {
            crudService.salvar(instance)
            afterSave(instance)
        }
    }

    @Override
    def delete() {
        if (params.id?.contains(",")){
            List<Long> ids = params.id.split(",").collect({it.toLong()})
            List<PlanejamentoDiario> entities = PlanejamentoDiario.getAll(ids)
            planejamentoDiarioService.excluir(entities)
            respond crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.deleted.message', getLocale())
            return
        }
        return super.delete()
    }

    def planejamentoException(PlanejamentoDiarioException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }


    def exportar(){
        params.putAll(getParametros())

        List<String> colunas = params.colunas
        Map<String, String> filtros = colunas.collectEntries({[it, params."$it"]}).findAll({it.value})
        if (params.dataInicial) filtros.put("data", params.dataInicial + " - " + params.dataFinal)

        List<PlanejamentoDiario> entities = PlanejamentoDiario.createCriteria().list(query, max: 100000, offset: 0)

        File file = relatorioService.gerarRelatorioPlanejamentoDiario(entities, colunas, filtros, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

}
