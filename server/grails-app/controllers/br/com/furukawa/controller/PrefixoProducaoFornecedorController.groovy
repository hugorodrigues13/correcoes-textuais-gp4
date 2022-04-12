package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.OrdemDeProducao
import grails.converters.JSON
import grails.gorm.transactions.Transactional
import org.hibernate.NullPrecedence
import org.hibernate.criterion.Order

class PrefixoProducaoFornecedorController extends CrudController {
    PrefixoProducaoFornecedorController() {
        super(Fornecedor)
    }

    def query = {

        println(params)

        if(params.nome){
            tLike("nome", "%" + params.nome + "%", delegate)
        }

        if(params.prefixoProducao){
            tLike("prefixo_producao", "%" + params.prefixoProducao + "%", delegate)
        }

        if(params.endereco) {
            tLike("endereco", "%" + params.endereco + "%", delegate)
        }

        if(params.sort){
            if(params.order == 'asc' || params.order == '') {
                criteria.addOrder(Order.asc(params.sort).nulls(NullPrecedence.LAST))
            } else {
                criteria.addOrder(Order.desc(params.sort).nulls(NullPrecedence.LAST))
            }
        }

        eq('organizationId', crudService.getOrganizacaoLogada().organizationID.toLong())
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = Fornecedor.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def model = [:]

        model.put('entities', entities)
        model.put("total", entities.totalCount)

        respond model
    }

    @Override
    def prepareEdit() {
        def model = [:]
        Fornecedor entityInstance = Fornecedor.get(params.id as Long)
        if (entityInstance) {
            Integer ordens = OrdemDeProducao.countByFornecedor(entityInstance)
            model.put("entityInstance", entityInstance)
            model.put("desabilitarPrefixo", !!ordens)
            respond model
        } else{
            render status: 404, crudService.montaMensagemDeResposta(TipoMensagem.ERROR_TYPE, "default.not.found.message", getLocale()) as JSON
        }
    }

    @Override
    def update() {
        params.putAll(getParametros())
        def instance = getInstanceEntity()

        beforeSave(instance)

        if (instance.errors.allErrors.size() > 0 || !instance.validate()) {
            render status: 422, crudService.montaListaDeErrors(instance.errors.allErrors, getLocale()) as JSON
            return
        } else {
            crudService.salvar(instance)

            afterSave(instance)
        }
    }
}
