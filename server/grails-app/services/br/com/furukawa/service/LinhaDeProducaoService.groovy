package br.com.furukawa.service

import br.com.furukawa.controller.CrudController
import br.com.furukawa.enums.Status
import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.exceptions.LinhaDeProducaoException
import br.com.furukawa.model.Apontamento
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.PlanejamentoDiario
import br.com.furukawa.model.ProcessoLinhaDeProducao
import grails.gorm.transactions.Transactional
import org.hibernate.SessionFactory
import org.hibernate.query.NativeQuery

@Transactional
class LinhaDeProducaoService {

    CrudService crudService
    CrudController crudController
    SessionFactory sessionFactory
    GrupoRecursoService grupoRecursoService

    void validacao(Long linhaDeProducaoId, ProcessoLinhaDeProducao processoLinhaDeProducao) {
        LinhaDeProducao linha = LinhaDeProducao.get(linhaDeProducaoId)
        if (!linha) return // se a linha ainda não tiver sido criada, ela não possui grupo de linhas pra ser validado

        GrupoRecurso grupoRecurso = GrupoRecurso.get(processoLinhaDeProducao.grupoRecurso.id)
        List<LinhaDeProducao> outrasLinhasComMesmoPrimeiroProcesso = LinhaDeProducao.createCriteria().list {
            ne 'id', linha.id
            processos {
                eq 'grupoRecurso', grupoRecurso
                eq 'ordem', 0
            }
        } as List<LinhaDeProducao>
        List<Long> linhaGrupos = linha.gruposLinhas*.id
        List<Long> outrosGrupos = outrasLinhasComMesmoPrimeiroProcesso*.gruposLinhas.flatten()*.id

        if (linhaGrupos.any({outrosGrupos.contains(it)})){
            throw new LinhaDeProducaoException('linhaDeProducao.errorUpdate.message')
        }
    }

    void atualizaReferenciaLinhaDeProducaoNoGrupoRecurso(Long idLinha, Long novoIdLinha, GrupoRecurso grupoRecurso) {
        GrupoRecurso gp = GrupoRecurso.findByPrimeiroDaLinha(idLinha)
        if(gp) {
            gp.primeiroDaLinha = null
            crudService.salvar(gp)
        }

        if(grupoRecurso) {
            grupoRecurso.primeiroDaLinha = novoIdLinha
            crudService.salvar(grupoRecurso)
        }
    }

    void criaReferenciaLinhaDeProducaoNoGrupoRecurso(ProcessoLinhaDeProducao primeiroProcesso, LinhaDeProducao instance) {
        GrupoRecurso grupoRecurso = primeiroProcesso.grupoRecurso
        grupoRecurso.primeiroDaLinha = instance.id

        crudService.salvar(grupoRecurso)
    }

    List<LinhaDeProducao> listaUltimaVersao(String nome, String grupoRecurso, Fornecedor fornecedor, String status, int max, int offset, String sort, String order) {
        String sql = getSqlLinhasDeProducao(nome, grupoRecurso, fornecedor, status, sort, order)

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sql)
        query.setFirstResult(offset)
        query.setMaxResults(max)

