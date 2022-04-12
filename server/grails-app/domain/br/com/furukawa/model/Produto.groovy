package br.com.furukawa.model

class Produto {
    Long inventoryItemId
    String codigo
    String descricao
    String codigoEAN13
    String statusCode
    String tipo
    Long organizationId
    BigDecimal peso
    BigDecimal pesoEmbalagem
    String plannerCode

    static hasMany = [codigosDUN: CodigoDUN]

    static constraints = {
        codigoEAN13 nullable: true
        peso nullable: true
        pesoEmbalagem nullable: true
    }

    static mapping = {
        table 'gp40.produto'
        codigoEAN13 column: 'codigo_ean_13'
        id generator: 'sequence', params: [sequence: 'produto_seq']
        codigosDUN cascade: 'all-delete-orphan'
    }
}
