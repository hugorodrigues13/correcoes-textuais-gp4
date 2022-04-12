package br.com.furukawa.model

class ReprocessoLinhaDeProducao {
    Defeito defeito
    ProcessoLinhaDeProducao processoRetorno
    Integer ordemProcessoRetorno

    static belongsTo = [processoOrigem: ProcessoLinhaDeProducao]

    static transients = ['processoRetorno']


    static mapping = {
        table 'reprocesso_lp'
        id generator: 'sequence', params: [sequence: 'reprocesso_lp_seq']
    }


    ProcessoLinhaDeProducao getProcessoRetorno() {
        if(processoRetorno) {
            return processoRetorno
        }

        if(processoOrigem && processoOrigem.linhaDeProducao) {
            Set<ProcessoLinhaDeProducao> processosDaLinha = processoOrigem.linhaDeProducao.processos

            return processosDaLinha.find {it.ordem == ordemProcessoRetorno}
        }

        return null
    }


    ReprocessoLinhaDeProducao clonar() {
        ReprocessoLinhaDeProducao clone = ReprocessoLinhaDeProducao.newInstance()
        clone.defeito = this.defeito
        clone.ordemProcessoRetorno = this.ordemProcessoRetorno

        return clone
    }
}
