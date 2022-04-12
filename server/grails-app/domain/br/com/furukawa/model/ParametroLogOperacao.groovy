package br.com.furukawa.model

import br.com.furukawa.enums.TipoParametroLogOperacao

class ParametroLogOperacao {

    String valor

    TipoParametroLogOperacao tipo

    static belongsTo = [logOperacao : LogOperacao ]

    static mapping = {
        id generator: 'sequence', params: [sequence: 'parametro_log_operacao_seq']
    }

}
