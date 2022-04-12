package br.com.furukawa.service

import br.com.furukawa.dtos.MotivoDeParadaDTO
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.MotivoDeParada
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.BooleanType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

@Transactional
class MotivoDeParadaService {

    SessionFactory sessionFactory

    void atualizarGrupos(MotivoDeParada entity, List<GrupoRecurso> grupos){
        List<GrupoRecurso> antigos = entity.getGruposRecurso()

        grupos.each {grupo ->
            if (!grupo.motivosDeParada.any({it.id == entity.id})){ // novo
                grupo.addToMotivosDeParada(entity)
                grupo.save(flush: true, failOnError: true)
            }
        }

        antigos.each {grupo ->
            if (!grupos.any({it.id == grupo.id})){ // deletado
                grupo.removeFromMotivosDeParada(entity)
                grupo.save(flush: true, failOnError: true)
            }
        }
    }

    List<MotivoDeParadaDTO> getMotivosDeParada(Fornecedor fornecedor, String motivo, String tipo, String gruposRecurso, String ativo, String sort, String order, int offset, int max){
        String sql = getSqlMotivosDeParada(fornecedor, motivo, tipo, gruposRecurso, ativo, sort, order)

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("motivo", new StringType())
        query.addScalar("tipo", new StringType())
        query.addScalar("isAtivo", new BooleanType())
        query.setResultTransformer(Transformers.aliasToBean(MotivoDeParadaDTO.class))

        query.setFirstResult(offset)
        query.setMaxResults(max)
        List<MotivoDeParadaDTO> list = query.list()
        list.each {
            it.gruposRecurso = getGruposRecursos(it)
        }
        return list
    }

    Integer getTotalMotivosDeParada(Fornecedor fornecedor, String motivo, String tipo, String gruposRecurso, String ativo){
        String sql = getSqlMotivosDeParada(fornecedor, motivo, tipo, gruposRecurso, ativo, null, null)

        String countSql = """SELECT Count(*) 
                        from (${sql})
                      """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(countSql)

        return query.uniqueResult() as Integer
    }

    String getSqlMotivosDeParada(Fornecedor fornecedor, String motivo, String tipo, String gruposRecurso, String ativo, String sort, String order){
        return """
            SELECT DISTINCT mp.id as id,
                mp.motivo as motivo,
                mp.tipo as tipo,
                mp.is_ativo as isAtivo
            FROM motivo_parada mp
                LEFT JOIN GRUPO_RECURSO_PARADAS grp
                    ON mp.id = grp.MOTIVO_PARADA_ID
                LEFT JOIN GRUPO_RECURSO gr
                    ON gr.ID = grp.GRUPO_ID
            WHERE mp.fornecedor_id = '${fornecedor.id}'
                ${motivo ? "AND UPPER(mp.motivo) LIKE UPPER('%${motivo}%')" : ""}
                ${tipo ? "AND mp.tipo = '${tipo}'" : ""}
                ${gruposRecurso ? "AND UPPER(gr.nome) LIKE UPPER('%${gruposRecurso}%')" : ""}
                ${ativo ? ativo != "TODOS" ?  "AND mp.is_ativo = ${ativo == "ATIVO" ? 1 : 0}" : "" : " AND mp.is_ativo = 1"}
            ORDER BY ${sort ?: 'motivo'} ${order ?: 'asc'}
        """
    }

    List<String> getGruposRecursos(MotivoDeParadaDTO motivo){
        String sql = """
            SELECT gr.nome 
            FROM grupo_recurso gr
                INNER JOIN grupo_recurso_paradas grp
                    ON grp.grupo_id = gr.id
            WHERE grp.motivo_parada_id = '${motivo.id}'
       """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        return query.list()
    }

    List<MotivoDeParadaDTO> getMotivosDeParadaSemFiltros(Fornecedor fornecedor){
        String sql = getSqlMotivosDeParada(fornecedor, null, null, null, null, null)

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("motivo", new StringType())
        query.addScalar("tipo", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(MotivoDeParadaDTO.class))

        List<MotivoDeParadaDTO> list = query.list()

        return list
    }
}
