package br.com.furukawa.dtos.filtros

import br.com.furukawa.model.Fornecedor

class FiltroApontamentoMensal {
    Long idFornecedor
    String conector
    String linhaDeProducao
    Date data

    FiltroApontamentoMensal(){}

    FiltroApontamentoMensal(FiltroAsaichi filtro){
        this.idFornecedor = filtro.idFornecedor
        this.data = filtro.data
        this.linhaDeProducao = filtro.linhaProducao
        this.conector = filtro.conector
    }

}
