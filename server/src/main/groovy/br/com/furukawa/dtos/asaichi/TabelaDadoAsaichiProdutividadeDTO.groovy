package br.com.furukawa.dtos.asaichi

import br.com.furukawa.model.Meta
import br.com.furukawa.model.PlanejamentoDiario

class TabelaDadoAsaichiProdutividadeDTO {
    String key
    Long planoPessoas = 0
    BigDecimal produtividadePlanejado = 0
    Long pessoasTreinamento = 0
    Long pessoasHabilitadas = 0
    BigDecimal produtividadeReal = 0
    Long metaHK = 0

    TabelaDadoAsaichiProdutividadeDTO() {

    }

    TabelaDadoAsaichiProdutividadeDTO(GraficoDadoAsaichiProducaoDiariaDTO apontamentosDoDia, PlanejamentoDiario planejamentoDiario, Integer horas, Meta meta) {
        this.key = apontamentosDoDia.turno
        this.planoPessoas = planejamentoDiario?.quantidadePlanejadaPessoas
        this.produtividadePlanejado = planoPessoas ? ((planejamentoDiario?.quantidadePlanejadaPecas?:0)/(planoPessoas * horas)) : 0
        this.pessoasTreinamento = planejamentoDiario?.pessoasTreinamento
        this.pessoasHabilitadas = planejamentoDiario?.pessoasHabilitadas
        this.produtividadeReal = pessoasTreinamento || pessoasHabilitadas ? apontamentosDoDia.produzido / ((pessoasTreinamento + pessoasHabilitadas) * horas) : 0
        this.metaHK = meta?.metaHK
    }
}
