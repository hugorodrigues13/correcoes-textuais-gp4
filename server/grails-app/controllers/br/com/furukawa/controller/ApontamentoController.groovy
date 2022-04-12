package br.com.furukawa.controller

import br.com.furukawa.dtos.ApontamentoResponseDTO
import br.com.furukawa.dtos.GrupoRecursoParadaDTO
import br.com.furukawa.dtos.TurnoDTO
import br.com.furukawa.enums.TipoMensagem

import br.com.furukawa.exceptions.ApontamentoException
import br.com.furukawa.exceptions.LoteException
import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.Defeito
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.Impressora
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Parada
import br.com.furukawa.model.Recurso
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.model.User
import br.com.furukawa.service.ApoioService
import br.com.furukawa.service.ApontamentoService
import br.com.furukawa.service.RecursoService
import br.com.furukawa.utils.DateUtils
import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService

import java.text.SimpleDateFormat

class ApontamentoController extends CrudController {

    ApontamentoService apontamentoService
    ApoioService apoioService
    SpringSecurityService springSecurityService
    RecursoService recursoService

    ApontamentoController() {
        super(Apontamento)
    }

    def getRecursosDoFornecedor() {
        def model = [:]
        Fornecedor fornecedor = getFornecedorLogado()

        model.put("recursos", apontamentoService.getRecursosUtilizadosEmAlgumProcessoLP(fornecedor))
        respond model
    }

    def validarSerial() {
        params.putAll(getParametros())
        String codigoSerial = params.serial
        Long recursoId = params.recurso
        Long impressoraId = params.impressoraId
        def response = [:]
        try {
            apontamentoService.validacao(codigoSerial, recursoId, impressoraId, getFornecedorLogado())
        } catch (ApontamentoException e) {
            response = crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, e.mensagem, e.args, getLocale(), null, e.cor)
        }

        response.put('apontamentoResponseDTO',
                apontamentoService.inserirDadosSerialNaResponse(
                        codigoSerial,
                        Recurso.get(recursoId),
                        getOrganizacaoLogada(),
                        !response.isEmpty(),
                        true))

