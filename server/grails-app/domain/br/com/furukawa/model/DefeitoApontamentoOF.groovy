package br.com.furukawa.model

class DefeitoApontamentoOF {
    Defeito defeito
    Integer quantidade

    static belongsTo = [apontamentoOF: ApontamentoOrdemDeFabricacao]

    static constraints = {
        id generator: 'sequence', params: [sequence: 'defeito_apont_of_seq']
    }

    static mapping = {
        table 'defeito_apontamento_of'
    }
}
