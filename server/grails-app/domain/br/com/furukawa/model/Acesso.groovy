package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class Acesso extends Audit implements Serializable {
    private static final long serialVersionUID = 1

    String nome

    static hasMany = [fornecedores: Fornecedor, organizacoes: Organizacao]

    static constraints = {
        fornecedores nullable: true
        nome unique: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'acesso_seq']
        organizacoes lazy: false, joinTable: [name: 'acesso_organizacao', key: 'acesso_id', column: 'organizacao_id']
        fornecedores lazy: false, joinTable: [name: 'acesso_fornecedor', key: 'acesso_id', column: 'fornecedor_id']
    }
}
