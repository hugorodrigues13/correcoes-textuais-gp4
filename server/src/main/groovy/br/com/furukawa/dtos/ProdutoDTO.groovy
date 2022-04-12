package br.com.furukawa.dtos

class ProdutoDTO {
    Long inventoryItemId
    String codigo
    String descricao
    String plannerCode
    String status
    Long organizationID
    String language
    List<FornecedorListaRoteiroEBSDTO> fornecedoresListasRoteiros

    public ProdutoDTO() {

    }

}
