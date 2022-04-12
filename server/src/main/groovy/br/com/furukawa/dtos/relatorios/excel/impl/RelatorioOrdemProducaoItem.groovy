package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioOrdemProducaoItem implements RelatorioDTO{

    String ordemDeProducao
    String codigoProduto
    String descricaoProduto
    String quantidade
    String planejador
    String lista
    String roteiro
    String fornecedor
    String pedido
    String quantidadeRestante
    String quantidadeEntregue
    String quantidadePendenteRomaneio
    String quantidadeTransito
    String erroExportacao
    String status
    String statusOracle
    String dataCriacao
    String dataPrevisaoFinalizacao
    String linha
    Long release
    String justificativa
    String codigoServico
    Long totalSequenciado
    Long totalPecasProducao
    Long totalPecasFinalizadas
    String modelo
    String comprimento
    String grupoLinhas

    RelatorioOrdemProducaoItem(String ordemDeProducao, String codigoProduto, String descricaoProduto, String quantidade, String planejador, String lista, String roteiro, String fornecedor, String pedido, String quantidadeRestante, String quantidadeEntregue, String quantidadePendenteRomaneio, String quantidadeTransito, String erroExportacao, String status, String statusOracle, String dataCriacao, String dataPrevisaoFinalizacao, String linha, Long release, String codigoServico, Long totalSequenciado, Long totalPecasProducao, Long totalPecasFinalizadas, String justificativa, String modelo, String comprimento, String grupoLinhas) {
        this.ordemDeProducao = ordemDeProducao
        this.codigoProduto = codigoProduto
        this.descricaoProduto = descricaoProduto
        this.quantidade = quantidade
        this.planejador = planejador
        this.lista = lista
        this.roteiro = roteiro
        this.fornecedor = fornecedor
        this.pedido = pedido
        this.quantidadeRestante = quantidadeRestante
        this.quantidadeEntregue = quantidadeEntregue
        this.quantidadePendenteRomaneio = quantidadePendenteRomaneio
        this.quantidadeTransito = quantidadeTransito
        this.erroExportacao = erroExportacao
        this.status = status
        this.statusOracle = statusOracle
        this.dataCriacao = dataCriacao
        this.dataPrevisaoFinalizacao = dataPrevisaoFinalizacao
        this.linha = linha
        this.release = release
        this.justificativa = justificativa
        this.codigoServico = codigoServico
        this.totalSequenciado = totalSequenciado
        this.totalPecasProducao = totalPecasProducao
        this.totalPecasFinalizadas = totalPecasFinalizadas
        this.modelo = modelo
        this.comprimento = comprimento
        this.grupoLinhas = grupoLinhas
    }
}
