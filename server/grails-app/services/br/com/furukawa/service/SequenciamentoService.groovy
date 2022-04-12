package br.com.furukawa.service

import br.com.furukawa.constantes.ItensCatalogoFixos
import br.com.furukawa.dtos.OrdemDeFabricacaoDTO
import br.com.furukawa.dtos.OrdemDeProducaoSequenciamentoDTO
import br.com.furukawa.enums.StatusOrdemDeProducaoWIP
import br.com.furukawa.dtos.OrdemFabricacaoSequenciamentoDTO
import br.com.furukawa.dtos.OrdenacaoDTO
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.enums.StatusOrdemProducao
import br.com.furukawa.enums.StatusSerialFabricacao
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.exceptions.SequenciamentoException
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.MateriaPrimaSeparacao
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.SerialFabricacao
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.hibernate.type.BooleanType
import org.hibernate.type.DateType
import org.hibernate.type.IntegerType
import org.hibernate.type.LongType
import org.hibernate.type.StringType

import javax.persistence.Query
import java.text.SimpleDateFormat

@Transactional
class SequenciamentoService {

    SessionFactory sessionFactory
    OracleService oracleService
    OrdemDeProducaoService ordemDeProducaoService
    CrudService crudService
    UserService userService

    String gerarCodigo() {
        String codigo

        Object item = OrdemDeFabricacao.last()

        if(item) {
            int numero = Integer.parseInt(item.numero) + 1
            codigo = String.format("%06d", numero)
        } else {
            codigo = "000001"
        }

        return codigo
    }

    List<OrdemDeProducaoSequenciamentoDTO> getOrdensDeProducaoProdutosSemGrupoAssociado(Fornecedor fornecedor, int offset, int max, String codigoOrdemDeProducao, String codigoProduto, String order) {

        String sql = getSqlOrdensSemGrupoAssociado(fornecedor, codigoOrdemDeProducao, codigoProduto, order)

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("ordemDeProducao", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("pedido", new StringType())
        query.addScalar("roteiro", new StringType())
        query.addScalar("quantidade", new LongType())
        query.setResultTransformer(Transformers.aliasToBean(OrdemDeProducaoSequenciamentoDTO.class))

        query.setFirstResult(offset)
        query.setMaxResults(max)

        return query.list()
    }

    Long getTotalOrdensDeProducaoProdutosSemGrupoAssociado(Fornecedor fornecedor, String codigoOrdemDeProducao, String codigoProduto) {
        String sql = """SELECT Count(*)
                        FROM  (${getSqlOrdensSemGrupoAssociado(fornecedor, codigoOrdemDeProducao, codigoProduto, "asc")}) """

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)

        return query.uniqueResult() as Long
    }

    String getSqlOrdensSemGrupoAssociado(Fornecedor fornecedor, String codigoOrdemDeProducao, String codigoProduto, String order) {
        String where = ""

        if(codigoOrdemDeProducao) {
            where += "AND upper(f.prefixo_producao||'-'||op.numero) like upper('%${codigoOrdemDeProducao}%')\n"
        }

        if(codigoProduto) {
            where += "AND UPPER(op.codigo_produto) like UPPER('%${codigoProduto}%')"
        }

        String sql = """SELECT f.prefixo_producao
                               || '-'
                               || op.numero         AS ordemDeProducao,
                               op.codigo_produto    AS codigoProduto,
                               nvl(prod.descricao, op.descricao_produto) AS descricaoProduto,
                               op.pedido            AS pedido,
                               op.roteiro           AS roteiro,
                               op.QTD_DISP_FABRICACAO AS quantidade
                        FROM   ordem_de_producao op
                               INNER JOIN fornecedor f
                                       ON f.id = op.fornecedor_id
                               LEFT join gp40.produto prod
                                        on prod.codigo=op.codigo_produto
                                        and prod.organization_id=f.organization_id
                        WHERE  f.id = ${fornecedor.id}
                               AND op.qtd_disp_fabricacao > 0
                               AND op.codigo_produto NOT IN(SELECT pgl.codigo
                                                            FROM   produto_grupo_linha pgl
                                                                   INNER JOIN grupo_linha_producao
                                                                              glp
                                                                           ON
                                                                   glp.id = pgl.grupo_linha_id
                                                            WHERE  glp.fornecedor_id = ${fornecedor.id})
                               ${where}
                               ORDER BY op.numero ${order} """

        return sql
    }

