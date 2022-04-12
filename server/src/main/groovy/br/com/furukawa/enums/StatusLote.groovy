package br.com.furukawa.enums

enum StatusLote {
    ABERTO,
    FECHADO,
    ROMANEIO,
    CONCLUIDO

    boolean isFechado() {
        equals(FECHADO)
    }

    boolean isRomaneio() {
        equals(ROMANEIO)
    }

    static List<StatusLote> getStatusNaoVisiveisListagem() {
        return [ROMANEIO, CONCLUIDO]
    }
}
