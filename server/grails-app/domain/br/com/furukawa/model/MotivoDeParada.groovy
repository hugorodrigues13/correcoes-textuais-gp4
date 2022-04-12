package br.com.furukawa.model

import br.com.furukawa.enums.TipoMotivoParada
import br.com.furukawa.utils.Audit

class MotivoDeParada extends Audit{

    String motivo
    TipoMotivoParada tipo
    Boolean isAtivo = true
    static belongsTo = [fornecedor: Fornecedor]

    static constraints = {
        motivo unique: ['fornecedor']
    }

    static mapping = {
        table 'motivo_parada'
        id generator: 'sequence', params: [sequence: 'motivo_parada_seq']
    }

    List<GrupoRecurso> getGruposRecurso(){
        return GrupoRecurso.createCriteria().list {
            motivosDeParada {
                eq "id", this.id
            }
        }
    }

}
