package br.com.furukawa.model

class ProcessoLinhaDeProducao {
    Integer ordem
    GrupoRecurso grupoRecurso
    Integer numeroMaximoDeApontamentos

    static belongsTo = [linhaDeProducao: LinhaDeProducao]
    static hasMany = [reprocessos: ReprocessoLinhaDeProducao]

    static constraints = {
        numeroMaximoDeApontamentos nullable: true
    }

    static mapping = {
        table 'processo_lp'
        id generator: 'sequence', params: [sequence: 'processo_lp_seq']
        numeroMaximoDeApontamentos column: 'max_apontamentos'
        reprocessos lazy: false, cascade: "all-delete-orphan"
    }

    ProcessoLinhaDeProducao getProcessoRetorno(Defeito defeito) {
        ReprocessoLinhaDeProducao reprocesso = ReprocessoLinhaDeProducao.findByProcessoOrigemAndDefeito(this, defeito)
        if(reprocesso != null) {
            return reprocesso.getProcessoRetorno()
        } else {
            return null
        }
    }

    ProcessoLinhaDeProducao getProximoProcesso() {
        return ProcessoLinhaDeProducao.findByLinhaDeProducaoAndOrdem(linhaDeProducao, ordem+1)
    }

    ProcessoLinhaDeProducao clonar() {
        ProcessoLinhaDeProducao clone = ProcessoLinhaDeProducao.newInstance()
        clone.ordem = this.ordem
        clone.grupoRecurso = this.grupoRecurso
        clone.numeroMaximoDeApontamentos = this.numeroMaximoDeApontamentos

        reprocessos.each {
            clone.addToReprocessos(it.clonar())
        }

        return clone
    }
}
