package br.com.furukawa.dtos

import java.text.DateFormat
import java.text.SimpleDateFormat

class Periodo {

    static PADRAO_DATA_HORA = "dd/MM/yyyy HH:mm:ss"

    String dataInicial
    String dataFinal
    String padrao

    Periodo(String dataInicial, String dataFinal, String padrao=PADRAO_DATA_HORA) {
        this.dataInicial = dataInicial
        this.dataFinal = dataFinal
        this.padrao = padrao
    }

    Date getDataInicial(){
        Date data

        if( dataInicial )
        {
            DateFormat formatador = new SimpleDateFormat(padrao)
            data = formatador.parse(dataInicial)
        }

        return data
    }

    Date getDataFinal(){
        Date data

        if( dataFinal )
        {
            DateFormat formatador = new SimpleDateFormat(padrao)
            data = formatador.parse(dataFinal)
        }

        return data
    }

    static Periodo umMes(){
        String format = "dd/MM/yyyy"
        SimpleDateFormat sdf = new SimpleDateFormat(format)
        Date fim = new Date()
        Date inicio = new Date(fim.getTime() - 1000L * 60L * 60L * 24L * 30)
        return new Periodo(sdf.format(inicio), sdf.format(fim), format)
    }

}
