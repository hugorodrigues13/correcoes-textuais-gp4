package br.com.furukawa.controller

import br.com.furukawa.dtos.OrdemDeProducaoDTO
import br.com.furukawa.dtos.filtros.FiltroAcompanhamentoOP
import br.com.furukawa.dtos.importer.ImportResponse
import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.model.ClassePorPlanejador
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.Romaneio
import br.com.furukawa.service.AcompanhamentoOrdemProducaoService
import br.com.furukawa.service.ClassePorPlanejadorService
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.EmailService
import br.com.furukawa.service.HomeService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.RelatorioService
import br.com.furukawa.utils.OrderBySqlFormula
import grails.converters.JSON
import br.com.furukawa.service.UserService
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest

import java.text.SimpleDateFormat

class AcompanhamentoOrdemProducaoController extends CrudController{

    OracleService oracleService
    UserService userService
    RelatorioService relatorioService
    AcompanhamentoOrdemProducaoService acompanhamentoOrdemProducaoService
    ClassePorPlanejadorService classePorPlanejadorService
    HomeService homeService

    AcompanhamentoOrdemProducaoController() {
        super(OrdemDeProducao)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10,100)
        List<Fornecedor> userFornecedores = userService.getUsuarioLogado().getAcessos()*.getFornecedores().flatten()
        Set<String> userPlanejadores = userService.getUsuarioLogado().getPlanejadores()
        FiltroAcompanhamentoOP filtro = new FiltroAcompanhamentoOP(params, userPlanejadores as List)

        List<OrdemDeProducaoDTO> entities = acompanhamentoOrdemProducaoService.getOrdensDeProducao(userFornecedores, filtro)
        Integer total = acompanhamentoOrdemProducaoService.getTotalOrdensDeProducao(userFornecedores, filtro)

        List<String> planejadores = oracleService.getPlanejadores(getOrganizacaoLogada())
        String defaultPlanejador = "todos"
        planejadores.add(0, "todos")
        if (!userService.getUsuarioLogado().getPlanejadores().isEmpty()){
            planejadores.add(0, "padrao")
            defaultPlanejador = "padrao"
        }

        def model = [:]
        model.put('entities', entities)
        model.put("total", total)
        model.put("tiposStatus", StatusOrdemProducao.values() as List)
        model.put("planejadores", planejadores)
        model.put("defaultPlanejador", defaultPlanejador)
        model.put("tiposStatusOracle", StatusOrdemDeProducaoWIP.values() as List)
        model.put("tiposStatusOraclePadrao", StatusOrdemDeProducaoWIP.getStatusVisiveisPadrao())

