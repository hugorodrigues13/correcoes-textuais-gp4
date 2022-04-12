package br.com.furukawa.model

class ImpressaoApontamentoCaixa {
    Integer numeroCaixa

    static belongsTo = [impressaoLote: ImpressaoApontamentoLote]
    static hasMany = [seriais: SerialFabricacao]

    static constraints = {
        numeroCaixa unique: ['impressaoLote']
    }

    static mapping = {
        table 'impr_apont_cx'
        id generator: 'sequence', params: [sequence: 'impr_apont_cx_seq']
        seriais joinTable: [name: 'imp_cx_serial', key: 'caixa_id', column: 'serial_id']
    }

    boolean isFechado(){
        return this.seriais.size() >= impressaoLote.lote.quantidadePorCaixa
    }

    boolean possuiPeloMenosUmSerialApontadoNaLinha(LinhaDeProducao linhaDeProducaoApontamento) {
        return seriais.any {it.getApontamento().linhaDeProducao == linhaDeProducaoApontamento }
    }

    boolean utilizadaNoRecurso(Recurso recurso) {
        return seriais.any {it.getUltimoRecursoApontado() == recurso}
    }

    boolean possuiPeloMenosUmSerialApontadoEmOutroRecurso(Recurso recurso) {
        return seriais.any {it.getUltimoRecursoApontado() != recurso}
    }

    Recurso getRecurso(){
        if (!seriais) return null
        return seriais.last()?.ultimoRecursoApontado
    }

    LinhaDeProducao getLinhaDeProducao(){
        if (!seriais) return null
        return seriais.last()?.apontamento?.linhaDeProducao
    }

}
