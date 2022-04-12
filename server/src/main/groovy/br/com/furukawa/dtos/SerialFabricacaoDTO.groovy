package br.com.furukawa.dtos

import br.com.furukawa.enums.StatusImpressaoEtiqueta

class SerialFabricacaoDTO {
    Long id
    String serialCompleto
    String codigoOrigem
    String codigoGerado
    String codigoProduto
    String descricaoProduto
    String ordemExterna
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
    String dataSucateamento
    String dataRomaneio
    String statusWip
    Long idOrdemFabricacao
    Boolean foiImpresso
    String statusLote

    SerialFabricacaoDTO() {
    }

    String getStatusImpressao(){
        return foiImpresso ? StatusImpressaoEtiqueta.ETIQUETA_IMPRESSA.name() : StatusImpressaoEtiqueta.IMPRESSAO_PENDENTE.name()
    }

}
