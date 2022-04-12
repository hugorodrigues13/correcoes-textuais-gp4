package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class Conector extends Audit {

    String descricao
    String linhaForecast
    Integer formacao

    static constraints = {

    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'processo_lp_seq']
    }
}
