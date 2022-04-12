package br.com.furukawa.controller

import br.com.furukawa.enums.DiaDaSemana
import br.com.furukawa.model.Turno
import br.com.furukawa.model.TurnoDuracao
import br.com.furukawa.utils.OrderBySqlFormula

import java.text.SimpleDateFormat

class TurnoController extends CrudController{

    TurnoController() {
        super(Turno)
    }

    def query = {
        if (params.turno){
            turno {
                ilike "nome", "%${params.turno}%"
            }
        }
        if (params.duracaoFinal){
            between "duracao", TurnoDuracao.SDF.parse(params.duracaoInicial), TurnoDuracao.SDF.parse(params.duracaoFinal)
        }
        if (params.horarioFinalInicial){
            between "horarioFinal", TurnoDuracao.SDF.parse(params.horarioFinalInicial), TurnoDuracao.SDF.parse(params.horarioFinalFinal)
        }
        if (params.dias){
            createAlias('dias', 'e')
            eq("e.elements", DiaDaSemana.valueOf(params.dias))
        }
        if(params.horarioInicialInicial) {
            sqlRestriction """
                horario_final - duracao BETWEEN
                      ${TurnoDuracao.montaSQLDeIntervalo(params.horarioInicialInicial as String)}
                      AND
                      ${TurnoDuracao.montaSQLDeIntervalo(params.horarioInicialFinal as String)}
                """
        }

        turno {
            eq 'fornecedor', getFornecedorLogado()
        }

        if (params.sort){
            if (params.sort == 'turno'){
                turno {
                    order('nome', params.order)
                }
            } else if(params.sort == 'horarioInicial') {
                order OrderBySqlFormula.from("""
                   CASE
                     WHEN interval '0' day <= ( horario_final - duracao ) THEN (
                     horario_final - duracao )
                     ELSE interval '24' hour + ( horario_final - duracao )
                   END ${params.order} 
            """)
            } else {
                order(params.sort, params.order)
            }
        } else {
            turno {
                order('nome', 'asc')
            }
        }
    }

    def index() {
        params.max = Math.min(params.int('max') ?: 10,100)

        def entities = TurnoDuracao.createCriteria()
                .list(query, max: params.max, offset: params.offset)

        def model = [:]
        model.put('entities', entities)
        model.put('total', entities.totalCount)
        model.put('dias', DiaDaSemana.values() as List)

        respond model
    }

    @Override
    def getModelPadrao() {
        def model = [:]
        model.put('dias', DiaDaSemana.values() as List)
        return model
    }

    @Override
    def getInstanceEntity() {
        params.duracoes.each {
            it.horarioFinal = TurnoDuracao.SDF.parse(it.horarioFinal)
            it.duracao = TurnoDuracao.SDF.parse(it.duracao)
        }

        return super.getInstanceEntity()
    }

    @Override
    def beforeSave(turno) {
        turno.fornecedor = getFornecedorLogado()
    }
}