    List<OrdemDeProducaoSequenciamentoDTO> getOrdensDeProducaoProdutosAssociadosAoGrupo(GrupoLinhaDeProducao grupoLinhaDeProducao) {
        String sql = """SELECT * FROM (
                        SELECT f.prefixo_producao
                               || '-'
                               || op.numero                 AS ordemDeProducao,
                               op.codigo_produto            AS codigoProduto,
                               nvl(prod.descricao, op.descricao_produto)         AS descricaoProduto,
                               op.pedido                    AS pedido,
                               op.roteiro                   AS roteiro,
                               op.data_previsao_finalizacao AS dataPrometida,
                               op.quantidade - nvl((SELECT Sum(quantidade_total)
                                                FROM   ordem_de_fabricacao ofa
                                                WHERE  ofa.ordem_de_producao_id = op.id
                                                       AND ofa.status <> '${StatusOrdemFabricacao.CANCELADA}' ), 0)       AS quantidade,
                               pgl.quantidade_por_pallet    AS quantidadePorPallet
                        FROM   ordem_de_producao op
                               INNER JOIN fornecedor f
                                       ON f.id = op.fornecedor_id
                               LEFT join gp40.produto prod 
                                        on prod.codigo=op.codigo_produto
                                        and prod.organization_id=f.organization_id
                               INNER JOIN gp40.produto_grupo_linha pgl
                                       ON op.codigo_produto = pgl.codigo
                                          AND ((Nvl(op.roteiro, '00') = Nvl(pgl.roteiro, '00')) OR (pgl.roteiro IS NULL AND NOT EXISTS (SELECT pgl2.id FROM produto_grupo_linha pgl2 WHERE pgl2.roteiro = op.roteiro and pgl2.codigo = op.codigo_produto)))
                               INNER JOIN grupo_linha_producao glp
                                       ON glp.id = pgl.grupo_linha_id
                        WHERE  f.id = ${grupoLinhaDeProducao.fornecedorId}
                               AND glp.id = ${grupoLinhaDeProducao.id}
                               AND op.STATUS = '${StatusOrdemProducao.EXPORTACAO_FINALIZADA}'
                               AND op.status_wip not in ('${StatusOrdemDeProducaoWIP.CANCELADO}', '${StatusOrdemDeProducaoWIP.FECHADO}', '${StatusOrdemDeProducaoWIP.CONCLUIDO}')
                               AND (op.pedido IS NOT NULL OR f.vendor_id = 5142)
                       ORDER BY OP.DATA_PREVISAO_FINALIZACAO)
                       where quantidade > 0"""

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.addScalar("ordemDeProducao", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("pedido", new StringType())
        query.addScalar("roteiro", new StringType())
        query.addScalar("dataPrometida", new DateType())
        query.addScalar("quantidade", new LongType())
        query.addScalar("quantidadePorPallet", new IntegerType())
        query.setResultTransformer(Transformers.aliasToBean(OrdemDeProducaoSequenciamentoDTO.class))


        return query.list()
    }

    void criaSeriais(OrdemDeFabricacao ordemDeFabricacao) {
        long total = ordemDeFabricacao.quantidadeTotal
        int maxSeriaisPorInsert = 300
        int slices = Math.ceil(total/maxSeriaisPorInsert)

        (1..slices).each {
            int seriaisCriar = it*maxSeriaisPorInsert > total ? total-(it-1)*maxSeriaisPorInsert : maxSeriaisPorInsert
            criaSeriais(ordemDeFabricacao, seriaisCriar)
        }
    }

    void criaSeriais(OrdemDeFabricacao ordemDeFabricacao, int total, SerialFabricacao serialAntigo = null) {
        if(ordemDeFabricacao.ano?.toInteger() > 21) {
            String sql = """
                    INSERT INTO serial_fabricacao
                                (id,
                                 version,
                                 ano,
                                 codigo,
                                 status_serial,
                                 ordem_de_fabricacao_id,
                                 codigo_origem)
                    WITH b36
                         AS (SELECT '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' AS b36
                             FROM   dual),
                         num
                         AS (SELECT (SELECT (SELECT SUM(position_value)
                                             FROM   (SELECT Power(36, position - 1) * CASE
                                                                                        WHEN
                                                            digit BETWEEN '0' AND '9' THEN
                                                            To_number(digit)
                                                            ELSE
                                                            10 + Ascii(digit) - Ascii('A')
                                                                                      END AS
                                                            position_value
                                                     FROM   (SELECT Substr(input_string,
                                                                    Length(input_string) + 1
                                                                    - LEVEL, 1
                                                                    ) digit,
                                                                    LEVEL
                                                                    position
                                                             FROM   (SELECT (SELECT Nvl(Max(codigo),
                                                                                    '0')
                                                                             FROM
                                                                    serial_fabricacao where ano='${ordemDeFabricacao.ano}' and codigo < '127F6L')--127F6L
                                                                            input_string
                                                                     FROM   dual)
                                                             CONNECT BY LEVEL <=
                                                             Length(input_string))))
                                                       input_string
                                     FROM   dual)
                                    + ROWNUM AS num
                             FROM   dual
                             CONNECT BY ROWNUM <= ${total}),
                         cod
                         AS (SELECT num.num,
                                    Substr(b36.b36, MOD(Trunc(num.num/(Power(36, 5))), 36) + 1, 1)
                                    || Substr(b36.b36, MOD(Trunc(num.num/(Power(36, 4))), 36) + 1, 1
                                       )
                                    || Substr(b36.b36, MOD(Trunc(num.num/(Power(36, 3))), 36) + 1, 1)
                                    || Substr(b36.b36, MOD(Trunc(num.num/(Power(36, 2))), 36) + 1, 1)
                                    || Substr(b36.b36, MOD(Trunc(num.num/36), 36) + 1, 1)
                                    || Substr(b36.b36, MOD(num.num, 36) + 1, 1) base36
                             FROM   num,
                                    b36)
                    SELECT serial_fabricacao_seq.NEXTVAL,
                           0,
                           '${ordemDeFabricacao.ano}',
                           base36,
                           '${StatusSerialFabricacao.PENDENTE_APONTAMENTO}',
                           ${ordemDeFabricacao.id},
                           ${serialAntigo ? "'${serialAntigo.codigo}-${serialAntigo.ano}'" : null}
                    FROM   cod
                    """

            sessionFactory.currentSession.createSQLQuery(sql).executeUpdate()
        } else {
            String sql = """
                    INSERT INTO serial_fabricacao
                                (id,
                                 version,
                                 ano,
                                 codigo,
                                 status_serial,
                                 ordem_de_fabricacao_id)
                    (SELECT serial_fabricacao_seq.NEXTVAL,
                            0,
                            '${ordemDeFabricacao.ano}',
                            Lpad(Trim(To_char(To_number((SELECT Max(codigo) FROM serial_fabricacao )
                                              , 'XXXXXX') + ROWNUM, 'XXXXXX')), 6, '0'),
                            '${StatusSerialFabricacao.PENDENTE_APONTAMENTO}',
                            ${ordemDeFabricacao.id}
                     FROM   dual
                     CONNECT BY LEVEL <= ${total}) 
            """

            NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
            query.executeUpdate()
        }

        if(ordemDeFabricacao.status == StatusOrdemFabricacao.FINALIZADA){
            ordemDeFabricacao.status = StatusOrdemFabricacao.EM_ANDAMENTO
            ordemDeFabricacao.save(flush: true)
        }
    }

    OrdemDeFabricacao salvarOrdemDeFabricacao(Fornecedor fornecedor, String codigoOrdemDeProducao, Long quantidade, String codigoProduto, GrupoLinhaDeProducao grupoLinhaDeProducao, LinhaDeProducao linhaDeProducao, Boolean separacao, materiaPrima, String dataSeparacao, String comentarios, Boolean segregarLotes) {
        OrdemDeFabricacao ordemDeFabricacao = new OrdemDeFabricacao()
        ordemDeProducaoService.validaOrdemDeProducaoParaSequenciamento(codigoOrdemDeProducao, fornecedor, quantidade)
        Date data = null

        if(dataSeparacao) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy-HH:mm")
            data = dateFormat.parse(dataSeparacao)
            Date dataAtual = new Date()

            if (dataAtual > data) {
                throw new SequenciamentoException("sequenciamento.dataSeparacao.message")
            }
        }

        OrdemDeProducao ordemDeProducao = OrdemDeProducao.getByCodigo(codigoOrdemDeProducao)
        String numeroAno = Calendar.getInstance().get(Calendar.YEAR).toString()[2..3]
        ordemDeFabricacao.codigoProduto = codigoProduto
        ordemDeFabricacao.ordemDeProducao = ordemDeProducao
        ordemDeFabricacao.quantidadeTotal = quantidade
        ordemDeFabricacao.fornecedor = fornecedor
        ordemDeFabricacao.ano = numeroAno
        ordemDeFabricacao.segregarLotes = segregarLotes
        ordemDeFabricacao.comentarios = comentarios
        ordemDeFabricacao.numero = OrdemDeFabricacao.getProximoNumeroOrdem( fornecedor, numeroAno )
        if(separacao){
            ordemDeFabricacao.status = StatusOrdemFabricacao.EM_SEPARACAO
        } else {
            ordemDeFabricacao.status = StatusOrdemFabricacao.ABERTA
        }
        ordemDeFabricacao.grupoLinhaProducao = grupoLinhaDeProducao
        ordemDeFabricacao.linhaDeProducao = linhaDeProducao
        ordemDeFabricacao.ordem = OrdemDeFabricacao.getPosicaoOrdemDeFabricacao(ordemDeFabricacao.grupoLinhaProducao, numeroAno)

        Integer ultimaOrdem = getPosicaoDaUltimaOrdem(ordemDeFabricacao)
        ordemDeFabricacao.ordem = ultimaOrdem + 1

        if(dataSeparacao) {
            ordemDeFabricacao.dataPrevisaoSeparacao = data
        }

        materiaPrima.each {
            MateriaPrimaSeparacao materiaPrimaSeparacao = new MateriaPrimaSeparacao()

            materiaPrimaSeparacao.codigoProduto = it.codigoProduto
            materiaPrimaSeparacao.descricaoProduto = it.descricaoProduto
            materiaPrimaSeparacao.quantidade = it.quantidadePorMontagem * ordemDeFabricacao.quantidadeTotal

            ordemDeFabricacao.addToMateriasPrimasSeparacao(materiaPrimaSeparacao)
        }

        ordemDeFabricacao.save(flush: true, failOnError: true)
        ordemDeProducaoService.atualizaQuantidadeOrdemDeFabricacao(ordemDeProducao, quantidade)

        return ordemDeFabricacao
    }

