package br.com.furukawa.dtos

class TransacaoAjusteMaterialDTO {
    String usuario = "VZIPPERER" //usuário
    String comentario = "Integração de Ajuste de Componente da Ordem de Produção Discreta - GP4.0 x WIP."
    String transactionTypeId = '35' //35 - Issue Components to WIP
    Integer wipSupplyType = 2 //2 - Baixa automática na montagem, 3 - Baixa automática na operação

    String sourceLineId
    String sourceHeaderId
    String codigoOrdemDeProducao
    Long organizationId
    String codigoOperacao
    String language
}
