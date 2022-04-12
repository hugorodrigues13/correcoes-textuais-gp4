package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class ProdutoEtiqueta extends Audit {
    String codigoProduto
    Integer quantidadeDeEtiquetas //quantidade
    Integer quantidadePorImpressao //copias
    Boolean serial = false

    Fornecedor fornecedor

    static hasMany = [etiquetas: String, grupos: GrupoRecurso]

    static constraints = {
        quantidadeDeEtiquetas nullable: true
        quantidadePorImpressao nullable: true
        codigoProduto validator: {codigo, etiqueta, errors ->
            boolean duplicado = ProdutoEtiqueta.findAllByCodigoProdutoAndIdNotEqualAndFornecedor(codigo, etiqueta.id, etiqueta.fornecedor)
                    .any({ outros -> outros.grupos.any({ grupo -> etiqueta.grupos.any({ outroGrupo -> outroGrupo.id == grupo.id }) }) }) // não pode ter qualquer Grupo de Recurso em comum
            if (duplicado){
                errors.rejectValue('codigoProduto' ,'unique')
            }
        }
        serial validator: {serial, etiqueta, errors ->
            if (serial){
                boolean duplicado = ProdutoEtiqueta.findAllByCodigoProdutoAndIdNotEqualAndSerialAndFornecedor(etiqueta.codigoProduto, etiqueta.id, true, etiqueta.fornecedor)
                if (duplicado){
                    errors.rejectValue('serial' ,'unique')
                }
            }
        }
    }

    static mapping = {
        etiquetas  joinTable: [name: 'etiqueta_produto',
                              key: 'produto_etiqueta_id', column: 'codigo_etiqueta']
        grupos  joinTable: [name: 'etiqueta_grupo_recurso',
                              key: 'produto_etiqueta_id', column: 'grupo_recurso_id']
    }
}
