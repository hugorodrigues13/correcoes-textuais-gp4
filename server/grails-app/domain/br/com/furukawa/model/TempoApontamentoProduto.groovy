package br.com.furukawa.model

import java.text.SimpleDateFormat

class TempoApontamentoProduto {

    private static final SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy HH:mm")

    String codigoProduto
    Integer tempoApontamento
    Date vigenciaDe
    Date vigenciaAte

    static belongsTo = [grupoRecurso: GrupoRecurso]

    static constraints = {
        vigenciaAte nullable: true
    }

    static mapping = {
        table 'tempo_apontamento_produto'
        id generator: 'sequence', params: [sequence: 'tempo_apont_prod_seq']
    }

    String getVigenciaDeFormatada(){
        return SDF.format(vigenciaDe)
    }

    TempoApontamentoProduto clone(){
        TempoApontamentoProduto clone = new TempoApontamentoProduto()
        clone.codigoProduto = codigoProduto
        clone.tempoApontamento = tempoApontamento
        clone.vigenciaDe = vigenciaDe
        clone.vigenciaAte = vigenciaAte
        clone.grupoRecurso = grupoRecurso
        return clone
    }

    String getVigenciaAteFormatada(){
        return vigenciaAte ? SDF.format(vigenciaAte) : null
    }

}
