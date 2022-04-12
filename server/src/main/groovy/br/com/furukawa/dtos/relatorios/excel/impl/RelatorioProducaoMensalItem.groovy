package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.ApontamentoPendenteDTO
import br.com.furukawa.dtos.ProducaoMensalDTO
import br.com.furukawa.dtos.relatorios.RelatorioDTO

class RelatorioProducaoMensalItem implements RelatorioDTO {

        String mes
        String grupoLinha
        String codigoProduto
        Long conectores
        Long produzido

    RelatorioProducaoMensalItem(ProducaoMensalDTO dto){
            this.mes = dto.mes
            this.grupoLinha = dto.grupoLinha
            this.codigoProduto = dto.codigoProduto
            this.conectores = dto.conectores
            this.produzido = dto.produzido
        }



}
