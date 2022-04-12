package br.com.furukawa.model

class LoteQuantidadeRecebimento {
    String codigoLote
    Long quantidade

    static belongsTo = [recebimento: RecebimentoNF]

    static constraints = {
    }

    static mapping = {
        table 'gp40.lote_quantidade_recebimento'
    }
}
