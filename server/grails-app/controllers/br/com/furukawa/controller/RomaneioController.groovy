package br.com.furukawa.controller

import br.com.furukawa.dtos.RomaneioListaDTO
import br.com.furukawa.dtos.filtros.FiltroRomaneio
import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.dtos.RomaneioEBSDTO
import br.com.furukawa.dtos.RomaneioEntitiesTotalDTO
import br.com.furukawa.enums.StatusHistoricoRomaneio
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.StatusRomaneio
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.exceptions.RomaneioException
import br.com.furukawa.model.Lote
import br.com.furukawa.model.HistoricoRomaneio
import br.com.furukawa.model.Romaneio
import br.com.furukawa.service.ImpressoraService
import br.com.furukawa.service.MensagemService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.RelatorioService
import br.com.furukawa.service.RomaneioService
import br.com.furukawa.service.UserService
import br.com.furukawa.utils.OrderBySqlFormula
import grails.converters.JSON
import org.hibernate.sql.JoinType

import java.text.DateFormat
import java.text.SimpleDateFormat

class RomaneioController extends CrudController {

    ImpressoraService impressoraService
    RomaneioService romaneioService
    UserService userService
    OracleService oracleService
    RelatorioService relatorioService
    MensagemService mensagemService

    RomaneioController() {
        super(Romaneio)
    }

    @Override
    Object index() {

        Map model = [:]

        FiltroRomaneio filter = FiltroRomaneio.build(params) as FiltroRomaneio

        RomaneioEntitiesTotalDTO retorno = romaneioService.buscarRomaneiosPorFiltros(filter)

        model.put("entities", retorno.entities)
        model.put("total", retorno.total)
        model.put("statusRomaneio", Arrays.asList(StatusRomaneio.values()))

        respond model
    }

    def prepareEdit(){
        def model = [:]
        Romaneio romaneio = Romaneio.get(params.long('id'))

        model.put('entity', romaneio)
        respond model
    }

