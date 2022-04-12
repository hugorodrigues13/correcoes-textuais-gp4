package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.SerialFabricacaoDTO
import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioSerialListagemItem implements RelatorioDTO {

    String serial
    String codigoProduto
    String descricaoProduto
    String ordemProducao
    String ordemFabricacao
    String status
    String linhaProducao
    String grupoLinhaProducao
    String lote
    String statusOrdemFabricacao
    String caixa
    String statusRomaneio
    String codigoRomaneio
    String dataFinalizacao
    String codigoNF
    String ultimoApontamento
    String statusWip

    RelatorioSerialListagemItem(SerialFabricacaoDTO dto) {
        this.serial = dto.serialCompleto
        this.codigoProduto = dto.codigoProduto
        this.descricaoProduto = dto.descricaoProduto
        this.ordemProducao = dto.ordemExterna
        this.ordemFabricacao = dto.ordemFabricacao
        this.status = dto.status
        this.linhaProducao = dto.linhaProducao
        this.grupoLinhaProducao = dto.grupoLinhaProducao
        this.lote = dto.lote
        this.statusOrdemFabricacao = dto.statusOrdemFabricacao
        this.caixa = dto.caixa
        this.statusRomaneio = dto.statusRomaneio
        this.codigoRomaneio = dto.codigoRomaneio
        this.dataFinalizacao = dto.dataFinalizacao
        this.codigoNF = dto.codigoNF
        this.ultimoApontamento = dto.ultimoApontamento
        this.statusWip = dto.statusWip
    }

}
