package br.com.furukawa.model

import br.com.furukawa.enums.TipoLogOperacao

import java.text.SimpleDateFormat

class LogOperacao {

    private static final SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy HH:mm")

    TipoLogOperacao tipoLogOperacao

    String usuario

    Date data = new Date()

    static hasMany = [parametros: ParametroLogOperacao]

    static constraints = {
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'log_operacao_seq']
    }

    String getDataFormatada(){
      return SDF.format(data)
    }

}
