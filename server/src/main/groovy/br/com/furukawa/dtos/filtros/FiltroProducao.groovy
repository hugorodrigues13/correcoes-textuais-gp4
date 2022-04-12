package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Periodo

class FiltroProducao  {

    String periodoInicial
    String periodoFinal
    String codigoProduto
    String grupoLinha

    FiltroProducao(Map params){
        this.periodoInicial = params.periodoInicial
        this.periodoFinal = params.periodoFinal
        this.codigoProduto = params.codigoProduto?: null
        this.grupoLinha = params.grupoLinha?: null
    }

    String gerarWhere(){
        String where = "WHERE 1=1 \n"
        if(periodoInicial && periodoFinal){
            String padrao = "MM/YY"
            where += """ AND TO_DATE(mes, 'MM/YY') BETWEEN TO_DATE('${periodoInicial}', '${padrao}') AND TO_DATE('${periodoFinal}', '${padrao}') \n"""
        }
        if(codigoProduto){
            where += """ AND codigoProduto = '${codigoProduto}' \n """
        }
        if(grupoLinha){
            where += """ AND UPPER(grupoLinha) LIKE UPPER('%${grupoLinha}%') \n """
        }

        return where
    }

}
