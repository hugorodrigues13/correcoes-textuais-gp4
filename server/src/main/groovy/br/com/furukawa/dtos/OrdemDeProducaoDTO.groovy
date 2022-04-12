package br.com.furukawa.dtos

class OrdemDeProducaoDTO {

    Long id
    String codigoOrdem
    String status
    String codigoProduto
    String descricaoProduto
    String lista
    String roteiro
    String fornecedor
    String pedido
    Long quantidade
    Long quantidadeRestante
    Long quantidadeEntregue
    Long quantidadePendenteRomaneio
    Long quantidadeTransito
    String planejador
    String dataCriacao
    String dataPrevisaoFinalizacao
    String erroExportacao
    String statusOracle
    String release
    String codigoServico
    String linha
    String justificativa
    Long totalSequenciado
    Long totalPecasProducao
    Long totalPecasFinalizadas
    String grupoLinhas
    String modelo
    String comprimento

    static String getDataPrevisaoFinalizacaoFormatadaHHmm(String data){
        String date = data.split(" ")[0]
        String ajustarData = date.split("-")[2]+"/"+date.split("-")[1]+"/"+date.split("-")[0]
        return ajustarData + " " + data.split(" ")[1]
    }
}