        respond model
    }

    def buscaOrdensDeProducao() {}

    def reexportar() {
        OrdemDeProducao ordemDeProducao = OrdemDeProducao.get(params.id as Long)
        Organizacao organizacao = crudService.getOrganizacaoLogada()
        JSON mensagem = crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.ordemExport.message', Idioma.getLocaleByOrganizacao(organizacao)) as JSON

        String planejador = oracleService.getPlanejadorDoProduto(organizacao, ordemDeProducao.codigoProduto)

        Long classePorPlanejadorId = classePorPlanejadorService.getClassePorPlanejador(planejador, organizacao)
        ClassePorPlanejador classePorPlanejador = ClassePorPlanejador.findByIdAndOrganizacao(classePorPlanejadorId, organizacao)

        String classeContabil = "ACESSORIOS"

        if(classePorPlanejador != null) {
            classeContabil = classePorPlanejador.classeContabil
        }

        oracleService.exportarOrdemDeProducao(ordemDeProducao, organizacao, classeContabil)

        render status: 200, mensagem
    }

    def atualizar(){
        try {
            oracleService.atualizaOrdensDeProducao()
            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
        } catch(Exception exception) {
            emailService.enviaEmailDeErro(exception)
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", getLocale()) as JSON
        }
    }

    def exportarOps(){
        try {
            List<String> colunas = params.colunas.split(";")
            Map<String, String> filtros = colunas.collectEntries({[it, params."$it"]}).findAll({it.value})
            List<Fornecedor> userFornecedores = userService.getUsuarioLogado().getAcessos()*.getFornecedores().flatten()
            Set<String> userPlanejadores = userService.getUsuarioLogado().getPlanejadores()

            FiltroAcompanhamentoOP filtro = new FiltroAcompanhamentoOP(params, userPlanejadores as List)
            filtro.paginacao.setMax(100000)
            filtro.paginacao.setOffset(0)

            List<OrdemDeProducaoDTO> ops = acompanhamentoOrdemProducaoService.getOrdensDeProducao(userFornecedores, filtro)
            File file = relatorioService.gerarRelatorioOrdensProducao(ops, colunas, filtros, getLocale())
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

    def ordensAtrasadas() {
        Integer max = (params.max ?: 10) as Integer
        Integer offset = (params.offset ?: 0) as Integer
        String sort = params.sort ?: "codigoProduto"
        String order = params.order ?: "ASC"
        Long grupoLinhas = params.long('grupoLinhas')
        def model = [:]

        model.put("entities", homeService.buscaOrdensDeProducaoAtrasadas(grupoLinhas, offset, max, sort, order))
        model.put("total", homeService.totalBuscaOrdensDeProducaoAtrasadas(grupoLinhas))

        respond model
    }

    @Override
    def prepareEdit() {
        OrdemDeProducao op = OrdemDeProducao.get(params.long('id'))

        def model = [:]
        model.put('entityInstance', op)
        model.put('listTipoStatusOracle', StatusOrdemDeProducaoWIP.getStatusAlteracao() as List)

        respond model
    }

    def editar(){
        params.putAll(getParametros())
        println params

        OrdemDeProducao op = OrdemDeProducao.get(params.long('id'))
        Long quantidade = params.long('quantidade')
        StatusOrdemDeProducaoWIP status = StatusOrdemDeProducaoWIP.valueOf(params.statusOracle)
        Date dataPrometida = new SimpleDateFormat("dd/MM/yyyy").parse(params.dataPrometida)

        acompanhamentoOrdemProducaoService.editarOrdemDeProducao(op, quantidade, status, dataPrometida, getOrganizacaoLogada())

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON

    }

    def alterarEmMassa() {
        if (!(request instanceof MultipartHttpServletRequest)) {
            render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
            return
        }

        MultipartFile multipartFile = request.getFile("file")
        ImportResponse importResponse = acompanhamentoOrdemProducaoService.editarEmMassa(multipartFile as MultipartFile, crudService.getOrganizacaoLogada() as Organizacao, getLocale() as Locale)

        def messages = []
        if (importResponse.invalidos) {
            messages.add(crudService.montaMensagem(TipoMensagem.ERROR_TYPE, "acompanhamentoOrdemProducao.alterarEmMassa.erros", [importResponse.invalidos.length] as Object[]))
        }
        if (importResponse.validos) {
            messages.add(crudService.montaMensagem(TipoMensagem.SUCCESS_TYPE, "acompanhamentoOrdemProducao.alterarEmMassa.sucesso", [importResponse.validos.length] as Object[]))
        }
        if (!importResponse.validos && !importResponse.invalidos) {
            messages.add(crudService.montaMensagem(TipoMensagem.WARNING_TYPE, "acompanhamentoOrdemProducao.alterarEmMassa.vazio", [] as Object[]))
        }
        def response = crudService.montaListaDeMensagens(messages, getLocale())
        if (importResponse.invalidos && importResponse.fileCorrigida) {
            File file = importResponse.fileCorrigida
            response.put("fileCorrigida", file.bytes.encodeHex()?.toString())
            file.delete()
        }
        render status: 200, response as JSON

    }
}
