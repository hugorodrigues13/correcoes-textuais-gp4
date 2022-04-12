package br.com.furukawa.model

class Meta {
    LinhaDeProducao linhaDeProducao
    BigDecimal metaReprocessos
    BigDecimal metaHK
    Date inicioVigencia
    Date fimVigencia

    static mapping = {
        id generator: 'sequence', params: [ sequence: 'meta_sequence' ]
    }

    static constraints = {
        linhaDeProducao validator: {linha, meta, errors ->
            def query = {
                createAlias('linhaDeProducao', 'l')

                eq('l.nome', linha.nome)
                eq('l.ativo', true)

                if(meta.id) {
                    ne('id', meta.id);
                }
            }

            def criteria = Meta.createCriteria()
            def metasComMesmaLinha = criteria.list(query, max: 1000, offset: 0)

            def datasConflitam = metasComMesmaLinha.any { Meta metaParaComparar ->
                if(meta.possuiConflito(metaParaComparar)) return true
            }

            if(datasConflitam) errors.rejectValue('linhaDeProducao', 'dataColide');
        }
    }

    boolean possuiConflito(Meta meta) {
        return  (this.inicioVigencia >= meta.inicioVigencia && this.fimVigencia <= meta.fimVigencia) ||
                (this.inicioVigencia <= meta.inicioVigencia && this.fimVigencia >= meta.inicioVigencia) ||
                (this.inicioVigencia <= meta.fimVigencia && this.fimVigencia >= meta.fimVigencia) ||
                (this.inicioVigencia <= meta.inicioVigencia && this.fimVigencia >= inicioVigencia)
    }
}
