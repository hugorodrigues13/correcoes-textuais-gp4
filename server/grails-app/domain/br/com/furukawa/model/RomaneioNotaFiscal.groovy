package br.com.furukawa.model

import br.com.furukawa.enums.StatusRomaneioNotaFiscal

class RomaneioNotaFiscal {

    String codigo
    StatusRomaneioNotaFiscal status

    static constraints = {
        codigo nullable: true
        status nullable: true
    }

    static mapping = {
        table 'romaneio_nf'
        id generator: 'sequence', params: [sequence: 'romaneio_nf_seq']
    }

    boolean isCancelada() {
        return status.isCancelado()
    }
}
