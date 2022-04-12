package br.com.furukawa.controller

import br.com.furukawa.enums.Status
import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.GrupoRecursoException
import br.com.furukawa.exceptions.LinhaDeProducaoException
import br.com.furukawa.model.Defeito
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.ProcessoLinhaDeProducao
import br.com.furukawa.model.ReprocessoLinhaDeProducao
import br.com.furukawa.service.GrupoRecursoService
import br.com.furukawa.service.LinhaDeProducaoService
import grails.converters.JSON

class LinhaDeProducaoController extends CrudController {

    LinhaDeProducaoController() {
        super(LinhaDeProducao)
    }

    LinhaDeProducaoService linhaDeProducaoService

    GrupoRecursoService grupoRecursoService

    @Override
    Object index() {
        String nome = params.nome
        String grupoRecurso = params.grupoRecurso
        Fornecedor fornecedor = getFornecedorLogado()
        int max = Math.min(params.int('max') ?: 10, 100)
        int offset = params.int("offset")
        String order = params.order
        String sort = params.sort
        String status = params.status ?: Status.ATIVO.name()
        def entities = linhaDeProducaoService.listaUltimaVersao(nome, grupoRecurso, fornecedor, status, max, offset, sort, order)
        Integer total = linhaDeProducaoService.getTotalLinhasUltimaVersao(nome, grupoRecurso, fornecedor, status, sort, order)

        def model = [:]

        model.put('entities', entities)
        model.put("total", total)

        respond model
    }

    def getModelPadrao() {
        def model = [:]
        List<GrupoRecurso> grupos = GrupoRecurso.findAllByFornecedorAndIsAtivo(getFornecedorLogado(), true)
        LinhaDeProducao entityInstance = entity.get(params.id)

        if(entityInstance) {
            grupos += entityInstance.processos*.grupoRecurso
        }
        model.put("listGrupoRecurso", grupos.sort {it.nome.toUpperCase()})
        return model
    }

    @Override
    def prepareNew() {
        def model = getModelPadrao()
        model["entityInstance"] = entity.newInstance(params)
        respond model
    }

    @Override
    def save() {
        params.putAll(getParametros())

        LinhaDeProducao instance = getInstanceEntity() as LinhaDeProducao
        beforeSave(instance)

        instance.versao = 1

        ProcessoLinhaDeProducao primeiroProcesso = instance.getPrimeiroProcesso()

        List <Long> recursos = primeiroProcesso.grupoRecurso.recursos*.id

        grupoRecursoService.validaRecursos(getFornecedorLogado(), recursos, primeiroProcesso.grupoRecursoId)

        crudService.salvar(instance)

        linhaDeProducaoService.criaReferenciaLinhaDeProducaoNoGrupoRecurso(primeiroProcesso, instance)

        afterSave(instance)
    }

    @Override
    def prepareEdit() {
        LinhaDeProducao entityInstance = entity.get(params.id)
        if (entityInstance == null) {
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.not.found.message", getLocale()) as JSON
            return
        }

        Integer ultimaVersao = LinhaDeProducao.createCriteria().get {
            eq('nome', entityInstance.nome)
            eq('fornecedor', entityInstance.fornecedor)

            projections {
                max('versao')
            }
        }

        def model = getModelPadrao()
        model.put('isUltimaVersao', ultimaVersao == entityInstance.versao)
        model.put('entityInstance', entityInstance)
        respond model
    }

    def getInstanceEntity() {
        def entityInstance
        if (params.id) {
            entityInstance = entity.get(params.id)
            LinhaDeProducao linhaDeProducao = new LinhaDeProducao()

            linhaDeProducao.nome = entityInstance.nome
            linhaDeProducao.fornecedor = getFornecedorLogado()
            params.processos.each { processo ->
                ProcessoLinhaDeProducao clone = ProcessoLinhaDeProducao.newInstance()
                clone.ordem = processo.ordem
                clone.grupoRecurso = GrupoRecurso.get(processo.grupoRecurso)
                clone.numeroMaximoDeApontamentos = processo.numeroMaximoDeApontamentos

                processo.reprocessos.each { reprocesso ->
                    ReprocessoLinhaDeProducao cloneReprocesso = ReprocessoLinhaDeProducao.newInstance()
                    cloneReprocesso.defeito = Defeito.get(reprocesso.defeito)
                    cloneReprocesso.ordemProcessoRetorno = reprocesso.ordemProcessoRetorno
                    clone.addToReprocessos(cloneReprocesso)
                }
                linhaDeProducao.addToProcessos(clone)
            }

            return  linhaDeProducao
        } else {
            entityInstance = entity.newInstance(params)
        }

        if( entityInstance.hasProperty( 'organizacao' ) ){
            entityInstance.organizacao = getOrganizacaoLogada()
        }

        setCollettions(entityInstance)

        setAlteracoesEspecificas( entityInstance )

        entityInstance
    }

