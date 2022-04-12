package br.com.furukawa.service

import br.com.furukawa.dtos.filtros.FiltroGrupoRecurso
import br.com.furukawa.dtos.GrupoRecursoEntitiesDTO
import br.com.furukawa.dtos.GrupoRecursoEntitiesETotalDTO
import br.com.furukawa.exceptions.GrupoRecursoException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.ProcessoLinhaDeProducao
import br.com.furukawa.model.Recurso
import br.com.furukawa.model.TempoApontamentoProduto
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery

import javax.persistence.Query

@Transactional(readOnly = true)
class GrupoRecursoService {

    CrudService crudService
    SessionFactory sessionFactory

    GrupoRecursoEntitiesETotalDTO buscarGrupoRecursoPorFiltros(FiltroGrupoRecurso filter) {
        String sql = buscaGrupoRecursoSql(filter)
        Integer total = getTotalRegistros(sql)
        List<GrupoRecursoEntitiesDTO> entidades = listaEntidades(sql, filter.max, filter.offset) as List<GrupoRecursoEntitiesDTO>

        GrupoRecursoEntitiesETotalDTO retorno = new GrupoRecursoEntitiesETotalDTO(entities: entidades, total: total)

        return retorno
    }

    String buscaGrupoRecursoSql(FiltroGrupoRecurso filter) {
        String where = " WHERE 1=1 "
        String orderBy = ""

        where += " AND GRUPO_RECURSO.FORNECEDOR_ID = ${crudService.getFornecedorLogado().id} "

        if (filter.nome) {
            where += " AND UPPER(GRUPO_RECURSO.NOME) LIKE UPPER('%${filter.nome}%') "
        }

        if (filter.operacao) {
            where += " AND UPPER(GRUPO_RECURSO.OPERACAO) LIKE UPPER('%${filter.operacao}%') "
        }

        if (filter.recurso) {
            where += " AND UPPER(RECURSO.NOME) LIKE UPPER('%${filter.recurso}%') "
        }

        if (filter.tempoPadrao){
            where += " AND GRUPO_RECURSO.TEMPO_PADRAO = ${filter.tempoPadrao}"
        }

        if (filter.tempoMaximoSemApontamento){
            where += " AND GRUPO_RECURSO.TEMPO_MAXIMO_SEM_APONTAMENTO = ${filter.tempoMaximoSemApontamento}"
        }

        if (filter.status){
            if (filter.status != "TODOS"){
                where += " AND GRUPO_RECURSO.IS_ATIVO = ${filter.status == "ATIVO" ? 1 : 0}"
            }
        } else {
            where += " AND GRUPO_RECURSO.IS_ATIVO = 1"
        }

        if (filter.ordenacao.order && filter.ordenacao.sort) {
            orderBy = " ORDER BY ${filter.ordenacao.sort} ${filter.ordenacao.order} "
        }

        return """SELECT DISTINCT GRUPO_RECURSO.ID,
                                  GRUPO_RECURSO.NOME,
                                  GRUPO_RECURSO.OPERACAO,
                                  GRUPO_RECURSO.TEMPO_PADRAO as tempoPadrao,
                                  GRUPO_RECURSO.TEMPO_MAXIMO_SEM_APONTAMENTO as tempoMaximoSemApontamento,
                                  GRUPO_RECURSO.IS_ATIVO as isAtivo
                  FROM GRUPO_RECURSO GRUPO_RECURSO
                           LEFT JOIN RECURSO_GRUPO RECURSO_GRUPO
                                     ON GRUPO_RECURSO.ID = RECURSO_GRUPO.GRUPO_ID
                           LEFT JOIN RECURSO RECURSO
                                     ON RECURSO.ID = RECURSO_GRUPO.RECURSO_ID                                     
                  ${where}
                  ${orderBy}
               """
    }

