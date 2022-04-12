package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Acesso
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.Organizacao

class AcessoController extends CrudController {
    def query = {
        if(params.nome) {
            tLike("nome", "%" + params.nome + "%", delegate)
        }

        if(params.organizacao) {
            organizacoes {
                eq("organizationID", params.organizacao)
            }
        }

        if( params.fornecedor ) {
            fornecedores {
                eq("id", params.long('fornecedor'))
            }
        }

        if( params.sort ){
            order(params.sort, params.order)
        }else{
            order( 'nome' )
        }
    }

    AcessoController() {
        super(Acesso)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10,100)
        def criteria = Acesso.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def model = [:]

        model.put('entities', entities)
        model.put("listFornecedor", Fornecedor.list())
        model.put("listOrganizacao", Organizacao.list())
        model.put("total", entities.totalCount)

        respond model
    }

    @Override
    def editaModelPrepareNew(def model) {
        model.put("listFornecedor", Fornecedor.list())
        model.put("listOrganizacao", Organizacao.list())

        return model
    }

    @Override
    def editaModelPrepareEdit(def model) {
        model.put("listFornecedor", Fornecedor.list())
        model.put("listOrganizacao", Organizacao.list())

        return model
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
                respond crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, 'acesso.errorDelete.message', getLocale())
            }
        }
    }
}
