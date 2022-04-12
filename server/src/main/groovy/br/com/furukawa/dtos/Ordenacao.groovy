package br.com.furukawa.dtos

class Ordenacao {
    String order
    String sort

    def getOrder(){
        return order ?: "ASC"
    }

    def getSort(){
        return sort ?: "id"
    }
}
