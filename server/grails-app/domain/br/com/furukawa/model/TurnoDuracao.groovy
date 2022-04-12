package br.com.furukawa.model

import br.com.furukawa.enums.DiaDaSemana
import java.time.LocalTime
import java.text.SimpleDateFormat
import java.time.format.DateTimeFormatter

class TurnoDuracao {

    static final SimpleDateFormat SDF = new SimpleDateFormat("HH:mm")

    static final String montaSQLDeIntervalo(String data) {
        return "INTERVAL '0 $data:00' DAY TO SECOND(3)"
    }

    Date horarioFinal
    Date duracao // em horas

    static hasMany = [dias: DiaDaSemana]
    static belongsTo = [turno: Turno]

    static constraints = {
        dias validator: { dias, turnoDuracao, errors ->
            if (!turnoDuracao.id) return
            boolean duplicado = TurnoDuracao.findAllByIdNotEqualAndTurno(turnoDuracao.id, turnoDuracao.turno)
                    .any({outros -> outros.dias.any({dia -> turnoDuracao.dias.contains(dia)})})
            if (duplicado){
                errors.rejectValue('dias' ,'unique')
            }
        }
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'turno_duracao_seq']
    }

    String getHorarioFinalFormatado(){
        return SDF.format(horarioFinal)
    }

    String getDuracaoFormatada(){
        return SDF.format(duracao)
    }

    LocalTime getInicio(){
        return LocalTime.parse(SDF.format(horarioFinal)).minusHours(duracao.getHours()).minusMinutes(duracao.getMinutes());
    }

    boolean possuiConflito(TurnoDuracao turnoDuracao) {
        LocalTime inicio = getInicio()
        LocalTime fim = LocalTime.parse(SDF.format(this.horarioFinal))
        LocalTime inicioTurnoValidacao = turnoDuracao.inicio
        LocalTime fimTurnoValidacao = LocalTime.parse(SDF.format(turnoDuracao.horarioFinal))

        boolean passouDia = inicio > fim
        boolean passouDiaTurnoDuracao = inicioTurnoValidacao > fimTurnoValidacao

        boolean conflitoTurnosMesmoDia = (!passouDia && !passouDiaTurnoDuracao) && (inicioTurnoValidacao <= inicio && fimTurnoValidacao >= inicio) || (inicioTurnoValidacao <= fim && fimTurnoValidacao >= fim)
        boolean conflitoTurnoExistenteDiaAnterior = passouDia && (inicioTurnoValidacao >= inicio || fimTurnoValidacao <= fim)
        boolean conflitoTurnoValidadoDiaAnterior = passouDiaTurnoDuracao && (inicio >= inicioTurnoValidacao || fim <= fimTurnoValidacao)

        return conflitoTurnosMesmoDia || conflitoTurnoExistenteDiaAnterior || conflitoTurnoValidadoDiaAnterior
    }

    String getInicioFormatado() {
        LocalTime inicio = getInicio()
        return inicio.format(DateTimeFormatter.ofPattern("HH:mm"))
    }
}
