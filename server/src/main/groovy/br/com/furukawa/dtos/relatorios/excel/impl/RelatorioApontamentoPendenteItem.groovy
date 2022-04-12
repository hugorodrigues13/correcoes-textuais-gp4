package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.ApontamentoPendenteDTO
import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioApontamentoPendenteItem implements RelatorioDTO {

    String data
    String serial
    String linhaDeProducao
    String recurso
    String grupoRecurso
    String operador
    String erroTransacao

    RelatorioApontamentoPendenteItem(ApontamentoPendenteDTO dto){
        this.data = dto.data
        this.serial = dto.serial
        this.linhaDeProducao = dto.linhaDeProducao
        this.recurso = dto.recurso
        this.grupoRecurso = dto.grupoRecurso
        this.operador = dto.operador
        this.erroTransacao = dto.erroTransacao
    }

}
