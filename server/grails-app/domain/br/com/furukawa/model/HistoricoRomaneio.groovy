package br.com.furukawa.model

import br.com.furukawa.enums.StatusHistoricoRomaneio
import br.com.furukawa.enums.StatusIntegracaoRomaneio

import java.text.SimpleDateFormat

class HistoricoRomaneio {
    private final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/YYYY HH:mm")
    private final static SimpleDateFormat SDF_Data = new SimpleDateFormat("dd/MM/YYYY")
    private final static SimpleDateFormat SDF_Hora = new SimpleDateFormat("HH:mm")

    Date data
    String codigoNotaFiscalEncomenda
    String codigoNotaFiscalRetorno
    StatusHistoricoRomaneio status
    StatusIntegracaoRomaneio statusIntegracao
    String usuario
    String motivo

    static belongsTo = [romaneio: Romaneio]

    static constraints = {
        motivo nullable: true
        codigoNotaFiscalRetorno nullable: true
        codigoNotaFiscalEncomenda nullable: true
        statusIntegracao nullable: true
    }

    static mapping = {
        table 'historico_romaneio'
        id generator: 'sequence', params: [sequence: 'hist_rom_seq']
        codigoNotaFiscalEncomenda column: 'nf_encomenda'
        codigoNotaFiscalRetorno column: 'nf_retorno'
    }

    String getDataFormatada() {
        return SDF.format(data)
    }

    String getDataDiaMesAno() {
        return SDF_Data.format(data)
    }

    String getHoraFormatada() {
        return SDF_Hora.format(data)
    }
}
