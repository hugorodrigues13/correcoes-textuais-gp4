package br.com.furukawa.model

import br.com.furukawa.dtos.TipoRegraExibicaoMP

class RegraExibicaoMP {

    String descricao
    TipoRegraExibicaoMP tipo

    static belongsTo = [grupo: GrupoRecurso]

    static constraints = {
        descricao unique: ['grupo']
    }

    static mapping = {
        table name: 'gp40.regra_exibicao_mp'
        id generator: 'sequence', params: [sequence: 'gp40.regra_exibicao_mp_seq']
    }

    boolean verificar(String descricaoProduto){
        switch (tipo){
            case TipoRegraExibicaoMP.INCLUIR:
                return descricaoProduto.toLowerCase().contains(descricao.toLowerCase())
            case TipoRegraExibicaoMP.NAO_INCLUIR:
                return !descricaoProduto.toLowerCase().contains(descricao.toLowerCase())
        }
    }

}
