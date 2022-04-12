package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class Defeito extends Audit {

    String nome
    Fornecedor fornecedor
    Boolean isAtivo = true

    static constraints = {
        fornecedor nullable: true
        nome unique: ['fornecedor']
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'defeito_seq']
    }

    List<GrupoRecurso> getGrupos() {
        return GrupoRecurso.createCriteria().list {
            defeitos {
                eq('id', this.id)
            }
        } as ArrayList<GrupoRecurso>
    }
}
