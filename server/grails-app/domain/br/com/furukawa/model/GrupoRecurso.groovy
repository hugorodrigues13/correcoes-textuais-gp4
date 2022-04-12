package br.com.furukawa.model

import br.com.furukawa.utils.Audit

class GrupoRecurso extends Audit {

    String nome
    String operacao
    Long primeiroDaLinha
    Integer tempoPadrao
    Integer tempoMaximoSemApontamento
    Boolean isAtivo = true
    Boolean permiteApontamentoOF = false

    Fornecedor fornecedor

    static hasMany = [recursos: Recurso, defeitos: Defeito, motivosDeParada: MotivoDeParada, regras: RegraExibicaoMP, camposRastreaveis: String]

    static constraints = {
        nome unique: ['fornecedor']
        recursos nullable: false
        primeiroDaLinha nullable: true
        operacao nullable: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'grupo_recurso_seq']
        recursos  joinTable: [name: 'recurso_grupo',
                    key: 'grupo_id', column: 'recurso_id']
        defeitos  joinTable: [name: 'grupo_recurso_defeito',
                              key: 'grupo_id', column: 'defeito_id']
        motivosDeParada joinTable: [name: 'grupo_recurso_paradas',
                                    key: 'grupo_id', column: 'motivo_parada_id']
        camposRastreaveis cascade: 'all-delete-orphan', joinTable: [name: 'gp40.grupo_recurso_campo_rastreavel',
                                                                    key : 'grupo_id', column: 'campo_rastreavel']
        regras cascade: 'all-delete-orphan'
        permiteApontamentoOF column: 'permite_apontamento_op'
    }

    List<String> getCodigosProdutosAssociados(){
        List<GrupoLinhaDeProducao> gldp = GrupoLinhaDeProducao.createCriteria().list {
            linhas {
                processos {
                    eq('grupoRecurso', this)
                }

                eq('ativo', true)
            }
        }

        return gldp*.produtos.flatten()*.codigo.unique() as List<String>
    }

    Organizacao getOrganizacaoDoFornecedor() {
        return fornecedor.getOrganizacaoDoFornecedor()
    }
}
