package br.com.furukawa.dtos

import br.com.furukawa.enums.Status
import br.com.furukawa.model.GrupoRecurso

class DefeitoDTO {
    Long id
    String nome
    List<GrupoRecurso> grupoRecursos
    Boolean isAtivo

    String getStatus() {
        return isAtivo ? Status.ATIVO.name() : Status.INATIVO.name()
    }
}
