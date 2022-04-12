package br.com.furukawa.model

class DadoRastreavelApontamentoOF {
    String nome
    String valor

    static belongsTo = [apontamentoOF: ApontamentoOrdemDeFabricacao]

    static mapping = {
        table 'gp40.dado_rastreavel_apontamento_of'
        id generator: 'sequence', params: [sequence: 'dado_rastr_apont_of_seq']
        apontamentoOF column: 'apontamento_of_id'
    }
}
