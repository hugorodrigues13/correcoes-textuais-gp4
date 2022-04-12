package br.com.furukawa.controller

import br.com.furukawa.dtos.FaturamentoDTO
import br.com.furukawa.dtos.RomaneioEBSDTO
import br.com.furukawa.dtos.SerialFabricacaoDTO
import br.com.furukawa.dtos.filtros.FiltroFaturamento
import br.com.furukawa.dtos.filtros.FiltroSerial
import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.FaturamentoException
import br.com.furukawa.exceptions.LoteException
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.ImpressaoApontamentoCaixa
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.Lote
import br.com.furukawa.service.LoteService
import br.com.furukawa.service.RelatorioService
import br.com.furukawa.service.RomaneioService
import br.com.furukawa.service.UserService
import grails.converters.JSON
import org.hibernate.sql.JoinType

class FaturamentoController extends CrudController {

    LoteService loteService
    RomaneioService romaneioService
    RelatorioService relatorioService
    UserService userService

    FaturamentoController() {
        super(Lote)
    }

    def query = {
        createAlias('grupoLinhaDeProducao', 'g', JoinType.LEFT_OUTER_JOIN)

        if (params.codigoProduto) {
            ilike("codigoProduto", "%${params.codigoProduto}%")
        }
        if (params.descricao) {
            ilike("descricaoProduto", "%${params.descricao.toString().toUpperCase()}%")
        }
        if (params.local) {
            ilike("g.nome", "%${params.local}%")
        }
        if (params.lote) {
            tLike("numero_lote||semana||ano", "%" + params.lote + "%", delegate)
        }
        if (params.statusLote && params.statusLote != "TODOS") {
            eq("statusLote", StatusLote.valueOf(params.statusLote))
        }
        if (params.ordemFabricacao){
            ordemDeFabricacao {
                sqlRestriction "ordemdefab2_.numero || '-' || ordemdefab2_.ano LIKE '%${params.ordemFabricacao}%'"
            }
        }
        eq("g.fornecedor", getFornecedorLogado())
        if (params.sort) {
            order(params.sort, params.order)
        } else {
            order "ano", "asc"
            order "semana", "asc"
            order "numeroLote", "asc"
        }

        ne("statusLote", StatusLote.ROMANEIO)
        ne("statusLote", StatusLote.CONCLUIDO)
    }

    @Override
    Object index() {
        def model = [:]

        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = Lote.createCriteria()

        FiltroFaturamento filtro = new FiltroFaturamento(params)
        Fornecedor fornecedor = getFornecedorLogado()

        List<FaturamentoDTO> entities = loteService.getFaturamentos(filtro, fornecedor)
        Integer total = loteService.getTotalFaturamentos(filtro, fornecedor)

        model.put("entities", entities)
        model.put("total", total)
        model.put("desativarRomaneio", getFornecedorLogado().isFurukawaEletricLatamSa())

        respond model
    }

    def impressoras(){
        def model = [:]

        def entities = Impressora.findAllByFornecedor(getFornecedorLogado())

        model.put("impressoras", entities)

        respond model
    }

