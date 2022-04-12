package br.com.furukawa.controller


import br.com.furukawa.dtos.ItemPedidoMaterialDTO
import br.com.furukawa.dtos.SerialFabricacaoPeriodoDTO
import br.com.furukawa.exceptions.ApontamentoException
import br.com.furukawa.exceptions.OracleException
import br.com.furukawa.exceptions.ServicosException
import br.com.furukawa.model.Conector
import br.com.furukawa.model.ConfiguracaoGeral
import br.com.furukawa.model.Defeito
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Parada
import br.com.furukawa.model.PedidoReposicaoMaterial
import br.com.furukawa.model.Produto
import br.com.furukawa.model.Recurso
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.model.User
import br.com.furukawa.service.ApontamentoService
import br.com.furukawa.service.AsaichiService
import br.com.furukawa.service.CrudService
import br.com.furukawa.service.MensagemService
import br.com.furukawa.service.OracleService
import br.com.furukawa.service.OrdemDeProducaoService
import br.com.furukawa.service.PedidoReposicaoMaterialService
import br.com.furukawa.service.RecursoService
import br.com.furukawa.service.SerialService
import br.com.furukawa.service.ServicosService
import br.com.furukawa.utils.DateUtils
import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
import grails.plugin.springsecurity.annotation.Secured

import java.text.SimpleDateFormat
import java.util.concurrent.TimeoutException

@Secured(['permitAll'])
class ServicosController {

    CrudService crudService
    MensagemService mensagemService
    PedidoReposicaoMaterialService pedidoReposicaoMaterialService
    SpringSecurityService springSecurityService
    SerialService serialService
    ServicosService servicosService
    ApontamentoService apontamentoService
    RecursoService recursoService
    OracleService oracleService
    OrdemDeProducaoService ordemDeProducaoService
    AsaichiService asaichiService

    def criarPedidoReposicao() {
        if(!isUsuarioLogado()) render status: 401

        params.putAll(getParametros())
        Long idRecurso = params.long('recurso')
        String chavePrimaria = params.chavePrimaria
        String previsaoEntrega = params.previsaoEntrega

        try {
            pedidoReposicaoMaterialService.salvarPedidoReposicaoMaterial(idRecurso,
                    chavePrimaria,
                    previsaoEntrega,
                    params.itens as ArrayList<ItemPedidoMaterialDTO>)

            render status: 200, [message: mensagemService.getMensagem('default.created.message', null, null, getLocale())] as JSON
        } catch(ServicosException ex) {
            render status: ex.httpStatus, [message: mensagemService.getMensagem(ex.mensagem, null, ex.args, getLocale())] as JSON
        } catch(OracleException ex) {
            render status: 422, [message: mensagemService.getMensagem(ex.mensagem, null, ex.args, getLocale())] as JSON
        }
    }

    def liberarPedidoReposicao() {
        if(!isUsuarioLogado()) render status: 401

        params.putAll(getParametros())
        String chavePrimaria = params.chavePrimaria
        PedidoReposicaoMaterial pedidoReposicaoMaterial = PedidoReposicaoMaterial.findByChavePrimariaAndIsLiberado(chavePrimaria, false)

        if (!chavePrimaria) {
            render status: 400, [error: mensagemService.getMensagem( 'pedidoReposicaoMaterial.buscaChavePrimaria.nullable', null, null, getLocale())] as JSON
        } else if (!pedidoReposicaoMaterial){
            render status: 404, [error: mensagemService.getMensagem( 'pedidoReposicaoMaterial.buscaChavePrimariaVazio.message', null, null,getLocale())] as JSON
        } else {
            pedidoReposicaoMaterial.isLiberado = true
            crudService.salvar(pedidoReposicaoMaterial)

            render status: 200, [message:  mensagemService.getMensagem( 'pedidoReposicaoMaterial.liberado.message', null, null, getLocale())] as JSON
        }
    }

    def buscarRecursos() {
        if(!isUsuarioLogado()) render status: 401

        if(!params.nomeUsuario){
            render status: 400, [error: mensagemService.getMensagem( 'servico.username.nullable', null, null, getLocale())] as JSON
        } else {
            String username = params.nomeUsuario

            User user = User.findByUsername(username)

            if (user) {
                List<Fornecedor> fornecedores = user.acessos*.fornecedores.flatten() as List<Fornecedor>

                List<Recurso> recursos  = Recurso.createCriteria().list {
                    'in'('fornecedor', fornecedores)
                    distinct('id')
                }

                def model = [:]

                model.put("recursos", recursos)

                respond model
            } else {
                render status: 400, [error: mensagemService.getMensagem( 'servico.buscaUsuario.error', null, null, getLocale())] as JSON
            }
        }
    }

