package br.com.furukawa.model

import br.com.furukawa.utils.DateUtils

import java.text.SimpleDateFormat

class PlanejamentoDiario {

    static final SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy")

    Date data
    LinhaDeProducao linhaDeProducao
    GrupoLinhaDeProducao grupoLinhaDeProducao
    Turno turno
    Long quantidadePessoasPresentes = 0
    Long quantidadePlanejadaPecas
    Long quantidadePlanejadaPessoas
    Long pessoasTreinamento = 0
    Long pessoasHabilitadas = 0
    Date dataCriacao
    Date dataAtualizacao
    String usuarioCriacao
    String usuarioAlteracao

    String observacao

    static constraints = {
        data unique: ['linhaDeProducao', 'turno', 'grupoLinhaDeProducao']
        usuarioCriacao nullable: true
        usuarioAlteracao nullable: true
        dataCriacao nullable: true
        dataAtualizacao nullable: true
        observacao nullable: true

        data validator: {data, plan, errors ->
            List<PlanejamentoDiario> planejamentosNoDia = PlanejamentoDiario.createCriteria().list {
                createAlias('linhaDeProducao', 'l')
                eq('data', data)
                ne('id', plan.id)
                eq('l.fornecedor', plan.linhaDeProducao?.fornecedor)
                eq('linhaDeProducao', plan.linhaDeProducao)
            }

            if(planejamentosNoDia.size() == 0) {
                return true
            }

            TurnoDuracao duracaoTurnoASerCriado = plan.getTurnoDuracaoDoDia()

            if (planejamentosNoDia.any { it.getTurnoDuracaoDoDia().possuiConflito(duracaoTurnoASerCriado) }) {
                errors.rejectValue('data', 'horariosColidem')
            }
        }
    }

    static mapping = {
        table 'gp40.planejamento_diario'
        id generator: 'sequence', params: [sequence: 'planejamento_diario_seq']
    }

    String getDataFormatada(){
        return data ? SDF.format(data) : null
    }

    PlanejamentoDiario clone(){
        PlanejamentoDiario clone = new PlanejamentoDiario()
        clone.data = data
        clone.linhaDeProducao = linhaDeProducao
        clone.grupoLinhaDeProducao = grupoLinhaDeProducao
        clone.turno = turno
        clone.quantidadePlanejadaPecas = quantidadePlanejadaPecas
        clone.quantidadePlanejadaPessoas = quantidadePlanejadaPessoas
        clone.dataCriacao = dataCriacao
        clone.dataAtualizacao = dataAtualizacao
        clone.usuarioCriacao = usuarioCriacao
        clone.usuarioAlteracao = usuarioAlteracao
        clone.observacao = observacao
        return clone
    }

    TurnoDuracao getTurnoDuracaoDoDia() {
        return turno.duracoes.find {td ->
            td.dias.any {ds ->
                ds.day == this.data.day
            }
        }
    }
}
