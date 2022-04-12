package br.com.furukawa.model

import br.com.furukawa.utils.Audit

import java.text.SimpleDateFormat

class ApontamentoOrdemDeFabricacao extends Audit {
    OrdemDeFabricacao ordemDeFabricacao
    Recurso recurso
    static hasMany = [defeitos: DefeitoApontamentoOF, dadosRastreaveis: DadoRastreavelApontamentoOF]

    static mapping = {
        id generator: 'sequence', params: [sequence: 'apontamento_of_seq']
        table 'apontamento_of'
    }

    static constraints = {
        defeitos cascade: 'all-delete-orphan'
    }

    String getDataCriacaoFormatada() {
        new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(dataCriacao)
    }
}
