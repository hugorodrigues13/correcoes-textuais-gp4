package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.Parada
import br.com.furukawa.model.Recurso
import br.com.furukawa.service.LogOperacaoService
import br.com.furukawa.service.ParadaService
import br.com.furukawa.service.PesquisaService
import br.com.furukawa.utils.DateUtils
import grails.converters.JSON
import grails.gorm.transactions.Transactional

import java.text.SimpleDateFormat

class ParadasController extends CrudController {

    ParadaService paradaService
    PesquisaService pesquisaService

    ParadasController() {
        super(Parada)
    }


    def index() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        params.max = Math.min(params.int('max') ?: 10,100)
        String sort = params.sort ? params.sort == "dataInicioParada" ? "inicio" : params.sort == "dataFimParada" ? "fim" : params.sort == "recurso" ?'recurso' : "motivo" : "motivo"
        String order = params.order ?: 'ASC'
        Long recurso = (params.recurso ?: null) as Long
        Date dataInicioParadaIncial
        Date dataInicioParadaFinal
        Date dataFimParadaIncial
        Date dataFimParadaFinal
        Boolean ultimas24horas = params.ultimas24horas == 'true'
        if(ultimas24horas){
            Date data = new Date()
            dataFimParadaIncial = DateUtils.inicioDoDia(data)
            dataFimParadaFinal = DateUtils.fimDoDia(data)
        } else {
            if(params.dataInicioParadaInicial && params.dataInicioParadaFinal) {
                dataInicioParadaIncial = sdf.parse(params.dataInicioParadaInicial as String)
                dataInicioParadaFinal = sdf.parse(params.dataInicioParadaFinal as String)
            }
            if(params.dataFimParadaInicial && params.dataFimParadaFinal) {
                dataFimParadaIncial = sdf.parse(params.dataFimParadaInicial as String)
                dataFimParadaFinal = sdf.parse(params.dataFimParadaFinal as String)
            }
        }

        Fornecedor fornecedor = getFornecedorLogado()

        def entities = paradaService.getMotivo(fornecedor, recurso as Long, (params.max ?: 10) as Integer, (params.offset ?: 0) as Integer, dataInicioParadaIncial, dataInicioParadaFinal, dataFimParadaIncial, dataFimParadaFinal, sort, order )

        def model = [:]
        model.put('entities', entities)
        model.put('total', paradaService.totalMotivos(fornecedor, recurso as Long, dataInicioParadaIncial, dataInicioParadaFinal, dataFimParadaIncial, dataFimParadaFinal))
        model.put('listRecursos', Recurso.findAllByFornecedor(getFornecedorLogado()))

        respond model
    }

    def updateMotivoRequest() {
        try{
            params.putAll(getParametros())

            paradaService.atualizarMotivoParada(params.motivo as Long, params.id as Long)

            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
        } catch(Exception e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", crudService.getLocale()) as JSON
            e.printStackTrace()
        }
    }

    def getTodosMotivos() {
        List<String> motivos = pesquisaService.getMotivosDeParadaComId(getFornecedorLogado())

        def model = [:]
        model.put("motivos", motivos)

        respond model
    }

    def dividirParadas(){
        def model =  [:]
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
        params.putAll(getParametros())

        def paradas  = params.paradas as Map
        def paradaOrigem = paradas.original as Map
        def novaParada = paradas.novaParada as Map

        String justificativa = paradas.justificativa
        Map<String, Date> periodoParadaOrigem = [:]
        Map<String, Date> periodoNovaParada = [:]

        try {
            MotivoDeParada motivitoParadaOrigem = MotivoDeParada.get(paradaOrigem.motivo as Long)
            MotivoDeParada motivitoNovaParada = MotivoDeParada.get(novaParada.motivo as Long)

            periodoParadaOrigem.put("dataInicioParada", sdf.parse(paradaOrigem.dataInicioParada as String))
            periodoParadaOrigem.put("dataFimParada", sdf.parse(paradaOrigem.dataFimParada as String))

            periodoNovaParada.put("dataInicioParada", sdf.parse(novaParada.dataInicioParada as String))
            periodoNovaParada.put("dataFimParada", sdf.parse(novaParada.dataFimParada as String))

            paradaService.dividirParadas(paradaOrigem.id as Long, motivitoParadaOrigem, periodoParadaOrigem, motivitoNovaParada, periodoNovaParada, justificativa)

            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON

        } catch(Exception e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", crudService.getLocale()) as JSON
            e.printStackTrace()
        }
    }

}
