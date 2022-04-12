package br.com.furukawa.dtos

import br.com.furukawa.enums.StatusRomaneio
import br.com.furukawa.model.RomaneioNotaFiscal

import java.text.SimpleDateFormat

class RomaneioListaDTO {
    Long id
    String numero
    String ano
    String emissao
    String notaFiscalEncomenda
    String notaFiscalRetorno
    String status
    BigDecimal quantidadeTotal
    BigDecimal valorTotal
    Boolean editable

    RomaneioListaDTO() {

    }
}
