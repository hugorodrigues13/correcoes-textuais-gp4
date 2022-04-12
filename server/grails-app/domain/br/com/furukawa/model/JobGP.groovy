package br.com.furukawa.model

import br.com.furukawa.enums.StatusJob

class JobGP {
    String nome
    Date inicio = new Date()
    Date fim
    Date ultimaExecucao
    StatusJob status = StatusJob.EM_EXECUCAO
    Long  idOrganizacao

    static constraints = {
        fim nullable: true
        ultimaExecucao nullable: true
        idOrganizacao nullable: true
    }

    static mapping = {
        table 'job_gp'
        id generator: 'sequence', params: [sequence: 'job_gp_seq']
    }
}
