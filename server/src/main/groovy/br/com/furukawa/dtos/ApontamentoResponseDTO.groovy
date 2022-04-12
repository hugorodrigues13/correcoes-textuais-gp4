package br.com.furukawa.dtos

import br.com.furukawa.dtos.ebs.ComponenteWIP

class ApontamentoResponseDTO {
    String ordemFabricacao
    String lote
    String codigoProduto
    String ordemProducao
    String caixa
    String modelo
    String comprimento
    String dataPrevisaoFinalizacao
    List<ComponenteWIP> materiasPrimas
    Long ultimoApontamento
    String proximoProcesso
    Boolean reprocesso
    List<String> camposRastreaveis
}
