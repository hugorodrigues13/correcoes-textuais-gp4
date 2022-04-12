package br.com.furukawa.service

import br.com.furukawa.dtos.GrupoRecursoParadaDTO
import br.com.furukawa.dtos.ParadaDTO
import br.com.furukawa.model.Parada
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.HistoricoApontamento
import br.com.furukawa.model.MotivoDeParada
import br.com.furukawa.model.Recurso
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.TimestampType

import java.util.concurrent.TimeUnit

@Transactional
class RecursoService {

    SessionFactory sessionFactory
    CrudService crudService
    ApontamentoService apontamentoService

    List<ParadaDTO> getRecursosNaoParados(){
        String sql = """
            select r.id as recursoId,
                (select max(data) from gp40.historico_apontamento where recurso_id=r.id) as ultimoApontamento,
                max(p1.FIM) as ultimaParada,
                max(gr.TEMPO_MAXIMO_SEM_APONTAMENTO) as tempoMaximo
                    from GP40.RECURSO r
                             INNER JOIN GP40.PARADAS p1 ON p1.RECURSO_ID = r.id
                             inner JOIN GP40.recurso_grupo rg ON rg.recurso_id = r.id                            
                             inner JOIN GP40.GRUPO_RECURSO gr ON gr.ID = rg.GRUPO_ID
                    where not exists (
                            select 1
                            from GP40.PARADAS p
                            where p.RECURSO_ID = r.ID and p.FIM IS NULL
                        )
                    group by r.id

        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("recursoId", new LongType())
        query.addScalar("ultimoApontamento", new TimestampType())
        query.addScalar("ultimaParada", new TimestampType())
        query.addScalar("tempoMaximo", new LongType())
        query.setResultTransformer(Transformers.aliasToBean(ParadaDTO.class))
        return query.list()
    }

    void verificarParadas(){
        List<ParadaDTO> naoParados = getRecursosNaoParados()
        naoParados.each {recurso ->
            Date agora = new Date()
            long ultimo = Math.max(recurso.ultimaParada?.getTime() ?: -1, recurso.ultimoApontamento?.getTime() ?: -1)
            long diferenca = TimeUnit.SECONDS.convert(Math.abs(ultimo - agora.getTime()), TimeUnit.MILLISECONDS)
            if (diferenca >= recurso.tempoMaximo){
                Parada parada = new Parada()
                parada.inicio = new Date(ultimo)
                parada.recurso = Recurso.get(recurso.recursoId)
                parada.save(flush: true, failOnError: true)
            }
        }
    }

    List<MotivoDeParada> getMotivosDeParada(Recurso recurso){
        HistoricoApontamento ultimoApontamento = !recurso.getHistoricoApontamentos().isEmpty() ?  recurso.getHistoricoApontamentos()?.last() : null
        GrupoRecurso grupoRecurso = ultimoApontamento?.grupoRecurso

        Set<MotivoDeParada> motivos = grupoRecurso?.getMotivosDeParada()
        if (!motivos){
            List<GrupoRecurso> grupos = GrupoRecurso.createCriteria().list {
                recursos {
                    eq "id", recurso.id
                }
            }
            motivos = grupos*.motivosDeParada.flatten()
        }
        return motivos.findAll({it.isAtivo}).sort({it.motivo})
    }

    GrupoRecursoParadaDTO criarParadaInicial(Recurso recurso){
        Parada parada = recurso.getParadaAtiva()

        GrupoRecursoParadaDTO ultimoApontamento = apontamentoService.getGrupoRecursoParadas(recurso.id) ?: new GrupoRecursoParadaDTO()

        if ((parada == null && recurso.paradas.isEmpty())){
            parada = new Parada()
            parada.inicio = ultimoApontamento?.data ?: new Date()
            parada.recurso = recurso
            recurso.addToParadas(parada)
            crudService.salvar(parada)
        }

        ultimoApontamento?.parada = parada

        return ultimoApontamento
    }
}
