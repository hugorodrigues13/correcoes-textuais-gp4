package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao

class FiltroApontamentosPendentes extends Filtro {

    String serial
    String linhaDeProducao
    String recurso
    String grupoRecurso
    String operador
    String erroTransacao
    String status
    String periodoInicial
    String periodoFinal
    Ordenacao ordenacao
    Paginacao paginacao

    FiltroApontamentosPendentes(Map params) {
        super(params)
        this.periodoInicial = params.periodoInicial
        this.periodoFinal = params.periodoFinal
        this.serial = params.serial
        this.linhaDeProducao = params.linhaDeProducao
        this.recurso = params.recurso
        this.grupoRecurso = params.grupoRecurso
        this.operador = params.operador
        this.erroTransacao = params.erroTransacao
        this.status = params.status
    }


    @Override
    String gerarWhere() {
        String where = "WHERE 1=1\n"

        if(periodoInicial && periodoFinal){
            "TO_TIMESTAMP(TO_CHAR('01/04/2021 18:07'), 'DD/MM/YYYY HH24:MI')"
            where += """AND HA.DATA BETWEEN TO_TIMESTAMP(TO_CHAR('${periodoInicial}'), 'DD/MM/YYYY HH24:MI') AND TO_TIMESTAMP(TO_CHAR('${periodoFinal}'), 'DD/MM/YYYY HH24:MI')\n"""
        }

        if(serial){
            where += """AND UPPER(SF.CODIGO || '-' || SF.ANO) LIKE UPPER('%${serial}%')\n"""
        }

        if(linhaDeProducao){
            where +="""AND UPPER(LDP.NOME) LIKE UPPER('%${linhaDeProducao}%')\n"""
        }

        if(recurso){
            where +="""AND UPPER(R.NOME) LIKE UPPER('%${recurso}%')\n"""
        }

        if(grupoRecurso){
            where += """AND UPPER(GR.NOME) LIKE UPPER('%${grupoRecurso}%')\n """
        }

        if(operador){
            where += """AND UPPER(U.FULLNAME) LIKE UPPER('%${operador}%')\n"""
        }

        if(erroTransacao){
            where += """AND UPPER(HA.ERRO_TRANSACAO) LIKE UPPER('%${erroTransacao}%')\n"""
        }

        if (status && status != "TODOS"){
            if (status == "COM_ERRO"){
                where += """ HA.ERRO_TRANSACAO IS NOT NULL\n"""
            } else if (status == "SEM_ERRO") {
                where += """ HA.ERRO_TRANSACAO IS NULL\n"""
            }
        }
        return where
    }

}
