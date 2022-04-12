package br.com.furukawa.service

import br.com.furukawa.model.TempoApontamentoProduto
import grails.gorm.transactions.Transactional

@Transactional
class TempoApontamentoProdutoService {

    void atualizarTempos(List<TempoApontamentoProduto> tempos, int tempo, boolean todos) {
        if (todos){ // atualizar sem encerrar vigencia
            tempos.each {tempoApontamento ->
                List<TempoApontamentoProduto> mesmos = TempoApontamentoProduto.findAllByGrupoRecursoAndCodigoProduto(tempoApontamento.grupoRecurso, tempoApontamento.codigoProduto)
                mesmos.each {
                    it.tempoApontamento = tempo
                    it.save(flush: true, failOnError: true)
                }
            }
        } else { // encerrar vigencia e criar novas
            tempos.each { tempoApontamento ->
                tempoApontamento.vigenciaAte = new Date()
                tempoApontamento.save(flush: true, failOnError: true)
            }
            tempos.each { tempoApontamento ->
                TempoApontamentoProduto clone = tempoApontamento.clone()
                clone.vigenciaDe = new Date()
                clone.vigenciaAte = null
                clone.tempoApontamento = tempo
                clone.save(flush: true, failOnError: true)
            }
        }
    }
}
