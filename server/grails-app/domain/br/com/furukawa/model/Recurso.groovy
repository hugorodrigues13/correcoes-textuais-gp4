package br.com.furukawa.model

import br.com.furukawa.dtos.GrupoRecursoParadaDTO
import br.com.furukawa.enums.Status
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.service.ApontamentoService
import br.com.furukawa.utils.Audit

class Recurso extends Audit {

    String nome
    String metaOEE
    String codigoOracle
    Fornecedor fornecedor
    Boolean isAtivo = true

    ApontamentoService apontamentoService

    static transients = ['apontamentoService']
    static hasMany = [conectores: Conector, paradas: Parada, testes: Teste]

    static constraints = {
        nome unique: ['fornecedor']
        codigoOracle nullable: true
    }

    static mapping = {
        conectores joinTable: [name: 'recurso_conector', key: 'recurso_id', column: 'conector_id']
        paradas joinTable: [name: 'recurso_paradas', key: 'recurso_id', column: 'parada_id']
        metaOEE column: 'meta_oee'
        autowire true
    }

    LinhaDeProducao getLinhaDeProducao(GrupoLinhaDeProducao grupoLinhaDeProducao){
        return apontamentoService.getLinhaDeProducaoDoRecurso(this, grupoLinhaDeProducao)
    }

    List<Defeito> getDefeitos() {
        List<GrupoRecurso> grupos = GrupoRecurso.createCriteria().list {
            recursos {
                eq 'id', this.id
            }
        }
        List<Defeito> defeitos = grupos*.defeitos.flatten() as List<Defeito>

        return defeitos
    }

    List<HistoricoApontamento> getHistoricoApontamentos(){
        return HistoricoApontamento.findAllByRecurso(this).sort({it.data})
    }

    Organizacao getOrganizacaoRecurso() {
        fornecedor.getOrganizacaoDoFornecedor()
    }

    boolean isParado(){
        Date agora = new Date()
        return !Parada.countByRecurso(this) || Recurso.createCriteria().get {
            eq 'id', this.id
            paradas {
                projections { max('id') }

                or {
                    isNull 'fim'
                     and {
                         gte 'fim', agora
                         lte 'inicio', agora
                     }
                }
            }
        }
    }

    Parada getParadaAtiva(){
        return paradas.find({it.isAtivo()})
    }

    Date getUltimoApontamento(){
        GrupoRecursoParadaDTO ultimoApontamento = apontamentoService.getGrupoRecursoParadas(id)
        Date ultimaParada = apontamentoService.getUltimaParadaDoRecurso(id)?.fim

        return ultimoApontamento?.data > ultimaParada ? ultimoApontamento.data : ultimaParada
    }

    String getStatus() {
        return isAtivo ? Status.ATIVO.name() : Status.INATIVO.name()
    }

    Boolean permiteApontamentoOF() {
        return GrupoRecurso.createCriteria().get {
            recursos {
                eq 'id', id
            }

            eq 'permiteApontamentoOF', true
        }
    }
}
