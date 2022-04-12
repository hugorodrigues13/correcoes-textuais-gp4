package br.com.furukawa.service

import br.com.furukawa.dtos.MotivoDeParadaDTO
import br.com.furukawa.dtos.ProducaoMensalDTO
import br.com.furukawa.dtos.asaichi.ApontamentoMensal
import br.com.furukawa.dtos.asaichi.ObservacaoApontamentoDiarioDTO
import br.com.furukawa.dtos.filtros.FiltroApontamentoMensal
import br.com.furukawa.dtos.filtros.FiltroProducao
import br.com.furukawa.model.Conector
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.LinhaDeProducao
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import java.text.SimpleDateFormat

@Transactional
class PesquisaService {
    AsaichiService asaichiService
    SessionFactory sessionFactory

    List<String> getOrdensProducao(Fornecedor fornecedor, String codigoOP){
        String sql = """
            SELECT DISTINCT f.prefixo_producao || '-' || op.numero
            FROM ORDEM_DE_PRODUCAO op
                JOIN FORNECEDOR f
                    ON f.id = op.FORNECEDOR_ID
            WHERE op.FORNECEDOR_ID = '${fornecedor.id}'
            ${codigoOP ? "AND UPPER(f.prefixo_producao || '-' || op.numero) LIKE UPPER('%${codigoOP}%')" : ''}
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.setMaxResults(10)
        return query.list()
    }

    List<String> getOrdensFabricacao(Fornecedor fornecedor, String codigoOF){
        String sql = """
            SELECT DISTINCT gof.numero || '-' || gof.ano
            FROM ORDEM_DE_FABRICACAO gof
            WHERE gof.FORNECEDOR_ID = '${fornecedor.id}'
            ${codigoOF ? "AND UPPER(gof.numero || '-' || gof.ano) LIKE UPPER('%${codigoOF}%')" : ""}
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.setMaxResults(10)
        return query.list()
    }

    List<String> getCodigosProdutos(Fornecedor fornecedor, String codigoProduto){
        String sql = """
            SELECT DISTINCT gof.CODIGO_PRODUTO
            FROM ORDEM_DE_FABRICACAO gof
            WHERE gof.FORNECEDOR_ID = '${fornecedor.id}'
            ${codigoProduto ? "AND UPPER(gof.CODIGO_PRODUTO) LIKE UPPER('%${codigoProduto}%')" : ""}
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.setMaxResults(10)
        return query.list()
    }

    List<String> getLotes(Fornecedor fornecedor, String numeroLote){
        String sql = """
            SELECT DISTINCT l.NUMERO_LOTE || l.semana || l.ANO
            FROM LOTE l
                inner JOIN GRUPO_LINHA_PRODUCAO gldp
                    ON gldp.id = l.GRUPO_LINHA_DE_PRODUCAO_ID
            WHERE gldp.FORNECEDOR_ID = '${fornecedor.id}'
            ${numeroLote ? "AND UPPER(l.NUMERO_LOTE || l.semana || l.ANO) LIKE UPPER('%${numeroLote}%')" : ""}
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.setMaxResults(10)
        return query.list()
    }

    List<String> getLinhasDeProducao(Fornecedor fornecedor){
        String sql = """
            SELECT DISTINCT ldp.nome
            FROM gp40.LINHA_DE_PRODUCAO ldp
            WHERE ldp.FORNECEDOR_ID = '${fornecedor.id}' and ldp.ativo = 1
            ORDER BY ldp.nome ASC
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        return query.list()
    }

    List<String> getTurnos(Fornecedor fornecedor){
        String sql = """
            SELECT DISTINCT t.nome
            FROM gp40.TURNO t
            WHERE t.FORNECEDOR_ID = '${fornecedor.id}'
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        return query.list()
    }

