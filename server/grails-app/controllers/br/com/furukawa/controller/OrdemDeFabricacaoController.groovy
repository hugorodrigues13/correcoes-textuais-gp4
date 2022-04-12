package br.com.furukawa.controller

import br.com.furukawa.dtos.LogOperacaoDTO
import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.filtros.FiltroOrdemFabricacao
import br.com.furukawa.dtos.OrdemDeFabricacaoDTO
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaFolhaImpressao
import br.com.furukawa.dtos.impressao.ImpressaoEtiquetaSeriaisOrdemDeFabricacao
import br.com.furukawa.dtos.impressao.RetornoImpressao
import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.TipoImpressao
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.User
import br.com.furukawa.service.ImpressoraService
import br.com.furukawa.service.LogOperacaoService
import br.com.furukawa.service.MensagemService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.OrdemDeFabricacaoService
import br.com.furukawa.service.RelatorioService
import br.com.furukawa.service.SequenciamentoService
import br.com.furukawa.service.SerialService
import br.com.furukawa.service.UserService
import grails.converters.JSON

import java.text.SimpleDateFormat

class OrdemDeFabricacaoController extends CrudController {

    OrdemDeFabricacaoService ordemDeFabricacaoService
    ImpressoraService impressoraService
    LogOperacaoService logOperacaoService
    MensagemService mensagemService
    RelatorioService relatorioService
    OracleService oracleService
    SerialService serialService

    SequenciamentoService sequenciamentoService

    OrdemDeFabricacaoController() {
        super(OrdemDeFabricacao)
    }

    def index() {
        FiltroOrdemFabricacao filtro = new FiltroOrdemFabricacao(params)
        List<OrdemDeFabricacaoDTO> entities = ordemDeFabricacaoService.getOrdensDeFabricacao(filtro, getFornecedorLogado(), true)
        Integer total = ordemDeFabricacaoService.getOrdensDeFabricacaoTotal(filtro, getFornecedorLogado())
        def impressoras = Impressora.findAllByFornecedor(getFornecedorLogado())

        def model = [:]
        model.put("entities", entities)
        model.put("impressoras", impressoras)
        model.put("total", total)
        model.put("status", StatusOrdemFabricacao.values() as List)
        model.put("statusWIP", StatusOrdemDeProducaoWIP.values() as List)
        model.put("filtroStatusPadrao", StatusOrdemFabricacao.filtroStatusPadrao)

        respond model
    }

    def imprimirEtiqueta() {
        Map model = [:]
        params.putAll(getParametros())

        OrdemDeFabricacao ordemFabricacao = OrdemDeFabricacao.get(params.long('ordemFabricacaoId'))
        Impressora impressora = Impressora.get(params.long('impressoraId'))
        String justificativa = params.justificativa

        List<RetornoImpressao> retornoEtiquetas = new ArrayList<>()
        List<ImpressaoEtiquetaSeriaisOrdemDeFabricacao> retornos = ordemDeFabricacaoService.montaImpressaoEtiquetaDTO(ordemFabricacao)

        retornos.each {retorno ->
            String jsonBody = retorno.getJsonStringEtiqueta()
            if (impressora) {
                if(impressora.tipoImpressao == TipoImpressao.AGENTE) {
                    retornoEtiquetas.add(impressoraService.gerarEtiqueta(jsonBody))
                } else {
                    retornoEtiquetas.add(impressoraService.imprimirEtiqueta(impressora, jsonBody, ""))
                }
            } else {
                retornoEtiquetas.add(impressoraService.gerarEtiqueta(jsonBody))
            }
        }

        if(!retornoEtiquetas.isEmpty() && retornoEtiquetas.any {it.success}) {
            boolean existeLog = logOperacaoService.existeLogOperacao(TipoLogOperacao.IMPRIMIR_ETIQUETA_OF, TipoParametroLogOperacao.ORDEM_FABRICACAO, ordemFabricacao.getCodigoOrdemDeFabricacao())
            if(!existeLog) {
                justificativa = mensagemService.getMensagem("ordemDeFabricacao.primeiraImpressao.message", null, null, getLocale())
            }

            logOperacaoService.imprimirEtiquetaOF(ordemFabricacao, justificativa)
            serialService.salvarImpressaoEtiquetaOFNosSeriais(ordemFabricacao)
        }

        model.put("etiquetas", retornoEtiquetas)
        model.put("impressora", impressora)
        respond model
    }

    def folhaImpressao(){
        params.putAll(getParametros());
        List<OrdemDeFabricacao> ordensDeFabricacao = OrdemDeFabricacao.findAllByIdInList(params.params?.ids as List<Long>);
        List<RetornoImpressao> retornoImpressaoList = new ArrayList<RetornoImpressao>();

        ordensDeFabricacao.each {ordemDeFabricacao ->
            retornoImpressaoList.add(impressoraService.gerarEtiquetaFolhaImpressao(ordemDeFabricacao));
        }

        respond retornoImpressaoList
    }