    def atualizaCatalogos() {
        List<Long> ids = ordemDeProducaoService.getOrdensDeProducaoIdsParaAtualizacaoMP()
        List<OrdemDeProducao> ops = OrdemDeProducao.getAll(ids)
        ops.unique {[it.codigoProduto, it.fornecedor.organizationId]}.each {
            println "atualizando catalogo ${it}"
            oracleService.atualizarCatalogos(it)
            println "fim catalogo ${it}"
        }

        render "OK"
    }

    def atualizaDadosAsaichi() {
        String mes = params.mes
        if(!mes) {
            render "Informe o mes!"
        } else {
            asaichiService.atualizaDadosProducaoDefeitosMensal(mes)
        }

        render "OK"
    }

    def atualizaOP() {
        String ordemDeProducao = params.ordemDeProducao
        if(!ordemDeProducao) {
            render "Informe a OP!"
        } else {
            oracleService.atualizaOrdemDeProducao(ordemDeProducao)
        }

        render "OK"
    }

    def buscarDadosDoRecurso() {
        if(!isUsuarioLogado()) render status: 401

        if(!params.recurso){
            render status: 400, [error: mensagemService.getMensagem( 'servico.recurso.nullable', null, null, getLocale())] as JSON
        } else {
            String recursoId = params.recurso
            if(recursoId.isLong()) {

                Recurso recurso = Recurso.get(recursoId.toLong())

                if (recurso) {

                    def model = [:]

                    model.put("conectores", recurso.conectores.toList())
                    model.put("defeitos", recurso.defeitos)
                    model.put("testes", recurso.testes.toList())

                    respond model
                } else {
                    render status: 400, [error: mensagemService.getMensagem( 'servico.recursoNaoEncontrado.error', null, null, getLocale())] as JSON
                }
            } else {
                render status: 400, [error: mensagemService.getMensagem( 'servico.recursoNaoEncontrado.error', null, null, getLocale())] as JSON
            }
        }
    }

    def checkHealth() {
        def model = [:]
        Date start = new Date()
        try {
            servicosService.checkConnection(params.boolean('simulate'))
            Date end = new Date()
            model.put('time', end.time - start.time)
            model.put('success', true)
            render status: 200, [success: true, time: end.time - start.time] as JSON
        } catch(TimeoutException e) {
            Date end = new Date()
            render status: 408, [error: e.message, time: end.time - start.time] as JSON
        } catch(Exception e) {
            Date end = new Date()
            render status: 500,  [error: e.message, time: end.time - start.time] as JSON
        }

        respond model
    }

    def buscarInformacoesDoSerial(){
        if(!isUsuarioLogado()) render status: 401

        SerialFabricacao serial = servicosService.pegarParametroEValidar(params, 'serial', {it.contains("-")}, {serialService.getSerialFabricacao(it)}, false)

        def model = [:]
        model.put("serial", serial)
        respond model
    }

    def buscarSeriaisPorPeriodo() {
        if(!isUsuarioLogado()) render status: 401

        def model = [:]

        def formataData = {
            try {
                new SimpleDateFormat("DD-MM-YYYY HH:MM").parse(it)
                return true
            } catch(Exception ignored) {
                return false
            }
        }

        String dataInicial = servicosService.pegarParametroEValidar(params, 'dataInicial', formataData, { it }, false)
        String dataFinal = servicosService.pegarParametroEValidar(params, 'dataFinal', formataData, { it }, false)
        Integer max = servicosService.pegarParametroEValidar(params, 'max', { it.isNumber() }, { Integer.parseInt(it as String) }, true) ?: ((Integer) 1E6)
        Integer pagina = servicosService.pegarParametroEValidar(params, 'pagina', { it.isNumber() }, { Integer.parseInt(it as String) }, true) ?: 1

        List<SerialFabricacaoPeriodoDTO> seriais = serialService.buscarSeriaisPorPeriodo(dataInicial, dataFinal, max, pagina)
        Long total = serialService.buscarTotalSeriaisPorPeriodo(dataInicial, dataFinal)

        model.put("seriais", seriais)
        model.put("total", total)

        respond model
    }

