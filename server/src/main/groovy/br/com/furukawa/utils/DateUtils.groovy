package br.com.furukawa.utils

import groovy.time.TimeCategory

import java.text.SimpleDateFormat
import java.util.concurrent.TimeUnit

class DateUtils {
    static Date corrigeAnoData(Date data) {
        Calendar calendar = Calendar.getInstance()
        calendar.setTime(data)

        if(calendar.get(Calendar.YEAR) < 100) {
            calendar.add(Calendar.YEAR, 2000)
        }

        return calendar.getTime()
    }

    static Date dataMaisSeteDias(Date data){
        return fimDoDia(adicionaDiasAData(data, 7))
    }

    static Date dataMaisTrintaDias(Date data){
        return fimDoDia(adicionaDiasAData(data, 30))
    }

    static Date inicioDoDia(Date data) {
        Calendar cl = Calendar.getInstance()
        cl.setTime(data)
        cl.set(Calendar.HOUR_OF_DAY, 00)
        cl.set(Calendar.MINUTE, 00)
        cl.set(Calendar.SECOND, 00)

        return cl.getTime()
    }

    static Date fimDoDia(Date data) {
        Calendar cl = Calendar.getInstance()
        cl.setTime(data)
        cl.set(Calendar.HOUR_OF_DAY, 23)
        cl.set(Calendar.MINUTE, 59)
        cl.set(Calendar.SECOND, 59)
        cl.set(Calendar.MILLISECOND, 999)

        return cl.getTime()
    }

    static Date adicionaDiasAData(Date data, int dias) {
        Calendar cl = Calendar.getInstance()
        cl.setTime(data)
        cl.set(Calendar.DAY_OF_MONTH, data.getDate() + dias)
        return cl.getTime()
    }

    static Integer getUltimoDiaDoMes(Date data) {
        Calendar c = Calendar.getInstance()
        c.setTime(data)
        c.set(Calendar.DAY_OF_MONTH, c.getActualMaximum(Calendar.DAY_OF_MONTH));

        return c.get(Calendar.DAY_OF_MONTH)
    }

    static Long dataEmMilisegundos(Date data) {
        Calendar cl = Calendar.getInstance()
        cl.setTime(data)
        return cl.getTimeInMillis()
    }

    static int duracaoEmDiasEntreDatas(Date dateStart, Date dateEnd){
        Long diff = Math.abs(dateEnd.getTime() - dateStart.getTime())
        Long dias = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS)
        return dias.intValue()
    }

    static List<Date> diasEntreDatas(Date dateStart, Date dateEnd){
        List <Date> days = []
        Integer range = duracaoEmDiasEntreDatas(dateStart, dateEnd)

        if(range < 1) return days

        (1 .. range).each {
            days.add(adicionaDiasAData(inicioDoDia(dateStart), it))
        }

        return days
    }

    //TODO remover esse método, está sendo utilizado apenas para que funcione no STF de prod sem autenticacao até determinada data
    static boolean alcancouDataLiberacaoAutorizacaoServicos(String data) {
        return new Date().after(new SimpleDateFormat("dd/MM/yyyy").parse(data))
    }
}
