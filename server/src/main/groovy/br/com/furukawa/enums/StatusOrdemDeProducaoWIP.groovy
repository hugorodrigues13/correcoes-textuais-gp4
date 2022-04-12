package br.com.furukawa.enums

enum StatusOrdemDeProducaoWIP {

    NAO_LIBERADO(1),
    LIBERADO(3),
    CONCLUIDO(4),
    CANCELADO(7),
    FECHADO(12),
    FECHAMENTO_PENDENTE(14),
    FECHAMENTO_FALHA(15),

    int id;

    StatusOrdemDeProducaoWIP(int id){
        this.id = id;
    }

    static StatusOrdemDeProducaoWIP getById(int id){
        return values().find({it.id == id})
    }

    static List<StatusOrdemDeProducaoWIP> getStatusVisiveisPadrao(){
        return [NAO_LIBERADO, LIBERADO, CONCLUIDO, FECHAMENTO_PENDENTE, FECHAMENTO_FALHA]
    }

    static List<StatusOrdemDeProducaoWIP> getStatusAlteracao() {
        return [LIBERADO, CONCLUIDO, CANCELADO]
    }

}