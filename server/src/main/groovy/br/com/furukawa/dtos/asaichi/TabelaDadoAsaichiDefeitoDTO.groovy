package br.com.furukawa.dtos.asaichi

class TabelaDadoAsaichiDefeitoDTO {
    String key
    Long qtde
    Long meta = 0
    Long total
    Double porcentagem

    TabelaDadoAsaichiDefeitoDTO() {

    }

    TabelaDadoAsaichiDefeitoDTO(GraficoDadoAsaichiProducaoDiariaDTO apontamentosDoDia, Long defeitos) {
        this.key = apontamentosDoDia.turno
        this.qtde = defeitos
        this.total = apontamentosDoDia.produzido
        this.porcentagem = total ? (((qtde ?: 0) / total) * 100).round(2) : 0
    }
}
