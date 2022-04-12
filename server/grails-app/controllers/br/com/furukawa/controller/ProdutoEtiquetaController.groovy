package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.exceptions.RelatorioException
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.ProdutoEtiqueta
import br.com.furukawa.service.RelatorioService
import grails.converters.JSON

class ProdutoEtiquetaController extends CrudController {

    RelatorioService relatorioService

    def query = {
        if( params.codigoProduto ) {
            tLike("codigo_produto", "%" + params.codigoProduto + "%", delegate)
        }

        if( params.etiqueta ) {
            createAlias('etiquetas', 'e')
            ilike("e.elements", '%' + params.etiqueta + '%')
        }

        if( params.grupo ) {
            grupos {
                eq("id", params.long("grupo"))
            }
        }

        if(params.sort){
            order(params.sort, params.order)
        }else{
            order( 'codigoProduto' )
        }

        if (params.serial && params.serial != "TODOS"){
            boolean sim = params.serial == "SIM"
            if (sim){
                eq "serial", true
            } else {
                or {
                    eq "serial", false
                    isNull "serial"
                }
            }
        }

        eq('fornecedor', getFornecedorLogado())
    }

    ProdutoEtiquetaController() {
        super(ProdutoEtiqueta)
    }

    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = ProdutoEtiqueta.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def model =[:]
        model.put('entities', entities)
        model.put('total', entities.totalCount)
        model.put("listGrupoRecurso", GrupoRecurso.findAllByFornecedor(getFornecedorLogado()))
        respond model
    }


    @Override
    def editaModelPrepareNew(def model) {
        model.put("listGrupoRecurso", GrupoRecurso.findAllByFornecedorAndIsAtivo(getFornecedorLogado(), true))

        return model
    }

    @Override
    def editaModelPrepareEdit(def model) {
        model.put("listGrupoRecurso", GrupoRecurso.findAllByFornecedorAndIsAtivo(getFornecedorLogado(), true))

        return model
    }

    @Override
    def beforeSave(entityInstance) {
        entityInstance.fornecedor = getFornecedorLogado()
        if (entityInstance.serial){
            entityInstance.grupos?.clear()
        }
    }

    def relatorioEtiqueta() {
        try {
            def criteria = ProdutoEtiqueta.createCriteria()
            List<ProdutoEtiqueta> entities = criteria.list(query)
            File file = relatorioService.gerarRelatorioEtiqueta(entities as List<ProdutoEtiqueta>, params.serial as String, params.codigoProduto as String, params.etiquetas as String, params.quantidadeDeEtiquetas as String, params.quantidadePorImpressao as String, params.grupoRecursos as String, getLocale())
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
}
