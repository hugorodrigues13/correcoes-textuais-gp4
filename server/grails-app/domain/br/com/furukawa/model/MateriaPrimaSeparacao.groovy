package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class MateriaPrimaSeparacao extends Audit {
    String codigoProduto
    String descricaoProduto
    BigDecimal quantidade

    static belongsTo = [ordemDeFabricacao: OrdemDeFabricacao]

    static mapping = {
        table name: 'mp_separacao'
        id generator: 'sequence', params: [sequence: 'mp_separacao_seq']
    }
}
