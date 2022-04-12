package br.com.furukawa.model

import br.com.furukawa.enums.Status
import br.com.furukawa.utils.Audit

class GrupoLinhaDeProducao extends Audit {

    String nome
    User usuario
    Boolean isAtivo = true
    static hasMany = [linhas: LinhaDeProducao, produtos: ProdutoGrupoLinhaDeProducao]

    Fornecedor fornecedor

    static constraints = {
        fornecedor nullable: true
        usuario nullable: true
        nome unique: ['fornecedor']
    }

    static mapping = {
        table 'grupo_linha_producao'
        id generator: 'sequence', params: [sequence: 'grupo_linha_producao_seq']
        linhas joinTable: [name: 'linha_grupo', key: 'grupo_id', column: 'linha_id']
        produtos lazy: false, cascade: "all-delete-orphan"
        linhas lazy: false
    }

    String linhasRetornadas(){
        return linhas.nome.sort().join(", ")
    }

    String codigosRetornados(){
        return produtos.codigo.sort().join(", ")
    }

    String getStatus() {
        return isAtivo ? Status.ATIVO.name() : Status.INATIVO.name()
    }

    static GrupoLinhaDeProducao getByOrdemDeProducao(OrdemDeProducao ordemDeProducao) {
        return createCriteria().get {
            createAlias "produtos", "prod"
            eq 'prod.codigo', ordemDeProducao.codigoProduto
            or {
                isNull 'prod.roteiro'
                if(!ordemDeProducao.roteiro) {
                    eq 'prod.roteiro', '00'
                }
                eq 'prod.roteiro', ordemDeProducao.roteiro
            }

            eq 'fornecedor', ordemDeProducao.fornecedor
        } as GrupoLinhaDeProducao
    }
}
