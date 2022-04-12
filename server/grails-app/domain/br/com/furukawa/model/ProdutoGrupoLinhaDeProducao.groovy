    package br.com.furukawa.model

class ProdutoGrupoLinhaDeProducao {
    String codigo
    String roteiro
    Integer quantidadePorPallet

    static belongsTo = [grupoLinha: GrupoLinhaDeProducao]

    static constraints = {
        roteiro nullable: true
        quantidadePorPallet nullable: true
    }

    static mapping = {
        table 'produto_grupo_linha'
        id generator: 'sequence', params: [sequence: 'produto_grupo_linha_seq']
    }

    Integer getQuantidadePorPallet() {
        return quantidadePorPallet
    }

    Boolean isAgrupamento() {
        return quantidadePorPallet && quantidadePorPallet > 0
    }

}