    def folhaImpressaoData(){
        OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.get(params.long('id'))

        ImpressaoEtiquetaFolhaImpressao retorno = impressoraService.gerarDadosFolhaImpressao(ordemDeFabricacao);

        def model = [:]

        model.put('entity', retorno);

        respond model;
    }

    def exportarOfs(){
        try {
            List<String> colunas = params.colunas.split(";")
            Map<String, String> filtros = colunas.collectEntries({[it, params."$it"]}).findAll({it.value})
            if(params.dataCriacaoInicial) {
                filtros.put("dataCriacao", "${params.dataCriacaoInicial} - ${params.dataCriacaoFinal}")
            }
            if(params.dataPrevisaoFinalizacaoInicial) {
                filtros.put("dataPrevisaoFinalizacao", "${params.dataPrevisaoFinalizacaoInicial} - ${params.dataPrevisaoFinalizacaoFinal}")
            }
            FiltroOrdemFabricacao filtro = new FiltroOrdemFabricacao(params)
            List<OrdemDeFabricacaoDTO> ofs = ordemDeFabricacaoService.getOrdensDeFabricacao(filtro, getFornecedorLogado(), false)
            File file = relatorioService.gerarRelatorioOrdensFabricacao(ofs, colunas, filtros, getLocale())

            response.contentType = "application/octet-stream"
            response.outputStream << file.bytes.encodeHex()?.toString()
            response.outputStream.flush()
            response.outputStream.close()
            file.delete()
        } catch(RelatorioException e){
            render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, e.getMensagem(), crudService.getLocale()) as JSON
        } catch(Exception e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", crudService.getLocale()) as JSON
            e.printStackTrace()
        }
    }

    def materiasPrimas() {
        Organizacao organizacao = getOrganizacaoLogada()
        Locale locale = crudService.getLocale()
        def model = [:]
        Idioma linguagem = Idioma.getIdiomaPeloLocale(locale.baseLocale.language)
        ArrayList<ComponenteWIP> materiasPrimas = oracleService.getComponentesRoteiroWIP(params.ordemProducao as String, organizacao.organizationID as Long, linguagem.descricao as String, true)
        model.put("materiaPrima", materiasPrimas)
        respond model
    }

    def enviarSeparacao(){
        params.putAll(getParametros())
        println params

        OrdemDeFabricacao ordemFabricacao = OrdemDeFabricacao.get(params.long('ordemFabricao'))
        String justificativa =  params.justificativa
        Date dataSeparacao = params.dataSeparacao ?  new SimpleDateFormat("dd/MM/yyyy HH:mm").parse(params.dataSeparacao) : null
        List<ComponenteWIP> materiasPrimas = params.materiasPrimasSelecionadas

        ordemDeFabricacaoService.enviarParaSeparacao(ordemFabricacao, justificativa, dataSeparacao, materiasPrimas)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def alterarQuantidade(){
        params.putAll(getParametros())

        OrdemDeFabricacao ordemFabricacao = OrdemDeFabricacao.get(params.long('id'))
        Long quantidade = params.long('quantidade')

        ordemDeFabricacaoService.alterarQuantidade(ordemFabricacao, quantidade)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def cancelar(){
        params.putAll(getParametros())
        List<OrdemDeFabricacao> ofs = OrdemDeFabricacao.getAll(params.ids as ArrayList<Long>)

        OrdemDeFabricacao ordemNaoDisponivelCancelar = ofs.find {!it.podeSerCancelada()}
        if(ordemNaoDisponivelCancelar) {
            render status: 422, crudService.montaMensagemDeRespostaCompleta(
                    TipoMensagem.ERROR_TYPE,
                    'ordemDeFabricacao.cancelar.erro.message',
                    [ordemNaoDisponivelCancelar.getCodigoOrdemDeFabricacao()] as Object[],
                    getLocale()
            ) as JSON
        } else {
            ofs.each {
                sequenciamentoService.cancelarOrdemDeFabricacao(it)
            }

            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
        }
    }

    def historicoImpressao(){

        OrdemDeFabricacao ordemFabricacao = OrdemDeFabricacao.get(params.long('id'))
        Fornecedor fornecedor = ordemFabricacao.fornecedor
        String codigoOrdemFabricacao = ordemFabricacao.codigoOrdemDeFabricacao
        TipoLogOperacao imprimirEtiqueta = TipoLogOperacao.IMPRIMIR_ETIQUETA_OF

        List <LogOperacaoDTO> logOperacao = logOperacaoService.buscarLogOperacaoOF(codigoOrdemFabricacao, imprimirEtiqueta, fornecedor.id)

        def model = [:]

        model.put("logOperacao", logOperacao)

        respond model
    }

}