    def abrirLote() {
        params.putAll(getParametros())

        loteService.abrirLote(params.long("id"))

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'faturamento.lote.aberto', getLocale()) as JSON
    }

    def fecharLoteIncompleto() {
        params.putAll(getParametros())
        Long id = params.id
        String codigoLote = params.codigoLote
        String justificativa = params.justificativa
        Impressora impressora = Impressora.get(params.long("impressora"))

        List<RetornoImpressao> impressoes = loteService.fecharLoteIncompleto(id, codigoLote, justificativa, impressora)
        if (!impressoes.isEmpty()){
            def model = [:]
            model.put("etiqueta", impressoes)
            respond model
            return
        }

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'faturamento.lote.fechado', getLocale()) as JSON
    }

    def checarEnvioParaRomaneio(){
        List<Integer> ids = params.id.split(",").collect({Integer.parseInt(it)})

        List<RomaneioEBSDTO> entities = romaneioService.getDadosParaRomaneioFromLotes(ids, getOrganizacaoLogada())

        def model = [:]
        model.put("entities", entities)
        respond model
    }

    def enviarParaRomaneio() {
        params.putAll(getParametros())

        ArrayList<Integer> ids = params.id as ArrayList<Integer>
        romaneioService.salvar(ids, getFornecedorLogado(), userService.getUsuarioLogado())

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'faturamento.lote.romaneio', getLocale()) as JSON
    }

    def concluirOP() {
        params.putAll(getParametros())
        loteService.concluirOPs(params.list('lote'))

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'faturamento.lote.opsConcluidas', getLocale()) as JSON
    }

    def exportarQuery = {
        createAlias('grupoLinhaDeProducao', 'g', JoinType.LEFT_OUTER_JOIN)
        eq("statusLote", StatusLote.FECHADO)

        eq("g.fornecedor", getFornecedorLogado())
        order "ano", "asc"
        order "semana", "asc"
        order "numeroLote", "asc"
    }
    def exportarLotes(){
        try {
            FiltroFaturamento filtro = new FiltroFaturamento(params)
            filtro.paginacao.setOffset(0)
            filtro.paginacao.setMax(100000)
            filtro.statusLote = StatusLote.FECHADO

            Fornecedor fornecedor = getFornecedorLogado()
            List<FaturamentoDTO> lotes = loteService.getFaturamentos(filtro, fornecedor)

            File file = relatorioService.gerarRelatorioLotes(lotes, getFornecedorLogado(), userService.getUsuarioLogado(), getLocale())
            response.contentType = "application/octet-stream"
            response.outputStream << file.bytes.encodeHex()?.toString()
            response.outputStream.flush()
            response.outputStream.close()
            file.delete()
        } catch(RelatorioException e){
            render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, e.getMensagem(), crudService.getLocale()) as JSON
        } catch (e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", crudService.getLocale()) as JSON
            e.printStackTrace()
        }
    }

    def exportarCaixas(){
        params.putAll(getParametros())
        Lote lote = Lote.get(params.long('lote'))

        File file = relatorioService.gerarRelatorioFaturamentoCaixa(lote, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

    def caixasDoLote(){
        Lote lote = Lote.get(params.long('lote'))
        ImpressaoApontamentoLote impressao = lote.impressao

        def model = [:]
        if (!impressao || !impressao.caixas){
            if (lote.quantidadeMaxima){
                model.put("caixasNaoCriadas", lote.quantidadeMaximaDeCaixas)
            }
        } else {
            model.put("caixas", impressao.caixas.sort({it.numeroCaixa}))
            if (lote.quantidadeMaxima){
                model.put("caixasNaoCriadas", lote.quantidadeMaximaDeCaixas-impressao.caixas.size())
            }
        }

        respond model
    }

    def loteException(LoteException e) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, e.mensagem, e.args, getLocale())
    }

    def exportarExcel() {
        params.putAll(getParametros())
        println params
        List<String> colunas = ["codigoLote",
                                "codigoProduto",
                                "descricaoProduto",
                                "local",
                                "agrupamento",
                                "quantidade",
                                "quantidadeMaxima",
                                "quantidadePorCaixa",
                                "statusLote",
                                "ordemFabricacao"]


        Map<String, String> filtros = params.filtros.collectEntries({[it, params."$it"]}).findAll({it.value})

        FiltroFaturamento filtro = new FiltroFaturamento(params)
        filtro.paginacao.setOffset(0)
        filtro.paginacao.setMax(100000)

        Fornecedor fornecedor = getFornecedorLogado()
        List<FaturamentoDTO> lotes = loteService.getFaturamentos(filtro, fornecedor)

        File file = relatorioService.gerarRelatorioFaturamentoListagem(lotes, colunas, filtros, getLocale())
        response.contentType = "application/octet-stream"
        response.outputStream << file.bytes.encodeHex()?.toString()
        response.outputStream.flush()
        response.outputStream.close()
        file.delete()
    }

}



