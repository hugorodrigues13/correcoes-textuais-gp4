package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.OrdemDeFabricacaoDTO
import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioOrdemFabricacaoItem implements RelatorioDTO{

    String ordemFabricacao
    String ordemProducao
    String codigoProduto
    String descricaoProduto
    String grupoLinhasProducao
    String linhaProducao
    String dataCriacao
    String justificativa
    String status
    Long ordemSequenciamento
    String cliente
    String comprimento
    Long quantidadeProgramada
    Long quantidadeProduzida
    String dataPrevisaoFinalizacao
    String dataUltimaImpressao
    String statusWIP
    String comentarios

    RelatorioOrdemFabricacaoItem(OrdemDeFabricacaoDTO ordemDeFabricacaoDTO) {
        this.ordemFabricacao = ordemDeFabricacaoDTO.ordemFabricacao
        this.ordemProducao = ordemDeFabricacaoDTO.ordemProducao
        this.codigoProduto = ordemDeFabricacaoDTO.codigoProduto
        this.descricaoProduto = ordemDeFabricacaoDTO.descricaoProduto
        this.status = ordemDeFabricacaoDTO.status
        this.grupoLinhasProducao = ordemDeFabricacaoDTO.grupoLinhasProducao
        this.dataCriacao = ordemDeFabricacaoDTO.dataCriacao
        this.linhaProducao = ordemDeFabricacaoDTO.linhaProducao
        this.justificativa = ordemDeFabricacaoDTO.justificativa
        this.ordemSequenciamento = ordemDeFabricacaoDTO.ordemSequenciamento
        this.cliente = ordemDeFabricacaoDTO.cliente
        this.comprimento = ordemDeFabricacaoDTO.comprimento
        this.quantidadeProgramada = ordemDeFabricacaoDTO.quantidadeProgramada
        this.quantidadeProduzida = ordemDeFabricacaoDTO.quantidadeProduzida
        this.dataPrevisaoFinalizacao = ordemDeFabricacaoDTO.dataPrevisaoFinalizacao
        this.dataUltimaImpressao = ordemDeFabricacaoDTO.dataUltimaImpressao
        this.statusWIP = ordemDeFabricacaoDTO.statusWIP
        this.comentarios = ordemDeFabricacaoDTO.comentarios
    }
}
