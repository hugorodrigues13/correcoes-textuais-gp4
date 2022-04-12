package br.com.furukawa.service

import br.com.furukawa.dtos.AuditLogDTO
import br.com.furukawa.dtos.filtros.FiltroAuditLog

import br.com.furukawa.model.LogOperacao
import br.com.furukawa.utils.Audit
import grails.gorm.transactions.Transactional
import org.hibernate.Query
import org.hibernate.SessionFactory

import java.text.Normalizer

@Transactional
class AuditoriaService {

    def grailsApplication

    SessionFactory sessionFactory

    def pesquisaDeAuditLog(FiltroAuditLog filter) {

        String where = " WHERE 1=1 "
        String orderBy = ""
        def args = [:]

        if(filter.username){
            where += " AND translate(UPPER(a.actor), 'ŠŽšžŸÁÇÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕËÜÏÖÑÝ', 'SZszYACEIOUAEIOUAEIOUAOEUIONY') like UPPER(:username) "
            args["username"] = Normalizer.normalize(filter.username, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "") + "%"
        }

        if(filter.periodo?.dataInicial && filter.periodo?.dataFinal){
            where += " AND a.date_Created BETWEEN :dtinicial AND :dtfinal "
            args["dtinicial"] = filter.periodo.dataInicial
            args["dtfinal"] = filter.periodo.dataFinal
        }

        if(filter.periodoAtualizacao?.dataInicial && filter.periodoAtualizacao?.dataFinal){
            where += " AND a.last_updated BETWEEN :dtAtinicial AND :dtAtfinal "
            args["dtAtinicial"] = filter.periodoAtualizacao.dataInicial
            args["dtAtfinal"] = filter.periodoAtualizacao.dataFinal
        }

        if(filter.tipo){
            where += " AND a.class_Name = :entidade "
            args["entidade"] = filter.tipo
        }

        if(filter.operacao){
            where += " AND a.event_Name = :operacao "
            args["operacao"] = filter.operacao.toUpperCase()
        }

        if(filter.entidade){
            where += " AND a.class_Name = :entidade "
            args["entidade"] = filter.entidade
        }

        if (filter.valorAntigo){
            where += " AND UPPER(a.old_value) LIKE UPPER(:valorAntigo) "
            args["valorAntigo"] = Normalizer.normalize(filter.valorAntigo, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "") + "%"
        }

        if (filter.valorNovo){
            where += " AND UPPER(a.new_value) LIKE UPPER(:valorNovo) "
            args["valorNovo"] = Normalizer.normalize(filter.valorNovo, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "") + "%"
        }

        if (filter.propriedade){
            where += " AND UPPER(a.property_name) LIKE UPPER(:propriedade) "
            args["propriedade"] = Normalizer.normalize(filter.propriedade, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "") + "%"
        }

        if (filter.entidadeId){
            where += " AND a.persisted_object_id = :entidadeId "
            args["entidadeId"] = filter.entidadeId
        }

        if(filter.ordenacao.order && filter.ordenacao.sort){
            if(filter.ordenacao.sort == "id"){
                filter.ordenacao.sort = "persisted_Object_Id"
            }
            if(filter.ordenacao.sort == "lastUpdated"){
                filter.ordenacao.sort = "last_Updated"
            }
            if(filter.ordenacao.sort == "className"){
                filter.ordenacao.sort = "class_Name"
            }
            if(filter.ordenacao.sort == "eventName"){
                filter.ordenacao.sort = "event_Name"
            }
            orderBy = " ORDER BY a.${filter.ordenacao.sort} ${filter.ordenacao.order} "
        }

        def sqlList = """
            SELECT DISTINCT
                a.persisted_Object_Version,
                a.persisted_Object_Id,
                a.actor,
                a.event_Name,
                a.class_Name,
                to_char(a.date_Created, 'DD/MM/YYYY HH24:MI:SS'),
                to_char(a.last_Updated, 'DD/MM/YYYY HH24:MI:SS'),
                a.id
            FROM audit_log a
            $where
            $orderBy
            """

        def sqlCount = """
            SELECT count(*)
            FROM ($sqlList)
            """

        Query queryTotal = sessionFactory.currentSession.createSQLQuery(sqlCount)
        args.each {
            queryTotal.setParameter(it.key, it.value)
        }
        def total = queryTotal.uniqueResult()

        Query query = sessionFactory.currentSession.createSQLQuery(sqlList)

        args.each {
            query.setParameter(it.key, it.value)
        }

        query.setMaxResults(filter.max)
        query.setFirstResult(filter.offset)

        def result = query.list()

        def entidades = []

        result?.each {
            entidades.add(new AuditLogDTO(
                    persistedObjectVersion : it[0],
                    persistedObjectId : it[1],
                    actor : it[2],
                    eventName : it[3],
                    className: AuditLogDTO.trunkClassName(it[4]),
                    dateCreated : it[5],
                    lastUpdated : it[6],
                    id: it[7]
            ))
        }

        return [
                "entities": entidades,
                "total": total,
                "classesAuditadas" : listaTodasClassesAuditadas()
        ]
    }

    def pesquisaDeLogOperacao(FiltroAuditLog filter) {

        def criteria = LogOperacao.createCriteria()

        def entidades = criteria.list({

            if(filter.username){
                eq('usuario', filter.username)
            }

            if(filter.periodo?.dataInicial && filter.periodo?.dataFinal){
                between("data", filter.periodo.dataInicial, filter.periodo.dataFinal )
            }

            if(filter.tipo){
                eq("tipoLogOperacao", filter.tipo)
            }

            if(filter.ordenacao?.sort) {
                order(filter.ordenacao?.sort, filter.ordenacao?.order)
            }else
            {
                order("id", "desc")
                order("tipoLogOperacao", "asc")
            }

        }, max: limit?:10, offset: offset?:0)

        return [
                "entities": entidades,
                "total": entities?.totalCount
        ]
    }

    def listaTodasClassesAuditadas(){
        return Audit.listaClassesAuditadas(grailsApplication)?.collect {
            [id : it.canonicalName, descricao : it.simpleName]
        }
    }
}