    def cancelarRomaneio(){
        params.putAll(getParametros())
        Romaneio romaneio = Romaneio.get(params.long('id'))

        if( romaneio.podeSerCancelado() ) {
            romaneio.setStatus(StatusRomaneio.CANCELADO)
            romaneio.getLotes().each {
                it.setStatusLote(StatusLote.FECHADO)
                crudService.salvar(it)
            }
            romaneio.setLotes(new HashSet<>())
            romaneio.addToHistorico(new HistoricoRomaneio(data: new Date(), status: StatusHistoricoRomaneio.CANCELADO, usuario: userService.getUsuarioLogado()?.fullname))
            crudService.salvar(romaneio)

            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
        } else {
            render status: 422, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'romaneio.erroCancelar.message', getLocale()) as JSON
        }
    }

    def abrirRomaneio(){
        params.putAll(getParametros())
        Romaneio romaneio = Romaneio.get(params.long('id'))

        romaneio.setStatus(StatusRomaneio.ABERTO)
        romaneio.addToHistorico(new HistoricoRomaneio(data: new Date(), status: StatusHistoricoRomaneio.ABERTO, usuario: userService.getUsuarioLogado()?.fullname))
        crudService.salvar(romaneio)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def mudarVolume(){
        params.putAll(getParametros())
        Romaneio romaneio = Romaneio.get(params.long('id'))
        int volume = params.int('volume')

        romaneio.setVolume(volume)
        crudService.salvar(romaneio)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def lotesQuery = {
        or {
            eq "statusLote", StatusLote.FECHADO
            if (params.inclusos) {
                List<Long> idsSelecionados = params.inclusos.split(",").collect({ Long.parseLong(it) })
                'in' 'id', idsSelecionados
            }
        }
        if (params.lote){
            tLike("numero_lote||semana||ano", "%" + params.lote + "%", delegate)
        }
        if (params.codigo){
            tLike('codigo_produto', '%' + params.codigo + '%', delegate)
        }
        if (params.descricao){
            tLike('descricao_produto', '%' + params.descricao + '%', delegate)
        }
        if (params.inclusos) {
            order OrderBySqlFormula.from("CASE WHEN this_.id IN (${params.inclusos}) THEN 0 ELSE 1 END")
        }

        createAlias('grupoLinhaDeProducao', 'g', JoinType.LEFT_OUTER_JOIN)
        or {
            eq("g.fornecedor", getFornecedorLogado())
        }
    }

    def listarLotes(){
        def model = [:]

        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = Lote.createCriteria()
        def entities = criteria.list(lotesQuery, max: params.max, offset: params.offset)

        model.put('entities', entities)
        model.put("total", entities.totalCount)

        respond model
    }

    def editarLotes(){
        params.putAll(getParametros())
        Romaneio romaneio = Romaneio.get(params.long('id'))

        Set<Lote> selecionados = Lote.getAll(params.selecionados)
        Set<Lote> deselecionados = romaneio.getLotes() - selecionados
        Set<Lote> indisponiveis = []
        Set<Lote> disponiveis = []

        List<RomaneioEBSDTO> dados = romaneioService.getDadosParaRomaneioFromLotes(selecionados*.id*.toInteger(), getOrganizacaoLogada())
        List<RomaneioEBSDTO> dadosValidos = dados.findAll({it.valido})
        Set<Lote> lotesValidos = dadosValidos*.lote.flatten().unique()
        Set<Lote> lotesInvalidos = dados.findAll({!it.valido})*.lote.flatten().unique()

        if (!lotesInvalidos.isEmpty()){
            render status: 400, crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE,
                    "romaneio.editarLotes.lotesInvalidos",
                    [lotesInvalidos*.getCodigoLote().join(", ")] as Object[] ,
                    getLocale()) as JSON
            return
        }

        deselecionados.each {
            it.setStatusLote(StatusLote.FECHADO)
            crudService.salvar(it)
        }

        selecionados.each {
            if (!lotesValidos.contains(it)
                    || (it.statusLote == StatusLote.ROMANEIO && !romaneio.getLotes().contains(it))){
                indisponiveis.add(it)
            } else {
                disponiveis.add(it)
                it.setStatusLote(StatusLote.ROMANEIO)
                crudService.salvar(it)
            }
        }
        romaneio.servicos.clear()
        crudService.salvar(romaneio)
        romaneioService.inserirDados(romaneio, dadosValidos)
        romaneio.setLotes(disponiveis)
        crudService.salvar(romaneio)

        def messages = []
        messages.add(crudService.montaMensagem(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', null))
        if (indisponiveis){
            String lotesIndisponiveis = indisponiveis*.getCodigoLote().join(", ")
            messages.add(crudService.montaMensagem(TipoMensagem.ERROR_TYPE, 'romaneio.editarLotes.indisponiveis', [lotesIndisponiveis] as Object[]))
        }
        render status: 200, crudService.montaListaDeMensagens(messages, getLocale()) as JSON
    }

    def getHistorico() {
        def model = [:]
        Romaneio romaneio = Romaneio.get(params.long('id'))
        model.put("listHistorico", romaneio.historico.sort({it.data}))
        respond model
    }

    def exportarRomaneio(){
        Romaneio romaneio = Romaneio.get(params.long('id'))
        RetornoImpressao retornoImpressaoDTO = impressoraService.gerarEtiquetaRomaneio(romaneio)
        if (!retornoImpressaoDTO.success){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", getLocale()) as JSON
            return
        }
        render retornoImpressaoDTO.base64Etiqueta
    }

    def exportarXlsx() {
        Romaneio romaneio = Romaneio.get(params.long('id'))

        List<String> colunas = ['codigo',
                                'descricao',
                                'unidade',
                                'quantidade',
                                'valorUnitario',
                                'valorTotal',
                                'ordemDeProducao',
                                'pedidoDeCompra',
                                'contrato',
                                'release',
                                'linha']

        File file = romaneioService.exportaRomaneioParaXlsx(romaneio, getLocale(), colunas);
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

    def gerarNff(){
        params.putAll(getParametros())
        Romaneio romaneio = Romaneio.get(params.long('id'))

        romaneio.setStatus(StatusRomaneio.AGUARDANDO_NFF)
        romaneioService.exportaRomaneioParaEBS(romaneio)
        romaneio.addToHistorico(new HistoricoRomaneio(data: new Date(), status: StatusHistoricoRomaneio.INTEGRACAO, usuario: userService.getUsuarioLogado()?.fullname))
        crudService.salvar(romaneio)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def verificaStatusIntegracao() {
        params.putAll(getParametros())
        romaneioService.verificarStatusIntegracaoRomaneioDoCodigo(params.romaneio as String)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def exportarListagem(){
        params.putAll(getParametros())

        List<String> colunas = params.colunas
        List<String> filtrosParams = params.filtros

        FiltroRomaneio filter = FiltroRomaneio.build(params, true) as FiltroRomaneio
        Map<String, String> filtros = filtrosParams.collectEntries({[it, params."$it"]}).findAll({it.value})

        if(params.dataInicial) {
            DateFormat formatador = new SimpleDateFormat("dd/MM/yyyy")
            filtros.put("emissao", "${formatador.format(new Date(params.dataInicial as Long))} - ${formatador.format(new Date(params.dataFinal as Long))}")
        }

        if(params.ultimas24horas) {
            filtros.put("ultimas24horas", mensagemService.getMensagem("default.sim"))
        }

        filter.setOffset("0")
        filter.setMax("100000")
        List<RomaneioListaDTO> entities = romaneioService.buscarRomaneiosPorFiltros(filter).getEntities()

        File file = relatorioService.gerarRelatorioRomaneio(entities, colunas, filtros, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

    def editarNfs(){
        params.putAll(getParametros())
        Romaneio romaneio = Romaneio.get(params.long('id'))
        String nfEncomenda = params.nfEncomenda
        String nfRetorno = params.nfRetorno

        romaneioService.editarNotasFiscais(romaneio, nfEncomenda, nfRetorno)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON

    }

    def relatorioException(RelatorioException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def romaneioException(RomaneioException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

}
