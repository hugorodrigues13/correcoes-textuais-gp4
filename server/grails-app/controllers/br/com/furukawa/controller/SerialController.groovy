package br.com.furukawa.controller


import br.com.furukawa.dtos.filtros.FiltroSerial
import br.com.furukawa.dtos.HistoricoApontamentoDTO
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaSeriaisOrdemDeFabricacao
import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.dtos.SerialFabricacaoDTO
import br.com.furukawa.enums.StatusImpressaoEtiqueta
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusRomaneio
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.enums.TipoImpressao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.EstornoApontamentoException
import br.com.furukawa.exceptions.SerialException
import br.com.furukawa.model.HistoricoApontamento
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.service.ApoioService
import br.com.furukawa.service.ImpressoraService
import br.com.furukawa.service.RelatorioService
import br.com.furukawa.service.SerialService
import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService

class SerialController extends CrudController {

    SpringSecurityService springSecurityService
    SerialService serialService
    ImpressoraService impressoraService
    RelatorioService relatorioService
    ApoioService apoioService

    SerialController() {
        super(SerialFabricacao)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)

        FiltroSerial filtro = new FiltroSerial(params)
        List<SerialFabricacaoDTO> list = serialService.getSeriais(getFornecedorLogado(), filtro)
        Long total = serialService.getTotalSerialFabricacaoDTO(getFornecedorLogado(), filtro)

        def model = [:]
        model.put("entities", list)
        model.put("total", total)
        model.put("statusList", Arrays.asList(StatusSerialFabricacao.values()))
        model.put("statusOrdemFabricacaoList", StatusOrdemFabricacao.values() as List)
        model.put("statusLoteList", StatusLote.values() as List)
        model.put("statusRomaneioList", StatusRomaneio.values() as List)
        model.put("statusWipList", StatusOrdemDeProducaoWIP.values() as List)
        model.put("statusImpressaoEtiqueta", StatusImpressaoEtiqueta.values() as List)

        respond model
    }

    def buscaValoresIniciais() {
        def model = [:]
        model.put("statusList", Arrays.asList(StatusSerialFabricacao.values()))
        model.put("statusOrdemFabricacaoList", StatusOrdemFabricacao.values() as List)
        model.put("statusRomaneioList", StatusRomaneio.values() as List)
        model.put("statusWipList", StatusOrdemDeProducaoWIP.values() as List)
        model.put("statusLoteList", StatusLote.values() as List)
        model.put("statusImpressaoEtiqueta", StatusImpressaoEtiqueta.values() as List)

        respond model
    }

    def gerarEtiqueta() {
        params.putAll(getParametros())
        List<String> seriais = params.seriais
        def model = [:]

        if (params.opcaoSelecionada == "pdf"){
            List<RetornoImpressao> etiquetas = serialService.gerarEtiqueta(seriais)
            model.put("etiquetas", etiquetas)
        } else if (params.opcaoSelecionada == "impressora"){
            Impressora impressora = Impressora.get(params.long('impressoraId'))
            List<RetornoImpressao> etiquetas = serialService.reimprimirSeriais(impressora, seriais, null)
            model.put("impressora", impressora)
            model.put("etiquetas", etiquetas)
        }

        respond model
    }

    def imprimir(){
        params.putAll(getParametros())
        println params
        def model = [:]
        String[] of = params.ordemFabricacao.split("-")
        List<RetornoImpressao> retornoEtiquetas = new ArrayList<>()
        OrdemDeFabricacao ordemFabricacao = OrdemDeFabricacao.findByNumeroAndAnoAndFornecedor(of[0], of[1], getFornecedorLogado())
        List<ImpressaoEtiquetaSeriaisOrdemDeFabricacao> retornos = serialService.montaImpressaoEtiquetaDTO(ordemFabricacao, params.seriais as List<String>)
        Impressora impressora = null

        retornos.each {retorno ->
            String jsonBody = retorno.getJsonStringEtiqueta()

            if (params.opcaoSelecionada == "pdf"){
                retornoEtiquetas.add(impressoraService.gerarEtiqueta(jsonBody))
            } else if (params.opcaoSelecionada == "impressora"){
                impressora = Impressora.get(params.long('impressoraId'))
                if(impressora.tipoImpressao == TipoImpressao.AGENTE) {
                    retornoEtiquetas.add(impressoraService.gerarEtiqueta(jsonBody))
                } else {
                    retornoEtiquetas.add(impressoraService.imprimirEtiqueta(impressora, jsonBody, ""))
                }
            }
        }

        model.put("etiquetas", retornoEtiquetas)
        model.put("impressora", impressora)

        respond model
    }

    def getHistoricosSerial(){
        Long id = params.long('id')
        SerialFabricacao serial  = SerialFabricacao.get(id)
        def model = [:]

        if(serial.isApontamentoPorOP()) {
            model.put("apontamentoOF", serial.getApontamentoOF())
        } else {
            List<HistoricoApontamentoDTO> historicos = serialService.getHistoricosDoSerial(id)
            model.put("historico", historicos)
            model.put("podeDesfazerTodos", serial.caixaImpressao == null)
            if(serial.isSucateado()){
                model.put("sucateado", serial.isSucateado())
                model.put("dataSucateamento", serial.getDataSucateamentoFormatado())
                model.put("codigoGerado", SerialFabricacao.findByCodigoOrigem(serial.getCodigoCompleto())?.codigoCompleto)
            }
        }

        respond model
    }

    def estornarApontamento(){
        params.putAll(getParametros())
        println params
        SerialFabricacao serial = SerialFabricacao.get(params.serial as Long)
        HistoricoApontamento historicoApontamento = HistoricoApontamento.get(params.apontamento)
        String justificativa = params.justificativa
        if(serial.isApontamentoPorOP()) {
            serialService.estornarApontamentoOF(serial, justificativa)
        } else if(serial.isApontamentoFinalizado()) {
            if(!historicoApontamento) {
                render status: 422, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'estorno.finalizadoSemHistorico.message', getLocale()) as JSON
                return
            }


            serialService.estornarCaixa(serial, justificativa)
        } else {
            serialService.estornarApontamento(serial, historicoApontamento, justificativa)
        }

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def exportar(){
        params.putAll(getParametros())

        List<String> colunas = params.colunas
        Map<String, String> filtros = colunas.collectEntries({[it, params."$it"]}).findAll({it.value})

        FiltroSerial filtro = new FiltroSerial(params)
        filtro.paginacao.setOffset(0)
        filtro.paginacao.setMax(100000)

        List<SerialFabricacaoDTO> entities = serialService.getSeriais(getFornecedorLogado(), filtro)

        File file = relatorioService.gerarRelatorioSeriaisListagem(entities, colunas, filtros, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

    def sucatear() {
        params.putAll(getParametros())
        SerialFabricacao serial = SerialFabricacao.get(params.long("id"))
        if(!serial.isLoteFechado()) {
            throw new SerialException("serial.sucatear.loteFechado.error")
        } else if(serial.isSucateado()) {
            throw new SerialException("serial.anteriormenteSucateado.error")
        } else {
            apoioService.sucatearSerial(serial)

            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'serial.sucatear.success', getLocale()) as JSON
        }
    }

    def estornoApontamentoException(EstornoApontamentoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def serialException(SerialException exception){
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }
}

