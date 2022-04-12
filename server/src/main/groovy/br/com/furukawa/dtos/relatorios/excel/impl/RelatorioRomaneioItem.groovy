package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.RomaneioListaDTO
import br.com.furukawa.dtos.relatorios.RelatorioDTO

import java.text.SimpleDateFormat

class RelatorioRomaneioItem implements RelatorioDTO {

    static final SimpleDateFormat SDF_PARSE = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")
    static final SimpleDateFormat SDF_FORMAT = new SimpleDateFormat("dd/MM/yyyy HH:mm")

    String romaneio
    String notaFiscalEncomenda
    String notaFiscalRetorno
    String emissao
    String quantidadeTotal
    String valorTotal
    String status

    RelatorioRomaneioItem(RomaneioListaDTO dto) {
        this.romaneio = dto.numero + "/" + dto.ano
        this.notaFiscalEncomenda = dto.notaFiscalEncomenda
        this.notaFiscalRetorno = dto.notaFiscalRetorno
        this.emissao = dto.emissao ? SDF_FORMAT.format(SDF_PARSE.parse(dto.emissao)) : null
        this.quantidadeTotal = dto.quantidadeTotal
        this.valorTotal = dto.valorTotal
        this.status = dto.status
    }
}
