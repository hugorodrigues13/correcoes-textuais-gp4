package br.com.furukawa.service

import br.com.furukawa.dtos.ClassePorPlanejadorDTO
import br.com.furukawa.model.Organizacao
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.StringType

class ClassePorPlanejadorService {
    SessionFactory sessionFactory

    Long getClassePorPlanejador(String planejador, Organizacao organizacao) {
        String sql = """SELECT cp.classe_id as classe FROM classe_planejador cp
                        inner join classe_por_planejador cpp on cpp.id=cp.classe_id
                                 WHERE cp.planejador = '${planejador}' and ROWNUM=1
                                 AND cpp.ORGANIZACAO_ID=${organizacao.id}"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    List<ClassePorPlanejadorDTO> getClassesPorPlanejador(String classeContabil, String planejador, int max, int offset, String order, String sort, Organizacao organizacao){
        String sql = getClassesPorPlanejadorSql(classeContabil, planejador, order, sort, organizacao)
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("classeContabil", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(ClassePorPlanejadorDTO.class))

        query.setFirstResult(offset)
        query.setMaxResults(max)
        List<ClassePorPlanejadorDTO> dtos = query.list()
        dtos.each {it.planejadores = getPlanejadoresFromClasse(it.id)}
        return dtos
    }

    int getClassesPorPlanejadorTotal(String classeContabil, String planejador, Organizacao organizacao ){
        String sql = getClassesPorPlanejadorSql(classeContabil, planejador, null, null, organizacao)

        String countSql = """SELECT Count(*) 
                        from (${sql})
                      """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(countSql)

        return query.uniqueResult() as Integer
    }

    List<String> getPlanejadoresFromClasse(long id){
        String sql = """
                SELECT cp.planejador as planejador
                FROM classe_planejador cp
                WHERE cp.classe_id = $id
        """


        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.list()
    }

    String getClassesPorPlanejadorSql(String classeContabil, String planejador, String order, String sort, Organizacao organizacao){
        return """
            SELECT DISTINCT p.id as id,
                   p.classe_contabil as classeContabil
            FROM classe_por_planejador p
                LEFT JOIN classe_planejador cp
                    ON cp.classe_id = p.id
            WHERE p.organizacao_id = ${organizacao.id}
                ${classeContabil ? "AND UPPER(p.classe_contabil) LIKE UPPER('%$classeContabil%')" : ""}
                ${planejador ? "AND UPPER(cp.planejador) LIKE UPPER('%$planejador%')" : ""}
            ORDER BY p.classe_contabil ${order ?: "ASC"}
        """
    }

}
