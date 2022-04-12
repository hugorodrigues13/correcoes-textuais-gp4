package br.com.furukawa.service

import br.com.furukawa.dtos.ParadaComMotivoDTO
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.Parada
import br.com.furukawa.model.Recurso
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.DateType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import java.text.SimpleDateFormat

@Transactional
class ParadaService {

    SessionFactory sessionFactory
    LogOperacaoService logOperacaoService

    List<ParadaComMotivoDTO> getMotivo(Fornecedor fornecedor, Long recurso, Integer max, Integer offset, Date dataInicioParadaIncial, Date dataInicioParadaFinal, Date dataFimParadaIncial, Date dataFimParadaFinal, String sort, String order) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yy HH:mm:ss")

        String sql = """SELECT     gp.id                                       AS paradaid,
                                   To_char(gp.fim, 'DD/MM/YYYY HH24:MI:SS')    AS fim,
                                   To_char(gp.inicio, 'DD/MM/YYYY HH24:MI:SS') AS inicio,
                                   gp.motivo_id                                AS motivoid,
                                   gr.nome                                     AS recurso,
                                   gr.id                                       AS recursoid,
                                   gmp.motivo                                  AS motivo
                        FROM       paradas gp
                        LEFT JOIN  motivo_parada gmp
                        ON         gp.motivo_id = gmp.id
                        INNER JOIN recurso gr
                        ON         gr.id = gp.recurso_id
                        WHERE      gmp.fornecedor_id = ${fornecedor.id} 
                        ${ recurso ? " AND gp.recurso_id = '${recurso}' " : ""} 
                        ${ dataInicioParadaIncial && dataInicioParadaFinal ? " AND gp.inicio BETWEEN To_date('${sdf.format(dataInicioParadaIncial)}', 'DD/MM/YY HH24:MI:SS') AND To_date('${sdf.format(dataInicioParadaFinal)}', 'DD/MM/YY HH24:MI:SS') " : ""} 
                        ${ dataFimParadaIncial && dataFimParadaFinal ? " AND gp.fim BETWEEN To_date('${sdf.format(dataFimParadaIncial)}', 'DD/MM/YY HH24:MI:SS') AND To_date('${sdf.format(dataFimParadaFinal)}', 'DD/MM/YY HH24:MI:SS') " : ""} 
                        ORDER BY   ${sort} ${order}
                    """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("paradaID", new LongType())
        query.addScalar("motivo", new StringType())
        query.addScalar("motivoID", new LongType())
        query.addScalar("inicio", new StringType())
        query.addScalar("fim", new StringType())
        query.addScalar("recursoID", new LongType())
        query.addScalar("recurso", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(ParadaComMotivoDTO.class))

        query.setFirstResult(offset)
        query.setMaxResults(max)

        List<ParadaComMotivoDTO> list = query.list()

        return list
    }

    Integer totalMotivos(Fornecedor fornecedor, Long recurso, Date dataInicioParadaIncial, Date dataInicioParadaFinal, Date dataFimParadaIncial, Date dataFimParadaFinal) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yy HH:mm:ss")

        String sql = """SELECT Count(*)
                        FROM paradas gp 
                        LEFT JOIN motivo_parada gmp ON gp.motivo_id = gmp.id
                        INNER JOIN recurso gr ON gr.id = gp.recurso_id
                        WHERE gmp.fornecedor_id = ${fornecedor.id}
                        ${ recurso ? " AND gp.recurso_id = '${recurso}' " : ""}
                        ${ dataInicioParadaIncial && dataInicioParadaFinal ? " " +
                        " AND gp.inicio BETWEEN To_date('${sdf.format(dataInicioParadaIncial)}', 'DD/MM/YY HH24:MI:SS') " +
                        " AND To_date('${sdf.format(dataInicioParadaFinal)}', 'DD/MM/YY HH24:MI:SS') " : ""}
                        ${ dataFimParadaIncial && dataFimParadaFinal ? " " +
                        " AND gp.fim BETWEEN To_date('${sdf.format(dataFimParadaIncial)}', 'DD/MM/YY HH24:MI:SS') " +
                        " AND To_date('${sdf.format(dataFimParadaFinal)}', 'DD/MM/YY HH24:MI:SS') " : ""}
                     """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.list()[0]
    }

    void atualizarMotivoParada (Long motivoID, Long paradaID) {
        String sql = """UPDATE paradas SET motivo_id = ${motivoID}
                        WHERE id = ${paradaID}   
                     """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.executeUpdate()
    }

    void dividirParadas(Long idParadaOrigem, MotivoDeParada motivoParadaOrigem, Map<String, Date> periodoParadaOrigem, MotivoDeParada motivoNovaParada, Map<String, Date> periodoNovaParada, String justificativa ){
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss")

        Parada paradaOrigem = Parada.get(idParadaOrigem)
        Recurso recurso = paradaOrigem.recurso
        Parada novaParada = new Parada()

        paradaOrigem.motivo = motivoParadaOrigem
        paradaOrigem.inicio = periodoParadaOrigem.dataInicioParada
        paradaOrigem.fim = periodoParadaOrigem.dataFimParada

        novaParada.recurso = recurso
        novaParada.motivo = motivoNovaParada
        novaParada.inicio = periodoNovaParada.dataInicioParada
        novaParada.fim = periodoNovaParada.dataFimParada

        paradaOrigem.save(flush: true, failOnError: true)
        novaParada.save(flush: true, failOnError: true)

        logOperacaoService.dividirParadas(paradaOrigem, novaParada, justificativa)
    }

}
