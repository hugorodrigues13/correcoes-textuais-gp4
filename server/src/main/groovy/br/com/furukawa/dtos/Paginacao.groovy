package br.com.furukawa.dtos

class Paginacao {
    Integer max
    Integer offset

    def getMax(){
        return  max && max > 0 ? max : 10
    }

    def getOffSet(){
        return offset && offset > 0 ? offset : 0
    }
}