    Integer getTotalRegistros(String sqlList) {
        def sqlCount = """
            SELECT count(*)
            FROM ($sqlList)
            """

        NativeQuery queryTotal = sessionFactory.currentSession.createSQLQuery(sqlCount)

        return queryTotal.uniqueResult() as Integer
    }

    List<GrupoRecursoEntitiesDTO> listaEntidades(String sqlList, Integer max, Integer offset) {
        Query query = sessionFactory.currentSession.createSQLQuery(sqlList)
        query.setMaxResults(max as Integer)
        query.setFirstResult(offset as Integer)

        List<GrupoRecursoEntitiesDTO> entities = []

        query.list().each {
            entities.add(new GrupoRecursoEntitiesDTO(it[0] as Long, it[1] as String, it[2] as String, it[3] as Integer, it[4] as Integer, it[5] as Boolean))
        }

        return entities
    }

    @Transactional(readOnly = true)
    List<Long> getRecursosUtilizadosEmPrimeirosProcessosPorFornecedor(Fornecedor fornecedor, Long grupoRecursoId) {
        GrupoRecurso gr = GrupoRecurso.get(grupoRecursoId)
        List<GrupoLinhaDeProducao> gruposDoGR = ProcessoLinhaDeProducao.findAllByGrupoRecursoAndOrdem(gr, 0)*.linhaDeProducao*.gruposLinhas.flatten()
        List<Long> linhasDoGR = gruposDoGR*.linhas.flatten()*.id
        if (!linhasDoGR) return []
        ProcessoLinhaDeProducao.createCriteria().list {
            eq('ordem', 0)

            linhaDeProducao {
                eq('fornecedor', fornecedor)
                'in' 'id', linhasDoGR
            }

            grupoRecurso {
                eq('fornecedor', fornecedor)
                ne('id', grupoRecursoId)
                recursos {
                    projections {
                        property('id', 'rec.id')
                    }
                }
            }
        } as ArrayList<Long>
    }

    @Transactional(readOnly = true)
    List<Long> getGrupoRecursoUtilizadosEmPrimeirosProcessosPorFornecedor(Fornecedor fornecedor) {
        ProcessoLinhaDeProducao.createCriteria().list {
            eq('ordem', 0)

            linhaDeProducao {
                eq('fornecedor', fornecedor)
            }

            grupoRecurso {
                eq('fornecedor', fornecedor)
                projections {
                    property('id', 'gr.id')
                }
            }
        } as ArrayList<Long>
    }

    @Transactional(readOnly = true)
    void validaRecursos(Fornecedor fornecedor, List<Long> recursos, Long grupoRecursoId) {
        List<Long> listaRecursosOutrosGrupos = getRecursosUtilizadosEmPrimeirosProcessosPorFornecedor(fornecedor, grupoRecursoId)

        if (recursos != null) {
            List<Long> recursosIndisponiveisID = recursos.intersect(listaRecursosOutrosGrupos)
            List<Recurso> recursosIndisponiveis = Recurso.getAll(recursosIndisponiveisID.unique() as ArrayList<Long>)

            if (!recursosIndisponiveis.isEmpty()) {
                throw new GrupoRecursoException("grupoRecurso.recursoInvalido.message", recursosIndisponiveis*.nome.join(", "))
            }
        }
    }

    void atualizaVigencias(GrupoRecurso grupoRecurso, Integer tempoAntigo){
        Integer tempoNovo = grupoRecurso.tempoPadrao
        if (tempoNovo != tempoAntigo) {
            List<TempoApontamentoProduto> tempos = TempoApontamentoProduto.findAllByGrupoRecursoAndVigenciaAteIsNull(grupoRecurso)
            tempos.each {tempo ->
                tempo.vigenciaAte = new Date()
                crudService.salvar(tempo)
            }
            tempos.each {tempo ->
                TempoApontamentoProduto clone = tempo.clone()
                clone.vigenciaDe = new Date()
                clone.vigenciaAte = null
                clone.tempoApontamento = tempoNovo
                crudService.salvar(clone)
            }
        }
    }
}
