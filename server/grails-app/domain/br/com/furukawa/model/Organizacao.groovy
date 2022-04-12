package br.com.furukawa.model

class Organizacao implements Serializable {
    private static final long serialVersionUID = 1

    String descricao
    String organizationID
    String organizationCode
    String idioma

    String unidadeOperacional
    String endereco
    String pais
    String cidade

    static constraints = {
        organizationID unique: true
        descricao unique: true
        organizationCode unique: true
        idioma nullable: true
        unidadeOperacional nullable: true
        endereco nullable: true
        pais nullable: true
        cidade nullable: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'organizacao_seq']
    }
}