    List<String> getTurnos(String dia, Fornecedor fornecedor){
        String sql = """
select distinct t.nome from
            (select td.* from gp40.TURNO_DURACAO td             
inner join gp40.turno_duracao_dias tdd on tdd.turno_duracao_id=td.id  
                    where tdd.dia_da_semana=(
                    case to_char(to_date('${dia}', 'DD/MM/YYYY'), 'D')
                    when '1' then 'DOMINGO'
                    WHEN '2' THEN 'SEGUNDA'
                    WHEN '3' THEN 'TERCA'
                    WHEN '4' THEN 'QUARTA'
                    WHEN '5' THEN 'QUINTA'
                    WHEN '6' THEN 'SEXTA'
                    WHEN '7' THEN 'SABADO' END)) td                
inner join gp40.turno_duracao_dias tdd on tdd.turno_duracao_id=td.id  
inner join gp40.TURNO t ON td.TURNO_ID = t.id
where t.fornecedor_id=${fornecedor.id}
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        return query.list()
    }

    List<ObservacaoApontamentoDiarioDTO> getObservacoesDiarias(String dia, String linhasProducao, Fornecedor fornecedor){
        String sql = """
            SELECT DISTINCT   t.nome as turno, pld.observacao
            FROM gp40.planejamento_diario pld
            INNER JOIN gp40.turno t on t.id = pld.turno_id
            INNER JOIN gp40.LINHA_DE_PRODUCAO ldp on ldp.nome = '${linhasProducao}'
            WHERE to_char(pld.data, 'dd/MM/yyyy') = '${dia}' 
              and t.FORNECEDOR_ID = '${fornecedor.id}' 
             and pld.observacao is not null
           
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("observacao", new StringType())
        query.addScalar("turno", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(ObservacaoApontamentoDiarioDTO.class))
        return query.list()
    }

    List<String> getGruposLinhasDeProducao(Fornecedor fornecedor){
        String sql = """
            SELECT DISTINCT gldp.nome
            FROM gp40.GRUPO_LINHA_PRODUCAO gldp
            WHERE gldp.FORNECEDOR_ID = '${fornecedor.id}' AND gldp.is_ativo = 1
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        return query.list()
    }

    List<String> getGruposRecursos(Fornecedor fornecedor){
        String sql = """
            SELECT DISTINCT gr.nome
            FROM GRUPO_RECURSO gr
            WHERE gr.FORNECEDOR_ID = '${fornecedor.id}' AND gr.is_ativo = 1
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        return query.list()
    }

    List<String> getRecursos(Fornecedor fornecedor){
        String sql = """
            SELECT DISTINCT r.nome
            FROM RECURSO r
            WHERE r.FORNECEDOR_ID = '${fornecedor.id}' and r.is_ativo = 1
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        return query.list()
    }

    List<MotivoDeParadaDTO> getMotivosDeParadaComId(Fornecedor fornecedor) {
        String sql = """
            SELECT DISTINCT m.id, m.motivo
            FROM MOTIVO_PARADA m
            WHERE m.FORNECEDOR_ID = '${fornecedor.id}'
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("id", new LongType())
        query.addScalar("motivo", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(MotivoDeParadaDTO.class))
        return query.list()
    }

    List<String> getConectores() {
        return Conector.createCriteria().list {
            projections {
                property('descricao')
            }
        } as ArrayList<String>
    }

    List<ProducaoMensalDTO> getProducaoMental(FiltroProducao filtro, Fornecedor fornecedor){
        List<ProducaoMensalDTO> producaoMensalGroupByMes
        List<ApontamentoMensal> producaoMensal = asaichiService.getApontamentoMensal(filtro, fornecedor)

        producaoMensalGroupByMes = producaoMensal.collect {it.getDadosFormatados()}.flatten().groupBy {  [ it.mes,  it.codigoProduto,  it.grupoLinha ]}.collect{
                new ProducaoMensalDTO(
                        conectores: it.value*.conectores.sum(),
                        produzido: it.value*.produzido.sum(),
                        mes: it.value*.mes.first(),
                        grupoLinha: it.value*.grupoLinha.first(),
                        codigoProduto: it.value*.codigoProduto.first(),
                )

            }

        return producaoMensalGroupByMes
    }

}
