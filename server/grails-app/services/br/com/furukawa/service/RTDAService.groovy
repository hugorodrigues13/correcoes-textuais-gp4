package br.com.furukawa.service

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.dtos.rtda.DadosEnvioRTDA
import br.com.furukawa.dtos.rtda.LinhaDadoRTDA
import br.com.furukawa.model.ConfiguracaoGeral
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.LongType
import org.hibernate.type.StringType

@Transactional
class RTDAService {
    SessionFactory sessionFactory

    HttpURLConnection createConnection(String url, String jsonBody) {
        URL baseURL = new URL(url)
        HttpURLConnection connection = baseURL.openConnection()
        connection.addRequestProperty("Content-Type", "application/json")
        connection.setDoOutput(true)
        connection.setRequestMethod("POST")
        OutputStream os = connection.getOutputStream()

        byte[] input = jsonBody.getBytes("utf-8")
        os.write(input, 0, input.length)

        try {
            os.flush()
            os.close()
        } catch(Exception ignored) {}

        return connection
    }

    void enviarDados() {
        String url = ConfiguracaoGeral.getUrlBaseRTDA()
        List<LinhaDadoRTDA> linhas = buscaDadosRTDAUltimosMinutos(5)
        if(!linhas.isEmpty()) {
            DadosEnvioRTDA dados = new DadosEnvioRTDA(linhas: linhas)
            HttpURLConnection connection = createConnection(url, dados.getJsonString())
            try {
                println "rtda ${new Date()}: ${dados.getJsonString()}"
                println connection.inputStream.text
            } catch(ignored) {

            } finally {
                try {
                    connection.inputStream.close()
                } catch (ignored) {}
            }
        }
    }

    List<LinhaDadoRTDA> buscaDadosRTDAUltimosMinutos(Long quantidadeMinutos) {
        String sql = """SELECT ofa.codigo_produto AS codigoProduto,
                               ofa.numero
                               || '-'
                               || ofa.ano         AS ordemDeFabricacao,
                               Count(sf.id)       AS quantidade,
                               f.prefixo_producao
                               || '-'
                               || op.numero       AS ordemProducao,
                               l.numero_lote
                               || l.semana
                               || l.ano           AS lote,
                               iccomp.valor       AS comprimento,
                               icmod.valor        AS modelo,
                               f.nome             AS fornecedor,
                               o.descricao        AS organizacao,
                               r.nome             AS recurso
                        FROM   gp40.recurso r
                               INNER JOIN gp40.historico_apontamento h
                                       ON h.recurso_id = r.id
                               INNER JOIN gp40.apontamento apo
                                       ON apo.id = h.apontamento_id
                               INNER JOIN gp40.serial_fabricacao sf
                                       ON sf.id = apo.serial_id
                               INNER JOIN gp40.ordem_de_fabricacao ofa
                                       ON ofa.id = sf.ordem_de_fabricacao_id
                               INNER JOIN gp40.ordem_de_producao op
                                       ON op.id = ofa.ordem_de_producao_id
                               INNER JOIN gp40.fornecedor f
                                       ON f.id = op.fornecedor_id
                               INNER JOIN gp40.organizacao o
                                       ON o.organizationid = f.organization_id
                               LEFT JOIN gp40.lote_serial ls
                                      ON ls.serial_id = sf.id
                               LEFT JOIN gp40.lote l
                                      ON l.id = ls.lote_id
                               LEFT JOIN gp40.item_catalogo icmod
                                      ON icmod.codigo_produto = ofa.codigo_produto
                                         AND icmod.organization_id = f.organization_id
                                         AND icmod.nome = '${ItensCatalogoFixos.MODELO}'
                               LEFT JOIN gp40.item_catalogo iccomp
                                      ON iccomp.codigo_produto = ofa.codigo_produto
                                         AND iccomp.organization_id = f.organization_id
                                         AND iccomp.nome = '${ItensCatalogoFixos.COMPRIMENTO}'
                        WHERE  h.data BETWEEN sysdate - 1 / 24 / 60 * ${quantidadeMinutos} AND sysdate
                        GROUP  BY ofa.codigo_produto,
                                  ofa.numero
                                  || '-'
                                  || ofa.ano,
                                  f.prefixo_producao
                                  || '-'
                                  || op.numero,
                                  l.numero_lote
                                  || l.semana
                                  || l.ano,
                                  iccomp.valor,
                                  icmod.valor,
                                  f.nome,
                                  o.descricao,
                                  r.nome
                """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("ordemDeFabricacao", new StringType())
        query.addScalar("quantidade", new LongType())
        query.addScalar("ordemProducao", new StringType())
        query.addScalar("lote", new StringType())
        query.addScalar("comprimento", new StringType())
        query.addScalar("modelo", new StringType())
        query.addScalar("fornecedor", new StringType())
        query.addScalar("organizacao", new StringType())
        query.addScalar("recurso", new StringType())
        query.setResultTransformer(Transformers.aliasToBean(LinhaDadoRTDA.class))


        return query.list()
    }
}
