package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioSerialItem implements RelatorioDTO{

    String serial
    String codigoProduto
    String descricaoProduto
    String ordemFabricacao
    String ordemProducao
    String lote
    String status
    String horario
    String recurso
    String grupoRecurso
    String linhaProducao
    String grupoLinhaProducao
    String apontadoPor
    String defeito
    String statusOrdemFabricacao
    String statusLote
    String comprimento
    String cliente

    RelatorioSerialItem() {
    }
}
