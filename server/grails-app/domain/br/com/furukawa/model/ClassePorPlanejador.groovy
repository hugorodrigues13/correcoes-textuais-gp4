package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class ClassePorPlanejador extends Audit {
    String classeContabil

    static hasMany = [planejadores: String]

    Organizacao organizacao

    static constraints = {
        organizacao nullable: true
        classeContabil unique: ['organizacao'], maxSize: 10
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'classe_planedor_seq']
        planejadores  joinTable: [name: 'classe_planejador',
                              key: 'classe_id', column: 'planejador']
    }
}