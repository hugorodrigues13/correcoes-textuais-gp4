package br.com.furukawa.controller

import br.com.furukawa.dtos.FornecedorListaRoteiroEBSDTO
import br.com.furukawa.dtos.GeracaoOrdemProducaoErrosDTO
import br.com.furukawa.dtos.OrdemDeVendaEBSDTO
import br.com.furukawa.dtos.OrdensSelecionadasComOVDTO
import br.com.furukawa.dtos.ProdutoDTO
import br.com.furukawa.dtos.ProdutoEBSDTO
import br.com.furukawa.dtos.importer.ImportResponse
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.MensagemException
import br.com.furukawa.exceptions.OrdemDeProducaoException
import br.com.furukawa.exceptions.MensagemException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.User
import br.com.furukawa.service.ClassePorPlanejadorService
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.EmailService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.OrdemDeProducaoService
import br.com.furukawa.service.UserService
import grails.converters.JSON
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest

class GeracaoOrdemDeProducaoController {

    OracleService oracleService
    CrudService crudService
    OrdemDeProducaoService ordemDeProducaoService
    ClassePorPlanejadorService classePorPlanejadorService
    EmailService emailService
    UserService userService

    def buscarProdutos() {
        def model = [:]
        String codigoProduto = params.codigo
        String descricaoProduto = params.descricao

        List<ProdutoEBSDTO> produtos = oracleService.buscarProdutos(crudService.getOrganizacaoLogada(), codigoProduto, descricaoProduto)
        produtos.removeIf({produto ->
            List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros = oracleService.getFornecedoresListasRoteiros(crudService.getOrganizacaoLogada(), produto.codigo)
            produto.fornecedoresListasRoteiros = fornecedoresListasRoteiros
            return fornecedoresListasRoteiros.isEmpty()
        })
        model.put("produtos", produtos)

        respond model
    }

    def buscarPorOrdemDeVenda() {
        def model = [:]
        String numeroOV = params.ordemDeVenda
        String codigoProduto = params.codigoProduto
        List<OrdemDeVendaEBSDTO> ordens = oracleService.buscarOrdensDeVendaComFornecedores(crudService.getOrganizacaoLogada(), numeroOV, codigoProduto)

        model.put("ordens", ordens)

        respond model
    }

    def getLocale() {
        def lang = getLingua()
        return crudService.getLocale(lang)
    }

    String getLingua() {
        return request.getHeader("locale") ?: "pt-BR"
    }

