package br.com.furukawa.enums

enum StatusOrdemFabricacao {
    EM_SEPARACAO,
    ABERTA,
    EM_ANDAMENTO,
    FINALIZADA,
    CANCELADA

    static List<StatusOrdemFabricacao> getStatusVisiveisNoSequenciamento() {
        return [ABERTA, EM_ANDAMENTO, EM_SEPARACAO]
    }

    static List<StatusOrdemFabricacao> getStatusValidacaoLinha() {
        return [EM_SEPARACAO, ABERTA, EM_ANDAMENTO]
    }

    static List<StatusOrdemFabricacao> getFiltroStatusPadrao() {
        return [EM_SEPARACAO, ABERTA, EM_ANDAMENTO]
    }

    static List<StatusOrdemFabricacao> getStatusProducao() {
        return [EM_SEPARACAO, EM_ANDAMENTO, FINALIZADA]
    }

    boolean isFinalizada() {
        return equals(FINALIZADA)
    }

    boolean isCancelada() {
        return equals(CANCELADA)
    }

    boolean isAberta() {
        return equals(ABERTA)
    }

    boolean isEmSeparacao() {
        return equals(EM_SEPARACAO)
    }
}
