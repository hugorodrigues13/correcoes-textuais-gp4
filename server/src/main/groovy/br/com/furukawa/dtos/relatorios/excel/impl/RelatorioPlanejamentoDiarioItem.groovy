package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.model.PlanejamentoDiario

class RelatorioPlanejamentoDiarioItem implements RelatorioDTO {

    String data
    String linhaDeProducao
    String turno
    Long quantidadePlanejadaPecas
    Long quantidadePlanejadaPessoas
    Long quantidadePessoasPresentes
    String grupoLinhaDeProducao

    RelatorioPlanejamentoDiarioItem(PlanejamentoDiario planejamentoDiario){
        this.data = planejamentoDiario.dataFormatada
        this.linhaDeProducao = planejamentoDiario.linhaDeProducao.nome
        this.turno = planejamentoDiario.turno.nome
        this.quantidadePlanejadaPessoas = planejamentoDiario.quantidadePlanejadaPessoas
        this.quantidadePlanejadaPecas = planejamentoDiario.quantidadePlanejadaPecas
        this.grupoLinhaDeProducao = planejamentoDiario.grupoLinhaDeProducao?.nome
        this.quantidadePessoasPresentes = planejamentoDiario.quantidadePessoasPresentes
    }

}
