package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Conector

class ConectorController extends CrudController{

    ConectorController() {
        super(Conector)
    }
    def query = {
        if (params.descricao){
            tLike('descricao', '%' + params.descricao + '%', delegate)
        }

        if(params.linhaForecast){
            tLike('linha_forecast', '%' + params.linhaForecast + '%', delegate)
        }

        if(params.formacao){
            tLike('formacao', '%' + params.formacao + '%', delegate)
        }

        if(params.sort){
            order(params.sort, params.order)
        }else{
            order( 'descricao' )
        }
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        params.offsetBusca = params.offsetBusca?:0
        def criteria = Conector.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)
        def model = [:]

        model.put("entities", entities)
        model.put("total", entities.totalCount)

        respond model
    }

    @Override
    def delete() {
        if (handleReadOnly()) {
            return
        }

        def instance = entity.get(params.id)
        if (instance == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        beforeDelete()

        if (instance.hasProperty("isRemovivel") && instance.isRemovivel == false) {
            respond crudService.montaMensagemDeResposta(TipoMensagem.WARNING_TYPE, 'default.denied.delete.message', getLocale())
        } else {
            if (crudService.excluir(instance)){
                respond crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.deleted.message', getLocale())
            } else {
                respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'conector.errorDelete.message', getLocale())
            }
        }
    }
}