package br.com.furukawa.dtos

class SerialApoioDTO {
    Integer id
    String codigoFabricacao
    String ano
    String codigoProduto
    String descricaoProduto

    SerialApoioDTO(Integer id, String codigoFabricacao,String ano, String codigoProduto, String descricaoProduto){
        this.id = id
        this.codigoFabricacao = codigoFabricacao
        this.ano = ano
        this.codigoProduto = codigoProduto
        this.descricaoProduto = descricaoProduto
    }

    public getCodigoComDescricao() {
        return codigoProduto + " - " + descricaoProduto
    }

    public getSerial() {
        return codigoFabricacao + "-" + ano
    }
}