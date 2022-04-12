package br.com.furukawa.dtos

import br.com.furukawa.enums.Status
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.Recurso
import br.com.furukawa.model.RegraExibicaoMP

class GrupoRecursoEntitiesDTO {
    Long id
    String nome
    String operacao
    Integer tempoPadrao
    Integer tempoMaximoSemApontamento
    List<Recurso> recursos
    Boolean isAtivo
    List<RegraExibicaoMP> regras

    GrupoRecursoEntitiesDTO(Long id, String nome, String operacao, Integer tempoPadrao, Integer tempoMaximoSemApontamento, Boolean isAtivo) {
        GrupoRecurso grupo = GrupoRecurso.get(id)
        List<Recurso> recursos = grupo.recursos as List
        List<RegraExibicaoMP> regras = grupo.regras as List
        this.id = id
        this.nome = nome
        this.operacao = operacao
        this.tempoPadrao = tempoPadrao
        this.tempoMaximoSemApontamento = tempoMaximoSemApontamento
        this.recursos = recursos.sort {it.nome}
        this.regras = regras.sort {it.descricao}
        this.isAtivo = isAtivo
    }

    String getStatus() {
        return isAtivo ? Status.ATIVO.name() : Status.INATIVO.name()
    }
}
