package br.com.furukawa.model

class Teste {

    String tipo
    Integer amostragem
    boolean considerarPerdas

    static belongsTo = [recurso: Recurso]

    static constraints = {
        amostragem min: 0, max: 100
        tipo unique: ['recurso']
    }

    static mapping = {
        table 'gp40.testes'
        id generator: 'sequence', params: [sequence: 'gp40.teste_seq']
    }

}