    @Override
    def update() {
        params.putAll(getParametros())

        LinhaDeProducao instance = getInstanceEntity() as LinhaDeProducao
        beforeSave(instance)

        Long ultimaVersao = LinhaDeProducao.createCriteria().get {
            eq('nome', instance.nome)
            eq('fornecedor', instance.fornecedor)

            projections {
                max('versao')
            }
        }
        instance.nome = params.nome
        if(ultimaVersao != LinhaDeProducao.get(params.long('id')).versao) {
            respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'linhaDeProducao.linhaNaoEhUltimaVersao.message', getLocale())
        } else {
            instance.versao = ultimaVersao + 1
            ProcessoLinhaDeProducao primeiroProcesso = instance.getPrimeiroProcesso()

            List <Long> recursos = primeiroProcesso.grupoRecurso.recursos.id

            grupoRecursoService.validaRecursos(getFornecedorLogado(), recursos, primeiroProcesso.grupoRecursoId)

            linhaDeProducaoService.validacao(params.long('id'), primeiroProcesso)

            crudService.salvar(instance)
            linhaDeProducaoService.referenciarNovasVersoes(LinhaDeProducao.get(params.long('id')), instance)
            GrupoRecurso grupoRecurso = GrupoRecurso.findById(primeiroProcesso.grupoRecurso.id)
            if (grupoRecurso.primeiroDaLinha == null) {
                linhaDeProducaoService.atualizaReferenciaLinhaDeProducaoNoGrupoRecurso(params.long('id'), instance.id, grupoRecurso)
            } else {
                grupoRecurso.primeiroDaLinha = instance.id
                crudService.salvar(grupoRecurso)
            }

            afterSave(instance)
        }
    }

    def afterSaveEdit() {
        def entityInstance = entity.get(params.id)

        Long ultimaVersao = LinhaDeProducao.createCriteria().get {
            eq('nome', entityInstance.nome)
            eq('fornecedor', entityInstance.fornecedor)

            projections {
                max('versao')
            }
        }

        LinhaDeProducao instanceUltimaVersao = LinhaDeProducao.findByVersaoAndNomeAndFornecedorAndAtivo(ultimaVersao, entityInstance.nome, entityInstance.fornecedor, true)

        def model = [:]
        model.put("entityInstance", instanceUltimaVersao)
        respond model
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.processos.each { processo ->
            processo.reprocessos.each { reprocesso ->
                reprocesso.processoOrigem = processo
            }
        }
        entityInstance.fornecedor = getFornecedorLogado()
    }

    @Override
    def delete() {
        if (handleReadOnly()) {
            return
        }

        def instance = entity.get(params.id)

        LinhaDeProducao versaoAnterior = LinhaDeProducao.findByVersaoAndNomeAndFornecedorAndAtivo(instance.versao - 1, instance.nome, instance.fornecedor, true)
        if(versaoAnterior == null){
            ProcessoLinhaDeProducao primeiroGrupoRecurso = instance.processos.find { it.ordem == 0 }
            GrupoRecurso grupoRecurso = GrupoRecurso.get(primeiroGrupoRecurso.grupoRecurso.id)
            grupoRecurso.primeiroDaLinha = null
        } else {
            ProcessoLinhaDeProducao primeiroGrupoRecurso = versaoAnterior.processos.find { it.ordem == 0 }
            GrupoRecurso grupoRecurso = GrupoRecurso.get(primeiroGrupoRecurso.grupoRecurso.id)
            grupoRecurso.primeiroDaLinha = versaoAnterior.id
        }

        if (instance == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        beforeDelete()

        if (instance.hasProperty("isRemovivel") && instance.isRemovivel == false) {
            respond crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'default.denied.delete.message', getLocale())
        } else {
            String message = linhaDeProducaoService.deletarLdp(instance as LinhaDeProducao)
            respond crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, message, getLocale())
        }
    }

    @Override
    def ativarOuDesativar() {
        try {
            params.putAll(getParametros())
            if(params.id) {
                def instance = entity.get(params.id)
                instance.ativo = !instance.ativo
                crudService.salvar(instance)
                afterSave(instance)
            }else{
                render status: 400, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.badRequest.message", getLocale()) as JSON
            }
        }catch(e){
            render status: 500, crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, "default.erroDefault.message", getLocale()) as JSON
        }
    }

    def linhaDeProducaoException(LinhaDeProducaoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def grupoRecursoException(GrupoRecursoException exception) {
        respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, exception.mensagem, exception.args, getLocale())
    }

    def buscarLinhaProducaoPorNome() {
        Map model = [:]
        String nome = params.nome
        List<LinhaDeProducao> linhas = LinhaDeProducao.findAllByNomeAndFornecedorAndAtivo(nome as String, getFornecedorLogado(), true, [sort: 'versao', order: 'desc'])
        Long maxVersao = linhas.max {it.versao}.versao


        model.put("linhasProducao", linhas.findAll {it.versao != maxVersao})

        respond model
    }

    def restaurarLinhaProducao() {
        params.putAll(getParametros())
        LinhaDeProducao linha = LinhaDeProducao.get(params.id as Long).clonar()

        if (linha) {
            linhaDeProducaoService.restaurarLinhaProducao(linha)

            GrupoRecurso grupoRecursoNovaVersao = linha.primeiroProcesso.grupoRecurso
            if(grupoRecursoNovaVersao) {
                grupoRecursoNovaVersao.primeiroDaLinha = linha.id
                crudService.salvar(grupoRecursoNovaVersao)
            }
            respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.SUCCESS_TYPE, "linhaDeProducao.restaurado.message", [linha.nome] as Object[], getLocale())
        } else {
            respond crudService.montaMensagemDeRespostaCompleta(TipoMensagem.ERROR_TYPE, "default.not.found.message", [] as Object[], getLocale())
        }
    }
}
