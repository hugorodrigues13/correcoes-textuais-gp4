package br.com.furukawa.enums

enum StatusRomaneioNotaFiscal {
    ENVIADO(1),
    FINALIZADO(2),
    ERRO(3),
    CANCELADO(4),
    REJEITADO_PELA_SEFAZ(5),
    OBSOLETO(6),
    EMISSAO_DE_CONTINGENCIA(7),
    DENEGADA(8)

    int id
    StatusRomaneioNotaFiscal(int id){
        this.id = id
    }

    static StatusRomaneioNotaFiscal getById(int id){
        return values().find({it.id == id})
    }

    boolean isCancelado() {
        return equals(CANCELADO)
    }
}
