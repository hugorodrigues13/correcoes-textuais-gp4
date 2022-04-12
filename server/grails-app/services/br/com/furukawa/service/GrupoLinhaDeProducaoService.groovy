package br.com.furukawa.service

import br.com.furukawa.enums.StatusOrdemFabricacao
import br.com.furukawa.exceptions.GrupoLinhaProducaoException
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.ProcessoLinhaDeProducao
import grails.gorm.transactions.Transactional
import br.com.furukawa.model.OrdemDeFabricacao
import br.com.furukawa.model.Fornecedor
import br.com.furukawa.model.LinhaDeProducao

@Transactional(readOnly = true)
class GrupoLinhaDeProducaoService {

    GrupoRecursoService grupoRecursoService

    @Transactional(readOnly = true)
    List<Long> getLinhasDeProducaoNoSequenciamentoPorGrupoRecurso (Fornecedor fornecedor, Long id ) {
        OrdemDeFabricacao.createCriteria().list {
            eq('fornecedor', fornecedor)
            'in'('status', StatusOrdemFabricacao.getStatusValidacaoLinha())

            grupoLinhaProducao {
                eq('id', id)
            }

            linhaDeProducao {
                eq('ativo', true)
                projections {
                    distinct('id')
                }
            }
        } as ArrayList<Long>
    }

    @Transactional(readOnly = true)
    void validaLinhasDeProducao(Fornecedor fornecedor, Long id, List<Long> paramsLinha){
        checarGruposRecursosRepetidos(fornecedor, paramsLinha)
        List<Long> linhas = getLinhasDeProducaoNoSequenciamentoPorGrupoRecurso(fornecedor, id)
        List<Long> listaErrorID = linhas.minus(paramsLinha)
        List<LinhaDeProducao> todasAsLinhasError = LinhaDeProducao.getAll(listaErrorID.unique() as ArrayList<Long>)
        List<LinhaDeProducao> listaError = todasAsLinhasError.findAll { it.isUltimaVersao() }

        if(!listaError.isEmpty()){
            throw new GrupoLinhaProducaoException("grupoLinhaDeProducao.atualizarLinhaProducao.erro.message", listaError*.nome.join(", "))
        }
    }

    void validaProdutos(GrupoLinhaDeProducao grupo, List novos){
        List antigos = grupo.produtos.toList()
        List deletados = antigos.findAll({produto ->
            return !novos.any{ novo -> novo.codigo == produto.codigo && (novo.roteiro ?: "00") == (produto.roteiro ?: "00") }
        })

        List<String> usados = []

        deletados.each {deletado ->
            Integer totalOFsUtilizadas = OrdemDeFabricacao.createCriteria().get {
                eq 'grupoLinhaProducao', grupo

                ordemDeProducao {
                    eq 'codigoProduto', deletado.codigo

                    if(deletado.roteiro) {
                        eq 'roteiro', deletado.roteiro
                    } else {
                        isNull('roteiro')
                    }
                }

                inList 'status', StatusOrdemFabricacao.getStatusVisiveisNoSequenciamento()

                projections {
                    count('id')
                }
            }

            if(totalOFsUtilizadas) {
                usados.add(deletado.codigo)
            }
        }

        if (!usados.isEmpty()){
            throw new GrupoLinhaProducaoException("grupoLinhaDeProducao.atualizarLinhaProducao.erro.produto.message", usados.unique().join(", "))
        }
    }

    void checarGruposRecursosRepetidos(Fornecedor fornecedor, List<Long> paramsLinhas){
        List<LinhaDeProducao> paramsLinhasDp = LinhaDeProducao.getAll(paramsLinhas)
        List<ProcessoLinhaDeProducao> primeirosProcessos = paramsLinhasDp*.primeiroProcesso
        List<GrupoRecurso> primeirosRecursos = primeirosProcessos*.grupoRecurso
        validaGruposRecursos(fornecedor, primeirosRecursos)
        def repetido = primeirosRecursos.groupBy {it.id}.find {it.value.size() > 1}
        if (repetido){
            List<String> linhas = primeirosProcessos.findAll({it.grupoRecursoId == repetido.key})*.linhaDeProducao*.nome.unique()
            throw new GrupoLinhaProducaoException('grupoLinhaDeProducao.erroUpdate.message', linhas.join(", "))
        }
    }

    void validaGruposRecursos(Fornecedor fornecedor, List<GrupoRecurso> gruposRecursos){
        gruposRecursos.each {
            grupoRecursoService.validaRecursos(fornecedor, it.recursos*.id, it.id)
        }
    }

    // pegar sempre as últimas versões de cada linha de produção
    List<LinhaDeProducao> getUltimasVersoesLinhasDeProducao(Fornecedor fornecedor){
        List<LinhaDeProducao> todas = LinhaDeProducao.findAllByFornecedorAndAtivo(fornecedor, true)
        Map<String, List<LinhaDeProducao>> grouppedBy = todas.groupBy {it.nome}
        return grouppedBy.values().collect {listLinha -> listLinha.max({linha -> linha.versao})}
    }

    void checarProdutoGrupoLinha(Fornecedor fornecedor, List prods, Long id) {
        prods.each {
            String codigo = it.codigo?.toString()
            String roteiro = it.roteiro?.toString()
            Integer totalInvalidos = GrupoLinhaDeProducao.createCriteria().get {
                if(id){
                    ne 'id', id
                }
                produtos {
                    eq 'codigo', codigo

                    if(roteiro) {
                        or {
                            eq 'roteiro', roteiro
                        }
                    } else {
                        isNull 'roteiro'
                    }
                }
                eq 'fornecedor', fornecedor

                projections {
                    count('id')
                }
            } as Integer
            if(totalInvalidos){
                throw new GrupoLinhaProducaoException('grupoLinhaDeProducao.erroRoteiro.message', codigo)
            }
        }
    }
}
