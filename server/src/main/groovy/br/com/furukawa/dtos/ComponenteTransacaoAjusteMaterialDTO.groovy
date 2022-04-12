package br.com.furukawa.dtos

class ComponenteTransacaoAjusteMaterialDTO {
    Long inventoryItemId
    String codigoProduto
    Long organizationId
    BigDecimal quantidadePorMontagem
    Integer sequenciaOperacao
    String unidade
    String codigoSubinventario
    Long locatorId
    Long wipEntityId
    String codigoOrdemDeProducao
    List<TransacaoMaterialQuantidadeDTO> quantidades

    ComponenteTransacaoAjusteMaterialDTO() {

    }

    BigDecimal getSomaQuantidadeLotes(){
        return quantidades.sum({it.quantidadeDisponivel})
    }

}
