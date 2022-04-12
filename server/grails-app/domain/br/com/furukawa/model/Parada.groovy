package br.com.furukawa.model

class Parada {

    MotivoDeParada motivo
    Date inicio, fim

    static belongsTo = [recurso: Recurso]

    static constraints = {
        fim nullable: true
        motivo nullable: true
    }

    static mapping = {
        table 'paradas'
        id generator: 'sequence', params: [sequence: 'paradas_seq']
    }

    boolean isAtivo(){
        Date agora = new Date()
        return this.fim == null || (agora >= inicio && agora <= fim)
    }

}