    void alterarPosicaoOrdemDeFabricacao(OrdemDeFabricacao ordemDeFabricacao, String codigoOrdemAnterior) {
        Integer posicaoOrdemDeFabricacao = ordemDeFabricacao.ordem
        OrdemDeFabricacao ordemDeFabricacaoAnterior = null

        if (codigoOrdemAnterior) {
            ordemDeFabricacaoAnterior = OrdemDeFabricacao.findByNumeroAndAnoAndFornecedorAndGrupoLinhaProducao(codigoOrdemAnterior.split("-")[0], codigoOrdemAnterior.split("-")[1], ordemDeFabricacao.fornecedor, ordemDeFabricacao.grupoLinhaProducao)
        }

        if (ordemDeFabricacaoAnterior) {
            if(!ordemDeFabricacaoAnterior.visivelNoSequenciamento()) {
                throw new SequenciamentoException("sequenciamento.erroAoMudarParaPosicao.message",
                        [ordemDeFabricacaoAnterior.getCodigoOrdemDeFabricacao(), ordemDeFabricacaoAnterior.status.name()] as Object[])
            }

            if(ordemDeFabricacaoAnterior.ordem < posicaoOrdemDeFabricacao) {
                List<OrdemDeFabricacao> ordensEntrePosicoes = getOrdensEntrePosicoes(ordemDeFabricacao, ordemDeFabricacaoAnterior.ordem, posicaoOrdemDeFabricacao - 1)
                ordemDeFabricacao.ordem = ordemDeFabricacaoAnterior.ordem

                ordensEntrePosicoes.each {
                    it.ordem = it.ordem + 1
                    it.save(flush: true, failOnError: true)
                }
            } else if(ordemDeFabricacaoAnterior.ordem > posicaoOrdemDeFabricacao) {
                List<OrdemDeFabricacao> ordensEntrePosicoes = getOrdensEntrePosicoes(ordemDeFabricacao, posicaoOrdemDeFabricacao + 1, ordemDeFabricacaoAnterior.ordem - 1)
                ordemDeFabricacao.ordem = ordemDeFabricacaoAnterior.ordem - 1

                ordensEntrePosicoes.each {
                    it.ordem = it.ordem - 1
                    it.save(flush: true, failOnError: true)
                }
            }
        } else {
            Integer ultimaOrdem = getPosicaoDaUltimaOrdem(ordemDeFabricacao)
            if (posicaoOrdemDeFabricacao != ultimaOrdem) {
                List<OrdemDeFabricacao> ordens = getOrdensAfetadasAoAlterarParaPosicaoFinal(ordemDeFabricacao)

                ordens.each {
                    it.ordem = it.ordem - 1
                    it.save(flush: true, failOnError: true)
                }

                ordemDeFabricacao.ordem = ultimaOrdem
            } else {
                throw new SequenciamentoException("sequenciamento.ultimaOrdem.message")
            }
        }
        ordemDeFabricacao.save(flush: true)
    }

