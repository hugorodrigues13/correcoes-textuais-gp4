package br.com.furukawa.enums

enum TipoBaixa {

    BAIXA_MANUAL(1, "Baixa Manual"),
    BAIXA_AUTOMATICA_MONTAGEM(2, "Baixa Automática na Montagem"),
    BAIXA_AUTOMATICA_OPERACAO(3, "Baixa Automática na Operação"),
    ALTO_VOLUME(4, "Alto Volume"),
    FORNECEDOR(5, "Fornecedor"),
    FANTASMA(6, "Fantasma"),
    BASEADO_LISTA(7, "Baseado na Lista"),

    int id
    String name

    TipoBaixa(int id, String name){
        this.id = id
        this.name = name
    }

    static TipoBaixa getById(int id){
        return values().find({it.id == id})
    }

}
