package br.com.furukawa.service

import br.com.furukawa.enums.DiaDaSemana
import br.com.furukawa.exceptions.PlanejamentoDiarioException
import br.com.furukawa.model.PlanejamentoDiario
import grails.gorm.transactions.Transactional

import java.util.concurrent.TimeUnit

@Transactional
class PlanejamentoDiarioService {

    List<PlanejamentoDiario> criarMultiplosPlanejamentos(PlanejamentoDiario instance, Date inicio, Date fim){
        List<PlanejamentoDiario> planejamentosSalvo = []
        int horas = TimeUnit.HOURS.convert(Math.abs(fim.getTime() - inicio.getTime()), TimeUnit.MILLISECONDS)
        int dias = Math.ceil(horas / 24)
        for (int i = 0; i <= dias; i++){
            Date data = new Date(inicio.getTime() + TimeUnit.DAYS.toMillis(i))
            PlanejamentoDiario planejamento = instance.clone()
            planejamento.data = data

            if (planejamento.getTurnoDuracaoDoDia()){
                PlanejamentoDiario existente = PlanejamentoDiario.findByTurnoAndLinhaDeProducaoAndData(planejamento.turno, planejamento.linhaDeProducao, planejamento.data)
                if (existente){
                    existente.quantidadePlanejadaPecas = planejamento.quantidadePlanejadaPecas
                    existente.quantidadePlanejadaPessoas = planejamento.quantidadePlanejadaPessoas
                    existente.save(flush: true, failOnError: true)
                    planejamentosSalvo.add(existente)
                } else {
                    planejamento.save(flush: true, failOnError: true)
                    planejamentosSalvo.add(planejamento)
                }
            }
        }

        return planejamentosSalvo

    }


    void excluir(List<PlanejamentoDiario> planejamentos) {
        planejamentos*.delete(flush: true)
    }
}
