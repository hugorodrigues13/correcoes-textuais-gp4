package br.com.furukawa.model

import br.com.furukawa.service.OracleService

class ServicoRomaneio {
    String codigo
    String unidade
    Long quantidade
    BigDecimal valorUnitario
    BigDecimal valorTotal
    Lote lote

    OracleService oracleService

    static hasMany = [produtos: ProdutoRomaneio]

    static belongsTo = [romaneio: Romaneio]

    static transients = ['descricao', 'oracleService']

    static constraints = {
        lote nullable: true
    }

    static mapping = {
        table 'servico_romaneio'
        id generator: 'sequence', params: [sequence: 'servico_romaneio_seq']
        produtos cascade: "all-delete-orphan"
        autowire true
    }

    String getDescricao() {
        return (lote ? "GP4.0 LOTE ${lote?.codigoLote} - " : "") + oracleService.getDescricaoDoProduto(codigo, getOrganizacao())
    }

    Organizacao getOrganizacao() {
        return romaneio.organizacaoRomaneio
    }

    Integer getVolume() {
        return produtos?.sum {it?.volume} as Integer
    }
}