    def motivosDeParada(){
        if(!isUsuarioLogado()) render status: 401

        Recurso recurso = servicosService.pegarParametroEValidar(params, 'recurso', {it.isLong()}, {Recurso.get(it)}, false)
        List<MotivoDeParada> motivos = recursoService.getMotivosDeParada(recurso)

        def model = [:]
        model.put("motivosParada", motivos)
        respond model
    }

    def inicioProducao(){
        if(!isUsuarioLogado()) render status: 401

        params.putAll(getParametros())
        Recurso recurso = servicosService.pegarParametroEValidar(params, 'recurso', {it.isNumber()}, {Recurso.get(it)}, false)
        MotivoDeParada motivo = servicosService.pegarParametroEValidar(params, 'motivo', {it.isNumber()}, {MotivoDeParada.get(it)}, false)

        recursoService.criarParadaInicial(recurso)

        Parada parada = recurso.getParadaAtiva()
        if (!parada){
            render status: 422, [error:  mensagemService.getMensagem("servicos.inicioProducao.recursoSemParada.message", null, null, getLocale())] as JSON
            return
        }
        parada.setMotivo(motivo)
        parada.setFim(new Date())
        crudService.salvar(parada)

        render status: 200, [message:  mensagemService.getMensagem("servicos.inicioProducao.sucesso.message", null, null, getLocale())] as JSON
    }

    // boilerplate abaixo

    def servicoException(ServicosException ex){
        render status: ex.httpStatus, [error: mensagemService.getMensagem( ex.getMensagem(), null, ex.getArgs(),getLocale())] as JSON
    }

    def apontarSerial(){
        if(!isUsuarioLogado()) render status: 401

        params.putAll(getParametros())
        SerialFabricacao serial = servicosService.pegarParametroEValidar(params, 'serial', {it.contains("-")}, {serialService.getSerialFabricacao(it)}, false, 'apontamento.serialInvalido.message')
        Recurso recurso = servicosService.pegarParametroEValidar(params, 'recurso', {it.isNumber()}, {Recurso.get(it)}, false)
        Defeito defeito = servicosService.pegarParametroEValidar(params, 'defeito', {it.isNumber()}, {Defeito.get(it)}, true)
        User user = servicosService.pegarParametro(params, 'usuario', {User.findByUsername(it)})
        Long impressora = params.long('impressora')
        List dadosRastreaveis = params.camposRastreaveis

        try {
            apontamentoService.validacao(serial.getCodigoCompleto(), recurso.id, impressora, recurso.fornecedor)

            Apontamento apontamento = apontamentoService.salvarApontamento(serial, recurso, defeito, recurso.getOrganizacaoRecurso(), false, false, user, dadosRastreaveis)
            GrupoRecurso proximoProcesso = apontamento.processoAtual?.grupoRecurso

            String message = 'default.created.message'
            Object[] argumentos = null

            if(apontamento && serial.isPendenteApoio()) {
                message = 'apontamento.quantidadeMaximaAlcancadaEnviarParaApoio.message'
            } else if(proximoProcesso) {
                message = 'apontamento.salvar.proximoProcesso.message'
                argumentos = [proximoProcesso.nome]
            }

            render status: 200, [message:  mensagemService.getMensagem( message, null, argumentos, getLocale())] as JSON
        } catch(ApontamentoException e){
            render status: 422, [error:  mensagemService.getMensagem( e.getMensagem(), null, e.getArgs(), getLocale())] as JSON
        } catch(any){
            any.printStackTrace()
            render status: 500, [error:  mensagemService.getMensagem( "default.erroDefault.message", null, null, getLocale())] as JSON
        }
    }

    def buscarConectores() {
        if(!isUsuarioLogado()) render status: 401

        List<Conector> conectores = Conector.getAll()

        def model = [:]
        model.put("conectores", conectores)

        respond model
    }

    def buscarInformacoesDoProduto() {
        String filtro = params.filtro
        if(!filtro) {
            render status: 400, [error: mensagemService.getMensagem( 'servicos.filtro.nullable', null, null, getLocale())] as JSON
        } else {
            def model = [:]
            Produto produto = servicosService.getProduto(filtro)
            if(!produto) {
                render status: 404, [error:  mensagemService.getMensagem("servicos.produto.notFound", null, null, getLocale())] as JSON
            } else {
                model.put('produto', produto)

                respond model
            }
        }
    }

