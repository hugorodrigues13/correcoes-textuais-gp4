package br.com.furukawa.dtos.asaichi

class GraficoDadoAsaichiProducaoSemanalDTO {
    String turno
    String dia
    Long previsto
    Long produzido

    GraficoDadoAsaichiProducaoSemanalDTO() {

    }

    GraficoDadoAsaichiProducaoSemanalDTO(GraficoDadoAsaichiProducaoDiariaDTO apontamentosDoDia, String dia) {
        this.turno = apontamentosDoDia.turno
        this.dia = dia
        this.previsto = apontamentosDoDia.previsto
        this.produzido = apontamentosDoDia.produzido
    }
}