        return LinhaDeProducao.getAll(query.list() as ArrayList<Long>)
    }

    Integer getTotalLinhasUltimaVersao(String nome, String grupoRecurso, Fornecedor fornecedor, String status, String sort, String order) {
        String sql = getSqlLinhasDeProducao(nome, grupoRecurso, fornecedor, status, sort, order)
        String sqlTotal = "select count(*) from (${sql})"

        NativeQuery query = sessionFactory.currentSession.createSQLQuery(sqlTotal)

        return query.uniqueResult() as Integer
    }

    String getSqlLinhasDeProducao(String nome, String grupoRecurso, Fornecedor fornecedor,  String status, String sort, String order) {
        return """SELECT DISTINCT gpl.id, gpl.nome
                        FROM   gp40.linha_de_producao gpl
                            LEFT JOIN gp40.processo_lp gplp
                                ON gplp.linha_de_producao_id = gpl.id
                            LEFT JOIN gp40.grupo_recurso ggr
                                ON ggr.id = gplp.grupo_recurso_id
                        WHERE  gpl.fornecedor_id = ${fornecedor.id}
                               ${nome ? "AND ( upper(gpl.nome) like upper('%${nome}%') )" : ""}
                               ${grupoRecurso ? "AND ( upper(ggr.nome) like upper('%${grupoRecurso}%') )" : ""}
                               ${status && status != "TODOS" ? "AND ( gpl.ativo = ${(status == Status.ATIVO.name()) ? 1 : 0} )" : ""}
                               AND gpl.versao = (SELECT Max(versao)
                                                 FROM   gp40.linha_de_producao gpl1
                                                 WHERE  gpl1.nome = gpl.nome
                                                        AND gpl.fornecedor_id = gpl1.fornecedor_id)
                        ${sort ? "order by gpl.${sort} ${order}" : "order by gpl.nome"} """
    }

    void restaurarLinhaProducao(LinhaDeProducao linha) {
        LinhaDeProducao ultimaVersao = LinhaDeProducao.findByNomeAndFornecedorAndAtivo(linha.nome as String, linha.fornecedor, true, [sort: 'versao', order: 'desc'])
        validaLinha(linha, ultimaVersao.id)
        validaLinha(ultimaVersao, ultimaVersao.id)

        linha.versao = ultimaVersao.versao + 1

        GrupoRecurso grupoRecurso = GrupoRecurso.findByPrimeiroDaLinha(ultimaVersao.id)
        if(grupoRecurso) {
            grupoRecurso.primeiroDaLinha = null
            grupoRecurso.save(flush: true, failOnError: true)
        }

        linha.save(flush: true, failOnError: true)
        if (ultimaVersao){
            referenciarNovasVersoes(ultimaVersao, linha)
        }
    }

    void validaLinha(LinhaDeProducao instance, Long idValidacao) {
        ProcessoLinhaDeProducao primeiroProcesso = instance.getPrimeiroProcesso()

        List <Long> recursos = primeiroProcesso.grupoRecurso.recursos.id

        grupoRecursoService.validaRecursos(instance.fornecedor, recursos, primeiroProcesso.grupoRecursoId)

        validacao(idValidacao, primeiroProcesso)
    }

    void referenciarNovasVersoes(LinhaDeProducao antiga, LinhaDeProducao nova){
        referenciarGrupos(antiga, nova)
        referenciarOFs(antiga, nova)
        referenciarNomes(antiga, nova)
    }

    void referenciarNomes(LinhaDeProducao antiga, LinhaDeProducao nova) {
        if (antiga.nome != nova.nome){
            List<LinhaDeProducao> linhas = LinhaDeProducao.findAllByFornecedorAndNomeAndAtivo(antiga.fornecedor, antiga.nome, true)
            linhas.each { linha ->
                linha.nome = nova.nome
                crudService.salvar(linha)
            }
        }
    }

    void referenciarGrupos(LinhaDeProducao antiga, LinhaDeProducao nova) {
        List<GrupoLinhaDeProducao> gruposLdp = GrupoLinhaDeProducao.createCriteria().list {
            linhas {
                eq 'id', antiga.id
            }
        }
        if (gruposLdp){
            gruposLdp.each { grupoLdp ->
                grupoLdp.addToLinhas(nova)
                grupoLdp.removeFromLinhas(antiga)
                crudService.salvar(grupoLdp)
            }
        }
    }

    void referenciarOFs(LinhaDeProducao antiga, LinhaDeProducao nova) {
        List<OrdemDeFabricacao> ofs = OrdemDeFabricacao.findAllByLinhaDeProducao(antiga)
        ofs.each {of ->
            of.setLinhaDeProducao(nova)
            crudService.salvar(of)
        }
    }

    String deletarLdp(LinhaDeProducao linha){
        boolean pertenceAUmGrupoLP = GrupoLinhaDeProducao.createCriteria().get({
            linhas {
                eq "id", linha.id
            }

            projections {
                count("id")
            }
        })

        if (pertenceAUmGrupoLP) {
            throw new LinhaDeProducaoException("linhaDeProducao.delete.error.grupo.message")
        }
        if (OrdemDeFabricacao.findByLinhaDeProducaoAndStatusInList(linha, [StatusOrdemFabricacao.ABERTA, StatusOrdemFabricacao.EM_ANDAMENTO, StatusOrdemFabricacao.EM_SEPARACAO])){
            throw new LinhaDeProducaoException("linhaDeProducao.delete.error.sequenciamento.message")
        }

        List<LinhaDeProducao> linhas = LinhaDeProducao.findAllByFornecedorAndNomeAndAtivo(linha.fornecedor, linha.nome, true)
        boolean possuiAssociacoes = linhas.any {temAssociacoes(it)}
        if (possuiAssociacoes){
            linhas.each {ldp ->
                linha.ativo = false
                GrupoRecurso.findAllByPrimeiroDaLinha(ldp.id).each {grupoRecurso ->
                    grupoRecurso.primeiroDaLinha = null
                    grupoRecurso.save(flush: true, failOnError: true)
                }
                linha.save(flush: true, failOnError: true)
            }
            return 'default.inactived.message'
        } else {
            linhas.each {ldp ->
                GrupoRecurso.findAllByPrimeiroDaLinha(ldp.id).each {grupoRecurso ->
                    grupoRecurso.primeiroDaLinha = null
                    grupoRecurso.save(flush: true, failOnError: true)
                }
                ldp.delete(flush: true)
            }
            return 'default.deleted.message'
        }
    }

    boolean temAssociacoes(LinhaDeProducao linha){
        return OrdemDeFabricacao.countByLinhaDeProducao(linha) ||
                Apontamento.countByLinhaDeProducao(linha) ||
                PlanejamentoDiario.countByLinhaDeProducao(linha)
    }

}
