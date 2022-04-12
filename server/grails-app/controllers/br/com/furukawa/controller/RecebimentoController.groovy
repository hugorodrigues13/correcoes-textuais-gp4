package br.com.furukawa.controller

import br.com.furukawa.enums.StatusTransacaoRecebimento
import br.com.furukawa.model.RecebimentoNF
import br.com.furukawa.utils.DateUtils

class RecebimentoController extends CrudController {
    def query = {
        if(params.ordemDeProducao) {
            tLike("ordem_De_Producao", "%" + params.ordemDeProducao + "%", delegate)
        }

        if(params.interfaceTransactionId) {
            tLike("interface_Transaction_ID", "%" + params.interfaceTransactionId + "%", delegate)
        }

        if(params.notaFiscal) {
            tLike("nota_Fiscal", "%" + params.notaFiscal + "%", delegate)
        }

        if (params.erro && params.erro != 'TODOS'){
            if (params.erro == 'COM_ERRO'){
                gt 'version', 10L
                ne 'status', StatusTransacaoRecebimento.CONCLUIDA
                ne 'isConcluirManualmente', true
            }
        }

        if (params.status && params.status != 'TODOS'){
            eq 'status', StatusTransacaoRecebimento.valueOf(params.status)
        }

        order( 'dataUltimaAtualizacao', "desc" )

        ilike('ordemDeProducao', getFornecedorLogado()?.prefixoProducao+"%")
    }

    RecebimentoController() {
        super(RecebimentoNF)
    }

    @Override
    Object index() {
        params.max = Math.min(params.int('max') ?: 10, 100)
        def criteria = RecebimentoNF.createCriteria()
        def entities = criteria.list(query, max: params.max, offset: params.offset)

        def model = [:]

        model.put('entities', entities)
        model.put("total", entities.totalCount)

        respond model
    }

    def concluirManualmente() {
        params.putAll(getParametros());

        RecebimentoNF recebimento = RecebimentoNF.findById(params.long('id'));
        recebimento.isConcluirManualmente = true;
        if (recebimento.errors.allErrors.size() > 0 || !recebimento.validate()) {
            print recebimento.errors
            render status: 422, crudService.montaListaDeErrors(recebimento.errors.allErrors, getLocale())
            return
        } else {
            crudService.salvar(recebimento);
            render status: 200;
            return
        }
    }
}
