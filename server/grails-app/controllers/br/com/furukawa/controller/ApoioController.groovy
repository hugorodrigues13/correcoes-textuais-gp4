package br.com.furukawa.controller

import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.ProcessoLinhaDeProducao
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.service.ApoioService
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.SerialService
import grails.converters.JSON
import grails.gorm.transactions.Transactional

class ApoioController {

    ApoioService apoioService
    CrudService crudService
    SerialService serialService

    def index(){
        List<GrupoLinhaDeProducao> entities = GrupoLinhaDeProducao.findAllByFornecedor(crudService.getFornecedorLogado())
        entities.removeIf({ grupo -> apoioService.seriaisByGrupo(grupo).isEmpty() })
        def model = [:]
        model.put("entities", entities)
        respond model
    }

    def grupoSelecionado(){
        GrupoLinhaDeProducao entity = GrupoLinhaDeProducao.get(params.id)
        List<SerialFabricacao> serials = apoioService.seriaisByGrupo(entity)

        def model = [:]
        model.put("entity", entity)
        model.put("serials", serials)
        respond model
    }

    def serialSelecionado(){

        SerialFabricacao serial = SerialFabricacao.get(params.id)
        Apontamento apontamento = Apontamento.findBySerial(serial)

        def model = [:]
        model.put("apontamento", apontamento)

        respond model
    }


    @Transactional
    def redirecionarSerial() {

        try {
            params.putAll(getParametros())

            if(params.id) {
                SerialFabricacao serial = SerialFabricacao.get(params.id)

                Apontamento apontamento = Apontamento.findBySerial(serial)
                apontamento.processoAtual = ProcessoLinhaDeProducao.get(params.redirecionarAoProcesso)
                apontamento.serial.statusSerial = StatusSerialFabricacao.APONTAMENTO_INICIADO

                apoioService.salvar(apontamento)

                render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
            }else{
                render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
            }
        }catch(e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", getLocale()) as JSON
            e.printStackTrace()
        }
    }


    @Transactional
    def descartarSerial() {

        try {
            params.putAll(getParametros())

            if(params.id) {
                SerialFabricacao serial = SerialFabricacao.get(params.id)

                apoioService.sucatearSerial(serial)

                render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
            }else{
                render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
            }
        }catch(e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", getLocale()) as JSON
            e.printStackTrace()
        }
    }

    /* Métodos Auxiliares */

    Map getParametros() {
        def parameters = JSON.parse(request.getReader()) as Map
        return parameters
    }

    Fornecedor getFornecedorLogado(){
        return crudService.getFornecedorLogado()
    }

    def getLocale(){
        def lang = request.getHeader("locale") ?: "pt-BR"
        return crudService.getLocale(lang)
    }

}