package br.com.furukawa.service

import br.com.furukawa.dtos.LogOperacaoDTO
import br.com.furukawa.dtos.OrdemDeFabricacaoDTO
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.model.HistoricoApontamento
import br.com.furukawa.model.LogOperacao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.Parada
import br.com.furukawa.model.ParametroLogOperacao
import br.com.furukawa.model.SerialFabricacao
import br.com.furukawa.model.User
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.transform.Transformers
import org.hibernate.type.*

import javax.persistence.Query

@Transactional
class LogOperacaoService {
    SessionFactory sessionFactory
    UserService userService

    void gerarLogOperacao(TipoLogOperacao tipoLogOperacao, Map<TipoParametroLogOperacao, String> parametros) {
        User user = userService.getUsuarioLogado()

        LogOperacao logOperacao = new LogOperacao(tipoLogOperacao: tipoLogOperacao, usuario: user.username)
        parametros.each {parametro ->
            logOperacao.addToParametros(new ParametroLogOperacao(tipo: parametro.key, valor: parametro.value))
        }
        logOperacao.save(flush: true, failOnError: true)
    }

    void fecharLoteIncompleto(String codigoLote, String justificativa){
        Map<TipoParametroLogOperacao, String> parametros = new HashMap<>()
        parametros.put(TipoParametroLogOperacao.CODIGO_LOTE, codigoLote)
        parametros.put(TipoParametroLogOperacao.JUSTIFICATIVA, justificativa)

        gerarLogOperacao(TipoLogOperacao.FECHAR_LOTE_INCOMPLETO, parametros)
    }

    void imprimirEtiquetaOF(OrdemDeFabricacao ordemFabricacao, String justificativa){
        Map<TipoParametroLogOperacao, String> parametros = new HashMap<>()
        parametros.put(TipoParametroLogOperacao.ORDEM_FABRICACAO, ordemFabricacao.getCodigoOrdemDeFabricacao())
        parametros.put(TipoParametroLogOperacao.JUSTIFICATIVA, justificativa)

        gerarLogOperacao(TipoLogOperacao.IMPRIMIR_ETIQUETA_OF, parametros)
    }

    void reimprimirEtiquetaSerial(String codigoSerial){
        Map<TipoParametroLogOperacao, String> parametros = new HashMap<>()
        parametros.put(TipoParametroLogOperacao.SERIAL, codigoSerial)

        gerarLogOperacao(TipoLogOperacao.REIMPRESSAO_ETIQUETA_SERIAL, parametros)
    }

    boolean existeLogOperacao(TipoLogOperacao tipoLogOperacao, TipoParametroLogOperacao tipoParametroLogOperacao, String valor) {
        int totalLogs = LogOperacao.createCriteria().get {
            parametros {
                eq('tipo', tipoParametroLogOperacao)
                eq('valor', valor)
            }

            eq('tipoLogOperacao', tipoLogOperacao)

            projections {
                count('id')
            }
        }

        return totalLogs > 0
    }

    void estornarApontamento(SerialFabricacao serial, Set<HistoricoApontamento> estornados, String justificativa, String lote, String caixa) {
        estornados.each {historico ->
            Map<TipoParametroLogOperacao, String> parametros = [:]
            parametros.put(TipoParametroLogOperacao.JUSTIFICATIVA, justificativa)
            parametros.put(TipoParametroLogOperacao.SERIAL, serial.getCodigoCompleto())
            parametros.put(TipoParametroLogOperacao.RECURSO, historico.recurso.nome)
            parametros.put(TipoParametroLogOperacao.GRUPO_RECURSO, historico.grupoRecurso.nome)
            parametros.put(TipoParametroLogOperacao.DEFEITO, historico.defeito?.nome ?: "Nenhum")
            parametros.put(TipoParametroLogOperacao.OPERADOR, historico.operador.fullname)
            parametros.put(TipoParametroLogOperacao.DATA_APONTAMENTO, historico.dataFormatada)
            if(lote) {
                parametros.put(TipoParametroLogOperacao.CODIGO_LOTE, lote)
            }

            if(caixa) {
                parametros.put(TipoParametroLogOperacao.NUMERO_CAIXA, caixa)
            }

            gerarLogOperacao(TipoLogOperacao.ESTORNAR_APONTAMENTO, parametros)
        }

    }

    void estornarApontamentoOF(OrdemDeFabricacao ordemDeFabricacao, String justificativa) {
        Map<TipoParametroLogOperacao, String> parametros = [:]
        parametros.put(TipoParametroLogOperacao.ORDEM_PRODUCAO, ordemDeFabricacao.getCodigoOrdemDeFabricacao())
        parametros.put(TipoParametroLogOperacao.JUSTIFICATIVA, justificativa)

        gerarLogOperacao(TipoLogOperacao.ESTORNAR_APONTAMENTO_OF, parametros)
    }