    void validarOrdens(OrdemDeFabricacao ordem){
        List<OrdemDeFabricacao> ordens = OrdemDeFabricacao.findAllByGrupoLinhaProducaoAndAnoAndStatusInList(ordem.grupoLinhaProducao, ordem.ano, StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento())
        Map<Integer, List<OrdemDeFabricacao>> contagem = ordens.groupBy({it.ordem})
        // se possuir ordens repetidas
        if (contagem.any({it.value.size() > 1})){
            String invalidos = contagem.findAll({it.value.size() > 1}).collect({it.value}).flatten().collect({OrdemDeFabricacao it -> it.codigoOrdemDeFabricacao}).join(", ")
            throw new SequenciamentoException("sequenciamento.ordensIguais.message", invalidos)
        }
    }

    List<OrdemDeFabricacao> getOrdensAfetadasAoAlterarParaPosicaoFinal(OrdemDeFabricacao ordemDeFabricacao) {
        return OrdemDeFabricacao.findAllByGrupoLinhaProducaoAndAnoAndOrdemGreaterThanEqualsAndStatusInListAndIdNotEqual(ordemDeFabricacao.grupoLinhaProducao, ordemDeFabricacao.ano, ordemDeFabricacao.ordem, StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento(), ordemDeFabricacao.id)
    }

