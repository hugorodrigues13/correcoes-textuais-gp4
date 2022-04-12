package br.com.furukawa.controller

import br.com.furukawa.dtos.ItemCatalogoDTO
import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.dtos.OrdemFabricacaoSequenciamentoDTO
import br.com.furukawa.dtos.OrdenacaoDTO
import br.com.furukawa.enums.Idioma
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.GrupoRecursoException

import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Organizacao
import br.com.furukawa.model.ProdutoGrupoLinhaDeProducao
import br.com.furukawa.service.GrupoLinhaDeProducaoService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.SequenciamentoService
import br.com.furukawa.service.UserService
import grails.converters.JSON

class SequenciamentoController extends CrudController {

    SequenciamentoService sequenciamentoService
    OracleService oracleService
    UserService userService

    SequenciamentoController() {
        super(OrdemDeFabricacao)
    }

    def buscarGrupos() {
        def model = [:]

        model.put("listaGrupos", GrupoLinhaDeProducao.findAllByFornecedorAndIsAtivo(getFornecedorLogado(), true))
        model.put("usuarioLogado", userService.getUsuarioLogado())
        respond model
    }

    def getCatalogoDoProduto(){
        def model = [:]
        String item = params.item
        Organizacao organizacao = getOrganizacaoLogada()
        List <ItemCatalogoDTO> itens = oracleService.buscaCatalogoDoProduto(organizacao, item)
        model.put("itens", itens)
        respond model
    }

    def buscarLinhasDeProducao() {
        GrupoLinhaDeProducao grupoLinhaDeProducao = GrupoLinhaDeProducao.get(params.long('idGrupoLinha'))
        grupoLinhaDeProducao.usuario = userService.getUsuarioLogado()
        crudService.salvar(grupoLinhaDeProducao)

        def model = [:]
        model.put("linhas", grupoLinhaDeProducao.linhas as List)
        respond model
    }

    def buscarOrdensInternasDoGrupo() {
        def model = [:]
        Long idGrupoLinha = params.long('idGrupoLinha')

        List<OrdemFabricacaoSequenciamentoDTO> ordensDoGrupo = sequenciamentoService.getOrdensInternas(
                idGrupoLinha,
                params.ordemProducao as String,
                params.materiaPrima as String,
                params.status as String,
                params.codigoProduto as String,
                params.ordemFabricacao as String
        )
        model.put("listStatusOrdemFabricacao", StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento())
        model.put("ordensDoGrupo", ordensDoGrupo)

        respond model
    }

    def gerarCodigo() {

        Map model = [:]

        model.put("codigo", sequenciamentoService.gerarCodigo())

        respond model
    }

    def getTotalOrdensDeProducaoProdutosSemGrupoAssociado() {
        log.println(params)
        def model = [:]
        model.put("totalOrdensDeProducaoProdutosSemGrupoAssociado", sequenciamentoService.getTotalOrdensDeProducaoProdutosSemGrupoAssociado(getFornecedorLogado(), params.ordemDeProducao as String, params.codigoProduto as String))
        respond model
    }

    def getOrdensDeProducaoProdutosSemGrupoAssociado() {
        log.println(params)
        def model = [:]
        model.put("totalOrdensDeProducaoProdutosSemGrupoAssociado", sequenciamentoService.getTotalOrdensDeProducaoProdutosSemGrupoAssociado(getFornecedorLogado(), params.ordemDeProducao as String, params.codigoProduto as String))
        model.put("ordensDeProducaoProdutosSemGrupoAssociado", sequenciamentoService.getOrdensDeProducaoProdutosSemGrupoAssociado(getFornecedorLogado(), params.offset as int, params.max as int, params.ordemDeProducao as String, params.codigoProduto as String, params.order as String))
        respond model
    }

    def getOrdensDeProducaoProdutosAssociadosAoGrupo() {
        GrupoLinhaDeProducao grupoLinhaDeProducao = GrupoLinhaDeProducao.get(params.long('id'))
        def model = [:]
        model.put("ordensDeProducaoProdutosAssociadosAoGrupo", sequenciamentoService.getOrdensDeProducaoProdutosAssociadosAoGrupo(grupoLinhaDeProducao))
        respond model
    }

    def getMPComponentesLoteWIP() {
        Organizacao organizacao = getOrganizacaoLogada()
        Locale locale = crudService.getLocale()
        def model = [:]
        Idioma linguagem = Idioma.getIdiomaPeloLocale(locale.baseLocale.language)
        ArrayList<ComponenteWIP> materiasPrimas = oracleService.getComponentesRoteiroWIP(params.ordemDeProducao as String, organizacao.organizationID as Long, linguagem.descricao as String, true)
        model.put("materiaPrima", materiasPrimas)
        model.put("total", materiasPrimas.size())
        respond model
    }

