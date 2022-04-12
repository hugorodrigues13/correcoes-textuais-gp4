package br.com.furukawa.dtos.filtros

import groovy.time.TimeCategory
import groovy.transform.ToString

import java.text.DateFormat
import java.text.SimpleDateFormat
class FiltroDashboardProducao {

    Date periodoInicial
    Date periodoFinal
    String grupoLinhaProducao
    String linhaProducao
    String grupoRecursos
    String recurso
    String turno

    FiltroDashboardProducao(String periodoInicial, String periodoFinal, String grupoLinhaProducao, String linhaProducao, String grupoRecursos, String recurso, String turno) {
        DateFormat SDF = new SimpleDateFormat("dd/MM/yyyy HH:mm")
        this.periodoInicial = periodoInicial ? SDF.parse(periodoInicial) : null
        this.periodoFinal = periodoFinal ? SDF.parse(periodoFinal) : null
        this.grupoLinhaProducao = grupoLinhaProducao
        this.linhaProducao = linhaProducao
        this.grupoRecursos = grupoRecursos
        this.recurso = recurso
        this.turno = turno
        if (!periodoInicial && !periodoFinal){
            DateFormat df = new SimpleDateFormat("dd/MM/yyyy HH")
            Date agora = new Date()
            Date ontem
            use( TimeCategory ) {
                ontem = agora - 1.day
            }
            this.periodoInicial = df.parse(df.format(ontem))
            this.periodoFinal = df.parse(df.format(agora)) // hoje
        }
    }
}