    List<OrdemDeFabricacao> getOrdensAfetadasAoAlterarParaPosicaoIntermediaria(OrdemDeFabricacao ordemDeFabricacao, OrdemDeFabricacao ordemDeFabricacaoAnterior) {
        return OrdemDeFabricacao.findAllByGrupoLinhaProducaoAndAnoAndOrdemGreaterThanEqualsAndIdNotEqualAndStatusInList(ordemDeFabricacao.grupoLinhaProducao, ordemDeFabricacao.ano, ordemDeFabricacaoAnterior.ordem, ordemDeFabricacao.id, StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento())
    }

    List<OrdemDeFabricacao> getOrdensEntrePosicoes(OrdemDeFabricacao ordemDeFabricacao, posicaoOrdemDeFabricacaoAnterior, posicaoOrdemFabricacaoPosterior) {
        return OrdemDeFabricacao.createCriteria().list {
            grupoLinhaProducao {
                eq('id', ordemDeFabricacao.grupoLinhaProducaoId)
            }
            eq('ano', ordemDeFabricacao.ano)
            and {
                'in'('status', StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento())
            }
            between("ordem", posicaoOrdemDeFabricacaoAnterior, posicaoOrdemFabricacaoPosterior)
        }
    }

    Integer getPosicaoDaUltimaOrdem(OrdemDeFabricacao ordemDeFabricacao) {
        Integer posicao = OrdemDeFabricacao.createCriteria().get {
            grupoLinhaProducao {
                eq('id', ordemDeFabricacao.grupoLinhaProducaoId)
            }
            eq('ano', ordemDeFabricacao.ano)
            and {
                'in'('status', StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento())
            }
            projections {
                max('ordem')
            }
        }
        return posicao ?: 0
    }

