package br.com.furukawa.model

class CodigoDUN {
    String codigo
    BigDecimal conversionRate
    String unidade
    static belongsTo = [produto: Produto]

    static constraints = {
        conversionRate nullable: true
        unidade nullable: true
    }

    static mapping = {
        table 'gp40.codigo_dun'
    }
}