    void liberarOrdemFabricacao(OrdemDeFabricacao ordemFabricacao, String justificativa){
        Map<TipoParametroLogOperacao, String> parametros = new HashMap<>()
        parametros.put(TipoParametroLogOperacao.ORDEM_FABRICACAO, ordemFabricacao.getCodigoOrdemDeFabricacao())
        parametros.put(TipoParametroLogOperacao.JUSTIFICATIVA, justificativa)

        gerarLogOperacao(TipoLogOperacao.LIBERAR_OF, parametros)
    }


    void enviarOFParaSeparacao(OrdemDeFabricacao ordemFabricacao, String justificativa){
        Map<TipoParametroLogOperacao, String> parametros = new HashMap<>()
        parametros.put(TipoParametroLogOperacao.ORDEM_FABRICACAO, ordemFabricacao.getCodigoOrdemDeFabricacao())
        parametros.put(TipoParametroLogOperacao.JUSTIFICATIVA, justificativa)

        gerarLogOperacao(TipoLogOperacao.ENVIAR_OF_PARA_SEPARACAO, parametros)
    }

    void dividirLotes(Lote loteAntigo, Lote loteNovo){
        User user = userService.getUsuarioLogado()

        LogOperacao logOperacao = new LogOperacao(tipoLogOperacao: TipoLogOperacao.DIVIDIR_LOTE, usuario: user.username)
        logOperacao.addToParametros(new ParametroLogOperacao(tipo: TipoParametroLogOperacao.CODIGO_LOTE, valor: loteAntigo.codigoLote))
        logOperacao.addToParametros(new ParametroLogOperacao(tipo: TipoParametroLogOperacao.CODIGO_LOTE, valor: loteNovo.codigoLote))
        logOperacao.save(flush: true, failOnError: true)
    }

    void agruparLotes(Lote lote1, Lote lote2){
        User user = userService.getUsuarioLogado()

        LogOperacao logOperacao = new LogOperacao(tipoLogOperacao: TipoLogOperacao.AGRUPAR_LOTE, usuario: user.username)
        logOperacao.addToParametros(new ParametroLogOperacao(tipo: TipoParametroLogOperacao.CODIGO_LOTE, valor: lote1.codigoLote))
        logOperacao.addToParametros(new ParametroLogOperacao(tipo: TipoParametroLogOperacao.CODIGO_LOTE, valor: lote2.codigoLote))
        logOperacao.save(flush: true, failOnError: true)
    }

    void dividirParadas(Parada paradaOrigem, Parada segundaParada, String justificativa){
        User user = userService.getUsuarioLogado()

        LogOperacao logOperacao = new LogOperacao(tipoLogOperacao: TipoLogOperacao.DIVIDIR_PARADA, usuario: user.username)
        logOperacao.addToParametros(new ParametroLogOperacao(tipo: TipoParametroLogOperacao.PARADA, valor: paradaOrigem.id))
        logOperacao.addToParametros(new ParametroLogOperacao(tipo: TipoParametroLogOperacao.PARADA, valor: segundaParada.id))
        logOperacao.addToParametros(new ParametroLogOperacao(tipo: TipoParametroLogOperacao.JUSTIFICATIVA, valor: justificativa))
        logOperacao.save(flush: true, failOnError: true)
    }

    List <LogOperacaoDTO> buscarLogOperacaoOF(String ordemDeFabricacao, TipoLogOperacao tipoLogOperacao, Long fornecedorId){
        String sql = """
                SELECT
                    LO.ID,
                    LO.USUARIO,
                    TO_CHAR(LO.DATA, 'DD/MM/YYYY HH24:mi') as DATA,
                    (
                        SELECT PLOG.VALOR
                        FROM PARAMETRO_LOG_OPERACAO PLOG
                        WHERE PLOG.LOG_OPERACAO_ID = LO.ID AND PLOG.TIPO = '${TipoParametroLogOperacao.JUSTIFICATIVA}'
                    ) AS JUSTIFICATIVA
                FROM LOG_OPERACAO LO
                INNER JOIN PARAMETRO_LOG_OPERACAO PLO ON PLO.LOG_OPERACAO_ID = LO.ID
                INNER JOIN ORDEM_DE_FABRICACAO ODF ON ODF.NUMERO||'-'||ODF.ANO = PLO.VALOR
                WHERE
                    ODF.NUMERO||'-'||ODF.ANO = '${ordemDeFabricacao}'
                    AND LO.TIPO_LOG_OPERACAO = '${tipoLogOperacao.name()}'
                    AND ODF.FORNECEDOR_ID = ${fornecedorId}
                """

        Query query = sessionFactory.currentSession.createSQLQuery(sql)

        query.addScalar("id", new LongType())
        query.addScalar("usuario", new StringType())
        query.addScalar("data", new StringType())
        query.addScalar("justificativa", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(LogOperacaoDTO.class))

        return query.list() as List <LogOperacaoDTO>

    }

}
