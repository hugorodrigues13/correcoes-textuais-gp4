package br.com.furukawa.dtos

import br.com.furukawa.enums.Status


class MotivoDeParadaDTO {

    Long id
    String motivo
    String tipo
    List<String> gruposRecurso
    Boolean isAtivo

    String getStatus() {
        return isAtivo ? Status.ATIVO.name() : Status.INATIVO.name()
    }
}
