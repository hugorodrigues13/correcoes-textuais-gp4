package br.com.furukawa.model

import br.com.furukawa.enums.TipoImpressao
import br.com.furukawa.utils.Audit

class Impressora extends Audit {
    String nome
    Fornecedor fornecedor
    String apelido
    TipoImpressao tipoImpressao

    static hasMany = [ips: String]

    static constraints = {
        nome unique: true
        ips nullable: true
    }

    static mapping = {
        ips joinTable: [name: 'impressora_ips', key: 'impressora_id', column: 'ip']
        id generator: 'sequence', params: [sequence: 'impressora_seq']
    }
}