    void cancelarOrdemDeFabricacao(OrdemDeFabricacao ordemDeFabricacao) {
        List<OrdemDeFabricacao> ordensAfetadas = getOrdensAfetadasAoAlterarParaPosicaoFinal(ordemDeFabricacao)

        ordemDeFabricacao.status = StatusOrdemFabricacao.CANCELADA
        ordemDeFabricacao.ordem = -1

        ordensAfetadas.each {
            it.ordem = it.ordem - 1
            it.save(flush: true, failOnError: true)
        }

        ordemDeFabricacao.save(flush: true, failOnError: true)
        ordemDeProducaoService.atualizaQuantidadeOrdemDeFabricacao(ordemDeFabricacao.ordemDeProducao, -ordemDeFabricacao.quantidadeTotal)
        deletarSeriais(ordemDeFabricacao)
    }

    void finalizaOrdemDeFabricacao(OrdemDeFabricacao ordemDeFabricacao) {
        ordemDeFabricacao.status = StatusOrdemFabricacao.FINALIZADA

        List<OrdemDeFabricacao> ordensAfetadas = getOrdensAfetadasAoAlterarParaPosicaoFinal(ordemDeFabricacao)
        ordensAfetadas.each {
            it.ordem = it.ordem - 1
            it.save(flush: true, failOnError: true)
        }

        ordemDeFabricacao.ordem = -1
    }

    void deletarSeriais(OrdemDeFabricacao ordemDeFabricacao){
        String sql = """DELETE
                        FROM   serial_fabricacao sf
                        WHERE  sf.ordem_de_fabricacao_id = ${ordemDeFabricacao.id}
                        AND
                               (
                                      SELECT count(id)
                                      FROM   apontamento
                                      WHERE  serial_id=sf.id) = 0"""
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.executeUpdate()
    }

