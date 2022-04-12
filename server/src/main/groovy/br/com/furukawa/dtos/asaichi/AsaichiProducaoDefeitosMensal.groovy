package br.com.furukawa.dtos.asaichi

class AsaichiProducaoDefeitosMensal {
    String dia
    Long produzido
    Long defeitos

    AsaichiProducaoDefeitosMensal() {

    }

    AsaichiProducaoDefeitosMensal(ApontamentoMensalPorLinhaEProduto apontamento) {
        this.dia = apontamento.data
        this.produzido = apontamento.total ?: 0
        this.defeitos = apontamento.defeitos ?: 0
    }
}
