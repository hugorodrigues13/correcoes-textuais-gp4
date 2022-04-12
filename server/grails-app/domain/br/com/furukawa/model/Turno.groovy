package br.com.furukawa.model

import br.com.furukawa.utils.Audit
import br.com.furukawa.enums.DiaDaSemana

class Turno extends Audit {

    String nome

    static hasMany = [duracoes: TurnoDuracao]
    static belongsTo = [fornecedor: Fornecedor]

    static constraints = {
        nome unique: ['fornecedor']
    }

    static mapping = {
        table 'gp40.turno'
        id generator: 'sequence', params: [sequence: 'gp40.turno_seq']
        duracoes cascade: "all-delete-orphan"
    }

    List<DiaDaSemana> getDiasDaSemana(){
        return duracoes*.dias.flatten().unique()
    }

}
