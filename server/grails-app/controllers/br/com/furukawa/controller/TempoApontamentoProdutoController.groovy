package br.com.furukawa.controller

import br.com.furukawa.enums.TipoMensagem
import br.com.furukawa.model.TempoApontamentoProduto
import br.com.furukawa.service.TempoApontamentoProdutoService
import grails.converters.JSON

import java.text.SimpleDateFormat

class TempoApontamentoProdutoController extends CrudController {

    TempoApontamentoProdutoService tempoApontamentoProdutoService

    TempoApontamentoProdutoController() {
        super(TempoApontamentoProduto)
    }

    def query = {
        if (params.codigoProduto){
            ilike "codigoProduto", "%${params.codigoProduto}%"
        }

        if (params.grupoRecurso){
            grupoRecurso {
                ilike "nome", "%${params.grupoRecurso}%"
            }
        }

        if (params.tempoApontamento){
            eq "tempoApontamento", params.tempoApontamento as int
        }

        if (params.status){
            if (params.status == "VIGENCIA"){
                isNull 'vigenciaAte'
            } else if (params.status == "NAO_VIGENCIA"){
                isNotNull 'vigenciaAte'
            }
        } else {
            isNull 'vigenciaAte'
        }

        if (params.vigenciaInicial){
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm")
            or {
                and {
                    ge "vigenciaDe", sdf.parse(params.vigenciaInicial)
                    le "vigenciaAte", sdf.parse(params.vigenciaFinal)
                }

                and {
                    isNull "vigenciaAte"
                    between "vigenciaDe", sdf.parse(params.vigenciaInicial), sdf.parse(params.vigenciaFinal)
                }
            }

        }

        grupoRecurso {
            eq 'fornecedor', getFornecedorLogado()
        }

        if (params.sort){
            order(params.sort, params.order)
        } else {
            order 'codigoProduto', 'asc'
        }
    }

    def index() {
        params.max = Math.min(params.int('max') ?: 10,100)

        def entities = TempoApontamentoProduto.createCriteria()
                .list(query, max: params.max, offset: params.offset)

        def model = [:]
        model.put('entities', entities)
        model.put('total', entities.totalCount)

        respond model
    }

    def editarTempo(){
        params.putAll(getParametros())
        List<Integer> ids = params.id
        List<TempoApontamentoProduto> tempos = TempoApontamentoProduto.getAll(ids)
        boolean todos = params.todos
        Integer tempo = (params.tempo as Integer) > 0 ? params.tempo : 1

        tempoApontamentoProdutoService.atualizarTempos(tempos, tempo, todos)

        render status: 200, crudService.montaMensagemDeResposta(TipoMensagem.SUCCESS_TYPE, 'default.updated.message', getLocale()) as JSON
    }


}
