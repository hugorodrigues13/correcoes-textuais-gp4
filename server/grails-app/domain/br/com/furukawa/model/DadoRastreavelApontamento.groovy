package br.com.furukawa.model

class DadoRastreavelApontamento {
    String nome
    String valor

    static belongsTo = [historico: HistoricoApontamento]

    static mapping = {
        table 'gp40.dado_rastreavel_apontamento'
        id generator: 'sequence', params: [sequence: 'dado_rastr_apont_seq']
    }
}
