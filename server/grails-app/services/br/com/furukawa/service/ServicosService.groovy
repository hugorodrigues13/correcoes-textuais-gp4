package br.com.furukawa.service

import br.com.furukawa.exceptions.ServicosException
import br.com.furukawa.model.Produto
import br.com.furukawa.model.User
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.SpringSecurityService
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.Future
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

@Transactional
class ServicosService {
    SessionFactory sessionFactory
    SpringSecurityService springSecurityService

    def pegarParametroEValidar(def params, String param, Closure validacao, Closure retornar, boolean opcional, String message = null){
        def parametro = params."$param"
        if (!parametro && !opcional){
            throw new ServicosException(message ?: 'servicos.comum.faltaParametro.message', [param] as Object[], 400)
        }
        if (parametro && !validacao(parametro)){
            throw new ServicosException(message ?: 'servicos.comum.parametroInvalido.message', [param] as Object[], 400)
        }
        def objeto = parametro ? retornar(parametro) : null
        if (!objeto && !opcional){
            throw new ServicosException(message ?: 'servicos.comum.parametroNaoEncontrado.message', [param] as Object[], 404)
        }
        return objeto
    }

    def pegarParametro(def params, String param, Closure retornar, boolean opcional=false){
        return pegarParametroEValidar(params,param, {true}, retornar, opcional)
    }

    Produto getProduto(String filtro) {
        String sql = """SELECT DISTINCT P.id
                        FROM   produto P
                               LEFT JOIN codigo_dun CD
                                      ON CD.produto_id = P.id
                               LEFT JOIN (SELECT L.id,
                                                 L.codigo_produto,
                                                 numero_lote,
                                                 semana,
                                                 ano,
                                                 F.organization_id
                                          FROM   lote L
                                                 INNER JOIN grupo_linha_producao GLP
                                                         ON GLP.id = L.grupo_linha_de_producao_id
                                                 INNER JOIN fornecedor F
                                                         ON F.id = GLP.fornecedor_id) C
                                      ON P.organization_id = C.organization_id
                                         AND P.codigo = C.codigo_produto
                        WHERE  ( upper(CD.codigo) = upper('${filtro}')
                                  OR upper(C.numero_lote
                                     || C.semana
                                     || C.ano) = upper('${filtro}')
                                  OR upper(P.codigo_ean_13) = upper('${filtro}') )
                               AND rownum = 1 
                """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return Produto.read(query.uniqueResult())
    }

    boolean validarLogin(String token) {
        User user = User.findByTokenIlike(token)
        return user ? true : false
    }

    void checkConnection(Boolean simulate) {
        ExecutorService executor = Executors.newSingleThreadExecutor()
        Future f = executor.submit(new Runnable() {
            @Override
            public void run() throws Exception {
                if(simulate) {
                    Thread.sleep(20 * 1000)
                }
                String sql = "select 1 from dual"
                User.withTransaction {
                    sessionFactory.currentSession.createSQLQuery(sql).uniqueResult()
                }
            }
        })
        try {
            f.get(10, TimeUnit.SECONDS)
        } catch (TimeoutException e) {
            throw new TimeoutException("Timeout após 10!")
        }
    }
}
