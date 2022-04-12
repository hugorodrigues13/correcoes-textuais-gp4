package br.com.furukawa.dtos.asaichi

import br.com.furukawa.model.Meta

class GraficoDadoAsaichiProducaoMensalDTO {
    String dia
    Long previsto
    Long acumulado
    Double metaDefeitos = 0.0
    Double defeitos // porcentagem

    GraficoDadoAsaichiProducaoMensalDTO() {

    }

    GraficoDadoAsaichiProducaoMensalDTO(Long previsto, Long produzido, String dia, Long defeitos, Meta meta) {
        this.dia = dia
        this.previsto = previsto
        this.acumulado = produzido
        this.defeitos = produzido ? (((defeitos ?:0) / produzido) * 100).round(2) : 0
        this.metaDefeitos = meta?.metaReprocessos ?: 0
    }
}