    def save() {
        Map model = [:]
        params.putAll(getParametros())
        boolean comOV = params.boolean('comOV')
        List<OrdensSelecionadasComOVDTO> ordens = []
        if (comOV) {
            params.ordensSelecionadas.each { Object item ->
                ordens.add(new OrdensSelecionadasComOVDTO([
                        key            : item.key,
                        codigoProduto  : item.codigoProduto,
                        quantidade     : item.quantidade,
                        roteiro        : item.roteiro,
                        lista          : item.lista,
                        dataFinalizacao: item.dataFinalizacao,
                        fornecedor     : item.fornecedor,
                        justificativa  : item.justificativa
                ]))
            }
            Organizacao organizacao = crudService.getOrganizacaoLogada()
            List<GeracaoOrdemProducaoErrosDTO> listaDeErros = ordemDeProducaoService.gerarOrdemDeProducaoComOv(ordens as List<OrdensSelecionadasComOVDTO>, organizacao)
            model.put("errosGeracaoComOV", listaDeErros)
            respond model
        } else {
            String codigoProduto = params.codigoProduto
            String roteiro = params.roteiro == '00' ? null : params.roteiro as String
            String lista = params.lista == '00' ? null : params.lista as String
            Fornecedor fornecedor = Fornecedor.findByVendorIdAndOrganizationId(params.long('fornecedor') as Long, crudService.getOrganizacaoLogada().organizationID as Long)
            if (!fornecedor || !fornecedor.prefixoProducao){
                String message = !fornecedor ? "geracaoOrdemProducao.errorFornecedorNull.message" : "geracaoOrdemProducao.errorFornecedorPrefixo.message"
                render status: 422, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, message, getLocale()) as JSON
                return
            }

            Organizacao organizacao = crudService.getOrganizacaoLogada()
            Long quantidade = params.long('quantidade')
            String justificativa = params.justificativa
            String planejador = oracleService.getPlanejadorDoProduto(organizacao, codigoProduto)

            Long classePorPlanejador = classePorPlanejadorService.getClassePorPlanejador(planejador, organizacao)

            try {
                List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros = oracleService.getFornecedoresListasRoteiros(crudService.getOrganizacaoLogada(), codigoProduto)
                FornecedorListaRoteiroEBSDTO fornecedorListaRoteiro = fornecedoresListasRoteiros.find { it.idFornecedor == fornecedor?.vendorId && it.lista == lista && it.roteiro == roteiro }
                ordemDeProducaoService.gerarOrdemDeProducaoSemOv(codigoProduto, roteiro, lista, fornecedor, quantidade, crudService.getOrganizacaoLogada(), params.dataPrevisaoFinalizacao as String, planejador as String, classePorPlanejador, justificativa, fornecedorListaRoteiro?.idSite)
            } catch(MensagemException e){
                render status: 422, crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, e.getMensagem(), e.getArgs(), getLocale(), null) as JSON
                return
            } catch(e){
                emailService.enviaEmailDeErro(e)
                render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'default.erroDefault.message', getLocale()) as JSON
                e.printStackTrace()
                return
            }

            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.created.message', getLocale()) as JSON
        }
    }

    def importar() {
        if (!(request instanceof MultipartHttpServletRequest)) {
            render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
            return
        }
        MultipartFile multipartFile = request.getFile("file")
        Fornecedor fornecedor = Fornecedor.get(request.getParameter("fornecedor").toLong())
        ImportResponse importResponse = ordemDeProducaoService.importar(multipartFile, crudService.getOrganizacaoLogada(), fornecedor, getLocale())

        def messages = []
        if (importResponse.invalidos) {
            messages.add(crudService.montaMensagem(TipoMensagem.ERROR_TYPE, "geracaoOrdemProducao.importar.erros", [importResponse.invalidos.length] as Object[]))
        }
        if (importResponse.validos) {
            messages.add(crudService.montaMensagem(TipoMensagem.SUCCESS_TYPE, "geracaoOrdemProducao.importar.sucesso", [importResponse.validos.length] as Object[]))
        }
        if (!importResponse.validos && !importResponse.invalidos) {
            messages.add(crudService.montaMensagem(TipoMensagem.WARNING_TYPE, "geracaoOrdemProducao.importar.vazio", [] as Object[]))
        }
        def response = crudService.montaListaDeMensagens(messages, getLocale())
        if (importResponse.invalidos && importResponse.fileCorrigida) {
            File file = importResponse.fileCorrigida
            response.put("fileCorrigida", file.bytes.encodeHex()?.toString())
            file.delete()
        }
        render status: 200, response as JSON

    }

    def userFornecedores(){
        User user = userService.getUsuarioLogado()
        String organizacaoLogada = crudService.getOrganizacaoLogada().organizationID
        List<Fornecedor> userFornecedores = userService.getUsuarioLogado().getAcessos()*.getFornecedores().flatten().findAll({it.organizationId?.toString() == organizacaoLogada}).unique({it.id})

        def model = [:]
        model.put("fornecedores", userFornecedores)
        respond model
    }

    Map getParametros() {
        def lang = getLingua()
        def parameters = JSON.parse(request.getReader()) as Map
        def locale = crudService.getLocale(lang)
        parameters["locale"] = locale
        return parameters
    }

    def ordemDeProducaoException(OrdemDeProducaoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def exception(final Exception exception){
        respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'default.erroDefault.message', getLocale())
    }
}