    def save() {
        params.putAll(getParametros())
        println(params)
        String dataSeparacao
        if(!params.dataSeparacao) {
            dataSeparacao = null
        } else if (!params.horaSeparacao){
            dataSeparacao = null
        } else {
            dataSeparacao = (params.dataSeparacao as String) + "-" + (params.horaSeparacao as String)
        }
        String ordemExterna = params.ordemDeProducao
        Long quantidade = params.long("quantidade")
        Long multiplicador = params.long("multiplicador")
        String codigoProduto = params.codigoProduto
        GrupoLinhaDeProducao grupoLinhaDeProducao = GrupoLinhaDeProducao.get(params.long('idGrupoLinha'))
        sequenciamentoService.checarUsuarioLogadoParaSequenciamento(grupoLinhaDeProducao)
        LinhaDeProducao linhaDeProducao = LinhaDeProducao.get(params.long("linhaProducao"))
        Boolean segregarLotes = params.segregar
        if (linhaDeProducao && !linhaDeProducao.isUltimaVersao()){
            // como o buscarLinhasDeProducao() é chamado no início do sequenciamento, quando alguém for criar uma OF, pode ser que a linha já tenha sido versionada
            linhaDeProducao = linhaDeProducao.getUltimaVersao()
        }
        Boolean separacao = params.separacao.asBoolean()
        def materiaPrima = params.materiaPrima
        String comentarios = params.comentarios.asBoolean() ? params.comentario : null
        OrdemDeProducao ordemDeProducao = OrdemDeProducao.getByCodigo(ordemExterna)
        if (quantidade * multiplicador > ordemDeProducao.quantidadeDisponivelFabricacao){
            render status: 422, crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, 'sequenciamento.quantidadeOrdemDeProducaoParaSequenciamentoAlcancada.message', [quantidade * multiplicador, ordemDeProducao.quantidadeDisponivelFabricacao] as Object[], getLocale()) as JSON
            return
        }

        List<String> ordensCriadas = []
        for (int i = 0; i < multiplicador; i++){
            OrdemDeFabricacao ordemDeFabricacao = sequenciamentoService.salvarOrdemDeFabricacao(getFornecedorLogado(), ordemExterna, quantidade, codigoProduto, grupoLinhaDeProducao, linhaDeProducao, separacao, materiaPrima, dataSeparacao, comentarios, segregarLotes)
            sequenciamentoService.criaSeriais(ordemDeFabricacao)
            ordensCriadas.add(ordemDeFabricacao.getCodigoOrdemDeFabricacao())
        }

        String message = 'sequenciamento.created.message'
        render status: 200, crudService.montaMensagemDeRespostaCompleta(TipoMensagem.SUCCESS_TYPE, message, [ordensCriadas.join(", ")] as Object[], getLocale()) as JSON
    }

    @Override
    def update() {
        params.putAll(getParametros())
        OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.get(params.long("id"))
        sequenciamentoService.checarUsuarioLogadoParaSequenciamento(ordemDeFabricacao.grupoLinhaProducao)
        String codigoOrdemAnterior = params.codigoOrdemAnterior

        sequenciamentoService.alterarPosicaoOrdemDeFabricacao(ordemDeFabricacao, codigoOrdemAnterior)

        String message = 'default.updated.message'
        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, message, getLocale()) as JSON
    }

    @Override
    def delete() {
        if (handleReadOnly()) {
            return
        }

        OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.get(params.long("id"))
        sequenciamentoService.checarUsuarioLogadoParaSequenciamento(ordemDeFabricacao.grupoLinhaProducao)

        if (ordemDeFabricacao.status == StatusOrdemFabricacao.EM_ANDAMENTO) {
            render status: 422, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'sequenciamento.apontamento.erro.message', getLocale()) as JSON
        } else {
            sequenciamentoService.cancelarOrdemDeFabricacao(ordemDeFabricacao)
            String message = 'default.deleted.message'
            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, message, getLocale()) as JSON
        }
    }

    def associarProdutoAoGrupo() {
        params.putAll(getParametros())
        println(params)
        if(params.idGrupoLinha && params.produto) {
            GrupoLinhaDeProducao grupoLinhaDeProducao = GrupoLinhaDeProducao.get(params.long('idGrupoLinha'))

                ProdutoGrupoLinhaDeProducao produto = new ProdutoGrupoLinhaDeProducao()
                produto.codigo = params.produto.codigo

            grupoLinhaDeProducao.addToProdutos(produto)

            crudService.salvar(grupoLinhaDeProducao)

            render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
        }else{
            render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
        }
    }

    def ordenacaoRapida(){
        params.putAll(getParametros())
        println(params)
        GrupoLinhaDeProducao grupoLdp = GrupoLinhaDeProducao.get(params.long('idGrupoLP'))
        sequenciamentoService.checarUsuarioLogadoParaSequenciamento(grupoLdp)
        List<OrdenacaoDTO> ordenacoes = params.ordens.sort({it.prioridade}).collect({new OrdenacaoDTO(it)})

        sequenciamentoService.reordenarOrdensDeFabricacao(grupoLdp, ordenacoes)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }

    def alterarLinhaProducao(){
        params.putAll(getParametros())

        OrdemDeFabricacao ordemFabricacao = OrdemDeFabricacao.get(params.long('ordemFabricacao'))
        LinhaDeProducao linhaProducao = LinhaDeProducao.get(params.long('linhaProducao'))

        sequenciamentoService.alterarLinhaProducao(ordemFabricacao, linhaProducao)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON

    }

    def mudarOrdem(){
        params.putAll(getParametros())
        println(params)
        List<Integer> ordensFabricacao = params.ordens
        GrupoLinhaDeProducao grupoLdp = GrupoLinhaDeProducao.get(params.long('grupoLinhaProducao'))
        sequenciamentoService.checarUsuarioLogadoParaSequenciamento(grupoLdp)

        sequenciamentoService.reordenarOrdensDeFabricacaoSemArrastar(ordensFabricacao)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON

    }

    def grupoRecursoException(GrupoRecursoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

}