    void reordenarOrdensDeFabricacao(GrupoLinhaDeProducao grupoLdp, List<OrdenacaoDTO> ordenacoes) {
        String selectQuery = """
            SELECT DISTINCT gof.id,
                ROW_NUMBER() OVER(ORDER BY ${ordenacoes.collect({"${it.traduzirTipoParaColuna()} $it.selecao"}).join(", ")}) as ordem
            FROM ORDEM_DE_FABRICACAO gof
                JOIN GRUPO_LINHA_PRODUCAO gldp
                    ON gldp.id = gof.GRUPO_LINHA_PRODUCAO_ID
                JOIN ORDEM_DE_PRODUCAO gop
                    ON gop.id = gof.ordem_de_producao_id
                LEFT JOIN ITEM_CATALOGO comp
                    ON comp.CODIGO_PRODUTO = gof.codigo_produto AND comp.NOME = '${ItensCatalogoFixos.COMPRIMENTO}' AND comp.organization_id = '${grupoLdp.fornecedor.organizationId}'
                LEFT JOIN ITEM_CATALOGO client
                    ON client.CODIGO_PRODUTO = gof.codigo_produto AND client.NOME = '${ItensCatalogoFixos.MODELO}' AND client.organization_id = '${grupoLdp.fornecedor.organizationId}'
            WHERE gldp.id = '${grupoLdp.id}'
                AND gof.status IN (${StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento().collect({"'${it.name()}'"}).join(", ")})
        """
        String updateQuery = """
            UPDATE ORDEM_DE_FABRICACAO odf 
                SET odf.ordem = (SELECT ordem FROM ($selectQuery) WHERE id = odf.id)
            WHERE odf.GRUPO_LINHA_PRODUCAO_ID = '${grupoLdp.id}'
                AND odf.status IN (${StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento().collect({"'${it.name()}'"}).join(", ")})
        """

        sessionFactory.currentSession.createSQLQuery( "ALTER SESSION SET NLS_LANGUAGE='BRAZILIAN PORTUGUESE'" )?.executeUpdate()
        sessionFactory.currentSession.createSQLQuery( "ALTER SESSION SET NLS_TERRITORY='BRAZIL'" )?.executeUpdate()

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(updateQuery)
        query.executeUpdate()
    }

    void alterarLinhaProducao(OrdemDeFabricacao ordemFabricacao, LinhaDeProducao linhaProducao) {
        if (!ordemFabricacao.podeTrocarLinhaProducao()){
            throw new SequenciamentoException("sequenciametno.linhaProducao.naoPodeMudar.message")
        }
        ordemFabricacao.linhaDeProducao = linhaProducao
        ordemFabricacao.save(flush: true, failOnError: true)
    }

    void reordenarOrdensDeFabricacaoSemArrastar(List<Integer> ordensFabricacaoIds){
        String ids = ordensFabricacaoIds.join(", ")
        String selectQuery = """
            SELECT COLUMN_VALUE as id, rownum as ordem FROM table(sys.odcinumberlist($ids))
        """
        String updateQuery = """
            UPDATE ORDEM_DE_FABRICACAO odf 
                SET odf.ordem = (SELECT ordem FROM ($selectQuery) WHERE id = odf.id)
            WHERE odf.id IN ($ids)
        """
        NativeQuery query = sessionFactory.currentSession.createSQLQuery(updateQuery)
        query.executeUpdate()
    }

    void checarUsuarioLogadoParaSequenciamento(GrupoLinhaDeProducao grupo){
        if (grupo.usuario && grupo.usuario.id != userService.getUsuarioLogado().id){
            throw new SequenciamentoException("sequenciamento.outroUsuarioLogado.message", [grupo.usuario?.fullname] as Object[])
        }
    }
    List<OrdemFabricacaoSequenciamentoDTO> getOrdensInternas(Long grupoLinhaProducao, String ordemProducao, String materiaPrimaOP, String status, String codigoProduto, String ordemFabricacao){
        String sql = getSqlOrdensInternas(grupoLinhaProducao, ordemProducao, materiaPrimaOP, status, codigoProduto, ordemFabricacao)
        Query query = sessionFactory.currentSession.createSQLQuery(sql)

        query.addScalar("id", new LongType())
        query.addScalar("codigoOrdemFabricacao", new StringType())
        query.addScalar("codigoProduto", new StringType())
        query.addScalar("quantidadeTotal", new LongType())
        query.addScalar("quantidadeFinalizada", new LongType())
        query.addScalar("status", new StringType())
        query.addScalar("lista", new StringType())
        query.addScalar("roteiro", new StringType())
        query.addScalar("linhaProducaoNome", new StringType())
        query.addScalar("linhaProducaoId", new LongType())
        query.addScalar("descricaoProduto", new StringType())
        query.addScalar("comentarios", new StringType())
        query.addScalar("codigoOrdemProducao", new StringType())
        query.addScalar("podeTrocarLinha", new BooleanType())
        query.addScalar("modelo", new StringType())
        query.addScalar("comprimento", new StringType())
        query.addScalar("dataPrevisaoFinalizacao", new StringType())
        query.addScalar("ordem", new IntegerType())

        query.setResultTransformer(Transformers.aliasToBean(OrdemFabricacaoSequenciamentoDTO.class))

        return query.list()
    }

