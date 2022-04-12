package br.com.furukawa.enums

enum TipoDeDado {
    NUMERO("NUMERO"),
    STRING("STRING"),
    BOOLEAN("BOOLEAN")

    final String descricao
    TipoDeDado(String descricao){
        this.descricao = descricao
    }

    String getDescricao(){
        return this.descricao
    }

    boolean isBoolean(){
        return this.equals(BOOLEAN)
    }
}