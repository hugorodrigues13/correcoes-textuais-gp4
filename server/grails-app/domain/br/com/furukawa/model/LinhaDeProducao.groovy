package br.com.furukawa.model

import br.com.furukawa.enums.Status
import br.com.furukawa.utils.Audit

class LinhaDeProducao extends Audit {
    String nome
    Fornecedor fornecedor
    Long versao
    Boolean ativo = true

    static hasMany = [processos: ProcessoLinhaDeProducao]

    static constraints = {
        nome unique: ['fornecedor', 'versao', 'ativo']
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'linha_de_producao_seq']
        processos lazy: false, cascade: "all-delete-orphan"
        versao defaultValue: 1
    }

    ProcessoLinhaDeProducao getPrimeiroProcesso() {
        return processos.find {it.ordem == 0}
    }

    List<GrupoRecurso> getGruposRecursos(){
        return processos.sort{it.ordem}*.grupoRecurso
    }

    List<GrupoLinhaDeProducao> getGruposLinhas(){
        return GrupoLinhaDeProducao.createCriteria().list {
            linhas {
                eq 'id', this.id
            }
        }
    }

    LinhaDeProducao clonar() {
        LinhaDeProducao clone = LinhaDeProducao.newInstance()
        clone.nome = this.nome
        clone.fornecedor = this.fornecedor

        processos.each {
            clone.addToProcessos(it.clonar())
        }

        return clone
    }

    Boolean isUltimaVersao () {
        Long ultimaVersao = LinhaDeProducao.createCriteria().get {
            eq('nome', this.nome)
            eq('fornecedor', this.fornecedor)

            projections {
                max('versao')
            }
        }
        return ultimaVersao == this.versao
    }

    LinhaDeProducao getUltimaVersao(){
        Long ultimaVersao = LinhaDeProducao.createCriteria().get {
            eq('nome', this.nome)
            eq('fornecedor', this.fornecedor)
            eq('ativo', true)

            projections {
                max('versao')
            }
        }
        return LinhaDeProducao.findByNomeAndFornecedorAndVersao(nome, fornecedor, ultimaVersao)
    }

    Status getStatus() {
        return ativo ? Status.ATIVO : Status.INATIVO
    }
}
