package br.com.furukawa.enums

enum StatusIntegracaoRomaneio {
    AGUARDANDO(1),
    EXECUTADO(2),
    ERRO(5),
    CANCELADO(9)

    int id
    StatusIntegracaoRomaneio(int id){
        this.id = id
    }

    static StatusIntegracaoRomaneio getById(int id){
        return values().find({it.id == id})
    }

    boolean isErro() {
        return equals(ERRO)
    }
}