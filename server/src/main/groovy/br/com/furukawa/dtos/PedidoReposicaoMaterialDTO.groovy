package br.com.furukawa.dtos

import java.text.SimpleDateFormat

class PedidoReposicaoMaterialDTO {

    Long id
    Long recurso
    String recursoNome
    String linha
    String chavePrimaria
    String previsaoEntrega
    boolean isLiberado
    List<ItemPedidoReposicaoMaterialDTO> itens


}
