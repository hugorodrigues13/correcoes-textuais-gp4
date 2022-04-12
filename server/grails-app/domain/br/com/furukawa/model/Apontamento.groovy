package br.com.furukawa.model

class Apontamento {
    LinhaDeProducao linhaDeProducao
    SerialFabricacao serial
    ProcessoLinhaDeProducao processoAtual //processo antes do apontamento

    static hasMany = [historico: HistoricoApontamento]

    static constraints = {
        processoAtual nullable: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'apontamento_seq']
        historico cascade: 'all-delete-orphan'
    }

    HistoricoApontamento getUltimoRegistroHistorico() {
        return historico.sort {it.data}.last()
    }

    Recurso getUltimoRecursoApontado() {
        return getUltimoRegistroHistorico()?.recurso
    }
}