    def criaProdutos() {
        List<OrdemDeProducao> ops = OrdemDeProducao.getAll()
        ops.unique {[it.codigoProduto, it.fornecedor.organizationId]}.each {
            oracleService.atualizaProdutoDaOrdemDeProducao(it)
        }

        render "OK"
    }

    def atualizaProdutos() {
        List<Long> ids = ordemDeProducaoService.getOrdensDeProducaoIdsParaAtualizacaoMP()
        List<OrdemDeProducao> ops = OrdemDeProducao.getAll(ids)
        ops.unique {[it.codigoProduto, it.fornecedor.organizationId]}.each {
            oracleService.atualizaProdutoDaOrdemDeProducao(it)
        }

        render "OK"
    }

    def getLocale() {
        def lang = getLingua()
        return crudService.getLocale(lang)
    }

    String getLingua() {
        return request.getHeader("locale") ?: "pt-BR"
    }

    Map getParametros() {
        def lang = getLingua()
        def parameters = JSON.parse(request.getReader()) as Map
        def locale = crudService.getLocale(lang)
        parameters["locale"] = locale
        return parameters
    }

    boolean isUsuarioLogado() {
        String dataLiberacaoAutenticacao = ConfiguracaoGeral.getDataLiberacaoAutenticacaoServicosSTF()
        if(!DateUtils.alcancouDataLiberacaoAutorizacaoServicos(dataLiberacaoAutenticacao)) return true

        String autorizacao = request.getHeader("Autorizacao")
        if(!autorizacao) return false

        return servicosService.validarLogin(autorizacao)
    }

    def atualizarDataApontamentoMaisRecenteSerial() {
        String codigoOF = params.codigoOF
        Fornecedor fornecedor = Fornecedor.findByPrefixoProducao(params.prefixoFornecedor)
        OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.getByCodigo(codigoOF, fornecedor)
        serialService.atualizaDataApontamentoMaisRecenteSerial(ordemDeFabricacao)

        render "OK"
    }

    def atualizarEtiquetaApontamentoImpressaSerial() {
        String codigoOF = params.codigoOF
        Fornecedor fornecedor = Fornecedor.findByPrefixoProducao(params.prefixoFornecedor)
        OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.getByCodigo(codigoOF, fornecedor)
        serialService.atualizaEtiquetaApontamentoImpressa(ordemDeFabricacao)

        render "OK"
    }

    def atualizarParada() {
        params.putAll(getParametros())
        Long idParada = params.long('id')
        String horarioInicial = params.horarioInicial
        String horarioFinal = params.horarioFinal
        String motivoId = params.motivo
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")

        Parada parada = Parada.get(idParada)
        if(horarioInicial) {
            parada.inicio = sdf.parse(horarioInicial)
        }

        if(horarioFinal == "null") {
            parada.fim = null
        } else if(horarioFinal) {
            parada.fim = sdf.parse(horarioFinal)
        }

        if(motivoId == "null") {
            parada.motivo = null
        } else if(motivoId) {
            parada.motivo = MotivoDeParada.get(motivoId)
        }

        crudService.salvar(parada)

        render "OK"
    }

    def deletarParada() {
        Parada parada = Parada.get(params.id)

        crudService.excluir(parada)

        render "OK"
    }

    def atualizaEntidade() {
        params.putAll(getParametros())
        String entidade = params.entidade
        List valores = params.valores
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")

        Class clazz = grailsApplication.getArtefacts("Domain").find { it.clazz.simpleName == entidade }.clazz
        def instance = clazz.get(params.long('id'))
        valores.each { valor ->
            if(valor.tipo == "data") {
                valor.value = sdf.parse(valor.value)
            } else if(valor.tipo == "entidade") {
                Class clazz1 = grailsApplication.getArtefacts("Domain").find { it.clazz.simpleName == valor.nomeEntidade }.clazz
                valor.value = clazz1.get(valor.value)
            } else if(valor.value == "null") {
                valor.value = null
            }

            instance[valor.key] = valor.value
        }

        crudService.salvar(instance)

        render "OK"
    }

    def deletarEntidade() {
        String entidade = params.entidade
        Class clazz = grailsApplication.getArtefacts("Domain").find { it.clazz.simpleName == entidade }.clazz
        def instance = clazz.get(params.long('id'))

        crudService.excluir(instance)

        render "OK"
    }
}