    String getSqlOrdensInternas(Long grupoLinhaProducao, String ordemProducao, String materiaPrimaOP, String status, String codigoProduto, String ordemFabricacao){
        String statusVisiveis = status ? status.split(";").join("', '") : StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento().join("', '")
        String quantidadeFinalizadaQuery = "SELECT COUNT(*) FROM gp40.serial_fabricacao s WHERE s.ano=odf.ano and s.ordem_de_fabricacao_id = odf.id AND s.status_serial = '${StatusSerialFabricacao.APONTAMENTO_FINALIZADO}'"
        String podeTrocarLihnaQuery = """
            CASE WHEN (odf.status = '${StatusOrdemFabricacao.ABERTA}' OR odf.status = '${StatusOrdemFabricacao.EM_SEPARACAO}')
            THEN 1 ELSE 0 END
        """
        return """
            SELECT DISTINCT odf.id,
                   (odf.numero || '-' || odf.ano) as codigoOrdemFabricacao,
                   odf.codigo_produto as codigoProduto,
                   odf.quantidade_total as quantidadeTotal,
                   ($quantidadeFinalizadaQuery) as quantidadeFinalizada,
                   odf.status as status,
                   odp.lista as lista,
                   odp.roteiro as roteiro,
                   ldp.nome as linhaProducaoNome,
                   ldp.id as linhaProducaoId,
                   nvl(prod.descricao, odp.descricao_produto) as descricaoProduto,
                   odf.comentarios as comentarios,
                   (odpf.prefixo_producao || '-' || odp.numero) as codigoOrdemProducao,
                   ($podeTrocarLihnaQuery) as podeTrocarLinha,
                   model.valor as modelo,
                   comp.valor as comprimento,
                   to_char(odp.data_previsao_finalizacao, 'DD/MM/YYYY') as dataPrevisaoFinalizacao,
                   odf.ordem as ordem
            FROM gp40.ordem_de_fabricacao odf
                JOIN gp40.ordem_de_producao odp
                    ON odp.id = odf.ordem_de_producao_id
                JOIN gp40.fornecedor f
                    ON f.id = odf.fornecedor_id
                JOIN gp40.fornecedor odpf
                    ON odpf.id = odp.fornecedor_id
                LEFT join gp40.produto prod
                    on prod.codigo=odp.codigo_produto
                    and prod.organization_id=odpf.organization_id
                LEFT JOIN gp40.linha_de_producao ldp
                    ON ldp.id = odf.linha_de_producao_id
                ${materiaPrimaOP ? """
                INNER JOIN gp40.componente_op_wip MP 
                    on mp.ordem_de_producao_id=odp.id""" : ""}
                LEFT JOIN gp40.item_catalogo model
                    ON model.nome = '${ItensCatalogoFixos.MODELO}' AND model.codigo_produto = odf.codigo_produto AND model.organization_id = f.organization_id
                LEFT JOIN gp40.item_catalogo comp
                    ON comp.nome = '${ItensCatalogoFixos.COMPRIMENTO}' AND comp.codigo_produto = odf.codigo_produto AND comp.organization_id = f.organization_id
            WHERE odf.GRUPO_LINHA_PRODUCAO_ID = '${grupoLinhaProducao}'
                AND odf.status IN ('$statusVisiveis')
                ${ordemProducao ? "AND upper(odpf.prefixo_producao || '-' || odp.numero) like upper('%${ordemProducao}%')" : ""}
                ${codigoProduto ? "AND upper(odp.codigo_produto) like upper('%${codigoProduto}%')" : ""}
                ${ordemFabricacao ? "AND upper(odf.numero || '-' || odf.ano) like upper('%${ordemFabricacao}%')" : ""}
                ${materiaPrimaOP ? "AND upper(mp.codigo_produto) like upper('%${materiaPrimaOP}%')" : ""}
            ORDER BY odf.ordem ASC
        """
    }
}
