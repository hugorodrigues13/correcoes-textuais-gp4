package br.com.furukawa.model

import java.text.SimpleDateFormat

class HistoricoApontamento {

    public final static SimpleDateFormat SDF = new SimpleDateFormat("dd/MM/yyyy HH:mm")

    static belongsTo = [apontamento: Apontamento]
    Date data
    Recurso recurso
    Defeito defeito
    User operador
    GrupoRecurso grupoRecurso
    Boolean pendenteTransacao = false
    String erroTransacao

    static hasMany = [dadosRastreaveis: DadoRastreavelApontamento]

    static constraints = {
        defeito nullable: true
        erroTransacao nullable: true
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'hist_apont_seq']
    }

    String getDataFormatada() {
        return SDF.format(data)
    }

    Organizacao getOrganizacaoDoFornecedor() {
        return grupoRecurso.getOrganizacaoDoFornecedor()
    }
}
