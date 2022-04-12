package br.com.furukawa.dtos.asaichi

import groovy.transform.ToString

class TabelaDadoAsaichiProducaoDTO {
    String key
    Long plano
    Long real
    Double porcentagem

    TabelaDadoAsaichiProducaoDTO() {

    }

    TabelaDadoAsaichiProducaoDTO(GraficoDadoAsaichiProducaoDiariaDTO apontamentosDoDia) {
        this.key = apontamentosDoDia.turno
        this.plano = apontamentosDoDia.previsto
        this.real = apontamentosDoDia.produzido
        this.porcentagem = plano ? (((real ?: 0) / plano) * 100).round(2) : 0
    }

}