        respond response
    }

    def validarOF() {
        params.putAll(getParametros())
        String codigoOF = params.of
        Long recursoId = params.recurso
        Long impressoraId = params.impressoraId
        def response = [:]
        try {
            apontamentoService.validacaoOF(codigoOF, recursoId, impressoraId, getFornecedorLogado())
            OrdemDeFabricacao op = OrdemDeFabricacao.getByCodigo(codigoOF, getFornecedorLogado())
            response.put('totalSeriais', op.quantidadeTotal)
        } catch (ApontamentoException e) {
            response = crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, e.mensagem, e.args, getLocale(), null, e.cor)
        }

        response.put('apontamentoResponseDTO',
                apontamentoService.inserirDadosOFNaResponse(
                        codigoOF,
                        Recurso.get(recursoId),
                        getOrganizacaoLogada(),
                        !response.isEmpty(),
                        true))
        respond response
    }

    @Override
    save() {
        params.putAll(getParametros())

        Recurso recurso = Recurso.get(params.recurso)
        Defeito defeito = Defeito.get(params.defeito)
        Impressora impressora = Impressora.get(params.long('impressora'))
        Boolean enviarApoio = params.apoio
        List dadosRastreaveis = params.camposRastreaveis

        def response = [:]


        if (params.boolean('apontarOF')) {
            try {
                List defeitos = params.defeitos
                OrdemDeFabricacao ordemDeFabricacao = OrdemDeFabricacao.getByCodigo(params.serial, getFornecedorLogado())
                apontamentoService.salvarApontamentoOF(ordemDeFabricacao, recurso, dadosRastreaveis, defeitos)
                response = crudService.montaMensagemDeRespostaCompleta(TipoMensagem.SUCCESS_TYPE, 'default.created.message', null, getLocale())

            } catch (ApontamentoException ex) {
                response = crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, ex.mensagem, ex.args, getLocale(), null, ex.cor)
            }

            response.put('apontamentoResponseDTO',
                    apontamentoService.inserirDadosOFNaResponse(params.serial,
                            recurso,
                            getOrganizacaoLogada(),
                            true,
                            false)
            )
        } else {
            String serial = params.serial
            try {
                SerialFabricacao serialFabricacao = apontamentoService.getSerialFabricacao(serial)
                Apontamento apontamento = apontamentoService.salvarApontamento(serialFabricacao, recurso, defeito, getOrganizacaoLogada(), false, enviarApoio, null, dadosRastreaveis)
                GrupoRecurso proximoProcesso = apontamento.processoAtual?.grupoRecurso

                String message = 'default.created.message'
                Object[] argumentos = null
                TipoMensagem tipoMensagem = TipoMensagem.SUCCESS_TYPE

                if (enviarApoio) {
                    message = 'apontamento.enviadoApoio.message'
                } else if (apontamento && apontamentoService.getSerialFabricacao(serial).isPendenteApoio()) {
                    message = 'apontamento.quantidadeMaximaAlcancadaEnviarParaApoio.message'
                    tipoMensagem = TipoMensagem.WARNING_TYPE
                } else if (proximoProcesso) {
                    message = 'apontamento.salvar.proximoProcesso.message'
                    argumentos = [proximoProcesso.nome]
                }

                response = crudService.montaMensagemDeRespostaCompleta(tipoMensagem, message, argumentos, getLocale())

                response.put('apontamentoResponseDTO',
                        new ApontamentoResponseDTO(proximoProcesso: proximoProcesso?.nome, reprocesso: defeito != null))
                response.etiquetaImpressa = serialFabricacao?.lote?.isFechado() || serialFabricacao?.getCaixaImpressao()?.isFechado()

            } catch (ApontamentoException ex) {
                response = crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, ex.mensagem, ex.args, getLocale(), null, ex.cor)
            }

            response.put('apontamentoResponseDTO',
                    apontamentoService.inserirDadosSerialNaResponse(serial,
                            recurso,
                            getOrganizacaoLogada(),
                            true,
                            false)
            )
        }

        respond response
    }

    def gerarEtiqueta() {
        def model = [:]

        SerialFabricacao serialFabricacao = apontamentoService.getSerialFabricacao(params.serial as String)
        Impressora impressora = Impressora.get(params.long('impressora'))
        Long idRecurso = params.long('recurso')
        List<ImpressaoApontamentoLote> impressoes = apontamentoService.getImpressoes(serialFabricacao, idRecurso)
        List etiqueta = apontamentoService.getEtiquetas(serialFabricacao, impressora, impressoes)
        model.put("etiqueta", etiqueta)
        respond model
    }

    def getDadosApontamentoPorRecurso() {
        def model = [:]

        Long recursoId = (params.recursoId) as Long

        Recurso recurso = Recurso.get(recursoId)
        def criteriaGrupo = GrupoRecurso.createCriteria()
        Set<GrupoRecurso> gruposRecursos = criteriaGrupo.list({ recursos { eq('id', recursoId) } })
        List<Defeito> defeitos = gruposRecursos*.defeitos.flatten()

        List<Impressora> impressoras = new ArrayList<>()

        boolean temEtiquetas = apontamentoService.existemEtiquetasParaORecurso(recursoId)
        if (temEtiquetas) {
            impressoras = Impressora.findAllByFornecedor(getFornecedorLogado())
        }

        Integer tempoMaximoSemApontamento = gruposRecursos.max({ it.tempoMaximoSemApontamento })?.tempoMaximoSemApontamento

        model.put("defeitos", defeitos.findAll { it.isAtivo })
        model.put("impressoras", impressoras)
        model.put("tempoMaximoSemApontamento", tempoMaximoSemApontamento)
        model.put("ultimoApontamento", recurso.getUltimoApontamento()?.getTime())

        respond model

    }

    def verificarParada() {
        Recurso recurso = Recurso.get(params.recursoId)
        GrupoRecursoParadaDTO ultimoApontamento = recursoService.criarParadaInicial(recurso)

        GrupoRecurso grupoRecurso = GrupoRecurso.get(ultimoApontamento?.idGrupoRecurso)

        Set<MotivoDeParada> motivos = grupoRecurso?.getMotivosDeParada()
        if (!motivos) {
            List<GrupoRecurso> grupos = GrupoRecurso.createCriteria().list {
                recursos {
                    eq "id", recurso.id
                }
            }
            motivos = grupos*.motivosDeParada.flatten()
        }

        def model = [:]
        model.put("parada", ultimoApontamento?.parada)
        model.put("motivos", motivos.findAll { it.isAtivo }?.sort { it.motivo } as List)
        respond model
    }

    def setarMotivoParada() {
        params.putAll(getParametros())
        Parada parada = Parada.get(params.paradaId)

        if (!parada.recurso.isParado()) {
            render status: 409, crudService.montaMensagemDeResposta(TipoMensagem.INFO_TYPE, 'apontamento.recursoNaoEstaParado.message', getLocale()) as JSON
        } else {
            MotivoDeParada motivo = MotivoDeParada.get(params.motivoId)
            Recurso recurso = parada.recurso
            Date dataApontamentoAtual = new Date()
            Date dataUltimoApontamento = parada.inicio

            apontamentoService.quebrarParadasPorTurnos(parada, recurso, motivo, dataUltimoApontamento, dataApontamentoAtual, getFornecedorLogado())

            def model = [:]
            model.put("ultimoApontamento", parada.recurso.getUltimoApontamento()?.getTime())
            respond model
        }
    }

    def pararRecurso() {
        params.putAll(getParametros())
        Recurso recurso = Recurso.get(params.recursoId)

        if (recurso.isParado()) {
            if (params.boolean("acaoDoUsuario")) {
                render status: 409, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'apontamento.recursoJaParado.message', getLocale()) as JSON
            } else {
                render "OK"
            }
            return
        }

        Parada parada = new Parada()
        parada.inicio = new Date()
        parada.recurso = recurso
        crudService.salvar(parada)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'apontamento.recursoParado.message', getLocale()) as JSON
    }

    def verificarUsuario() {
        params.putAll(getParametros())
        String name = params.name
        String password = params.password
        String token = params.token
        String serial = params.serial
        Recurso recurso = Recurso.get(params.recurso)
        Defeito defeito = Defeito.get(params.defeito)

        if (token || (name && password)) {
            String encodedPass = springSecurityService.encodePassword(password)
            User userSupervisor = name ? User.findByUsernameAndPassword(name, encodedPass) : User.findByTokenIlike(token)
            if (userSupervisor) {
                if (userSupervisor.isSupervisor()) {
                    def model = [:]
                    SerialFabricacao serialFabricacao = apontamentoService.getSerialFabricacao(serial)
                    apontamentoService.salvarApontamento(serialFabricacao, recurso, defeito, getOrganizacaoLogada(), true, false, null, null)
                    apoioService.sucatearSerial(serialFabricacao)

                    model.put('messages', crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'apontamento.serialSucateado.message.message', getLocale()).messages)
                    model.put('apontamentoResponseDTO',
                            apontamentoService.inserirDadosSerialNaResponse(
                                    serialFabricacao.getCodigoCompleto(),
                                    recurso,
                                    getOrganizacaoLogada(),
                                    true,
                                    false))

                    respond model
                } else {
                    respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'apontamento.usuarioInvalido.message', getLocale())
                }
            } else {
                respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'apontamento.usuarioInexistente.message', getLocale())
            }
        } else {
            respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'apontamento.loginUsuarioInvalido.message', getLocale())
        }
    }

    def loteException(LoteException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }
}

