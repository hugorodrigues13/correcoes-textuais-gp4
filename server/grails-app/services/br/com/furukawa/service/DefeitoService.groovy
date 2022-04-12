package br.com.furukawa.service

import br.com.furukawa.dtos.DefeitoDTO
import br.com.furukawa.model.Defeito
import br.com.furukawa.model.GrupoRecurso
import grails.gorm.transactions.Transactional
import org.hibernate.Query
import org.hibernate.SessionFactory

@Transactional
class DefeitoService {

    SessionFactory sessionFactory

    void atualizarDefeitosGrupoRecurso(Defeito defeito, List<Integer> grupoRecursoId) {
        List<GrupoRecurso> grupoRecursoList = defeito.grupos

        List<Long> addToDefeitos = new ArrayList<Integer>()
        List<Long> removeFromDefeitos = new ArrayList<Integer>()

        grupoRecursoId.each {
            if (!grupoRecursoList*.id.contains(it as Long)) {
                addToDefeitos.add(it)
            }
        }

        grupoRecursoList.each {
            if (!grupoRecursoId.contains(it.id as Integer)) {
                removeFromDefeitos.add(it.id)
            }
        }

        addToDefeitos.each {
            GrupoRecurso grupoRecurso = GrupoRecurso.get(it)
            grupoRecurso.addToDefeitos(defeito)
            grupoRecurso.save()
        }

        removeFromDefeitos.each {
            GrupoRecurso grupoRecurso = GrupoRecurso.get(it)
            grupoRecurso.removeFromDefeitos(defeito)
            grupoRecurso.save()
        }
    }

    List defeitoPorGrupoRecurso(String paramsNome, String paramsGrupoRecurso, String ativo, paramsQuery, max, offset, order) {

        def entities

        String sql
        String isAtivoSql = ativo && ativo != 'TODOS' ? "AND d.ativo = ${ativo == 'ATIVO' ? 1 : 0}" : ''

        if (paramsNome && paramsGrupoRecurso) {
            sql = "select gr.nome as gruporecurso, gpr.*, d.nome as defeito, d.ativo " +
                    "from grupo_recurso_defeito gpr\n" +
                    "inner join grupo_recurso gr on gpr.grupo_id = gr.id\n" +
                    "inner join defeito d on gpr.defeito_id = d.id\n" +
                    "where gpr.grupo_id = ${paramsGrupoRecurso} " +
                    "and upper(d.nome) like upper('%${paramsNome}%') \n" +
                    isAtivoSql +
                    "order by defeito ${order} \n" +
                    "OFFSET ${offset} ROWS FETCH NEXT ${max} ROWS ONLY"

            entities = buscaDefeitosPorGrupoRecurso(sql)

            return entities
        }
        else if (paramsGrupoRecurso) {
            sql = "select gr.nome as gruporecurso, gpr.*, d.nome as defeito, d.ativo " +
                    "from grupo_recurso_defeito gpr \n" +
                    "inner join grupo_recurso gr on gpr.grupo_id = gr.id\n" +
                    "inner join defeito d on gpr.defeito_id = d.id\n" +
                    "where gpr.grupo_id = ${paramsGrupoRecurso} \n" +
                    isAtivoSql +
                    "order by defeito ${order} \n" +
                    "OFFSET ${offset} ROWS FETCH NEXT ${max} ROWS ONLY"

            entities = buscaDefeitosPorGrupoRecurso(sql)
            return entities
        } else {
            def criteria = Defeito.createCriteria()
            entities = criteria.list(paramsQuery, max, offset)

            return entities.collect {new DefeitoDTO(id: it.id, nome: it.nome, grupoRecursos: it.getGrupos(), isAtivo: it.isAtivo)}
        }
    }

    List<DefeitoDTO> buscaDefeitosPorGrupoRecurso(String sql) {

        Query query = sessionFactory.currentSession.createSQLQuery(sql)

        def result = query.list()
        def entidades = []

        result?.each {
            entidades.add(new DefeitoDTO(
                    id: it[2].toLong(),
                    nome: it[3],
                    grupoRecursos: [GrupoRecurso.get(it[1])],
                    isAtivo: it[4]
            ))
        }

        return entidades
    }

    Integer quantidadeDefeitosPorGrupoRecurso(paramsNome, paramsGrupoRecurso, paramsQuery, max, offset) {

        String sql

        if (paramsNome && paramsGrupoRecurso) {
            sql = "select count(*) from grupo_recurso_defeito gpr\n" +
                    "inner join grupo_recurso gr on gpr.grupo_id = gr.id\n" +
                    "inner join defeito d on gpr.defeito_id = d.id\n" +
                    "where gpr.grupo_id = ${paramsGrupoRecurso} and upper(d.nome) like upper('%${paramsNome}%') \n"
            Query queryCount = sessionFactory.currentSession.createSQLQuery(sql)

            Integer total = (Integer) queryCount.list().getAt(0)

            return total
        }
        else if (paramsGrupoRecurso) {
            sql = "select count(*) from grupo_recurso_defeito gpr\n" +
                    "inner join grupo_recurso gr on gpr.grupo_id = gr.id\n" +
                    "inner join defeito d on gpr.defeito_id = d.id\n" +
                    "where gpr.grupo_id = ${paramsGrupoRecurso}"
            Query queryCount = sessionFactory.currentSession.createSQLQuery(sql)

            Integer total = (Integer) queryCount.list().getAt(0)

            return total
        }
        else {
            def criteria = Defeito.createCriteria()
            def entities = criteria.list(paramsQuery, max, offset)
            return entities.size
        }
    }
}
