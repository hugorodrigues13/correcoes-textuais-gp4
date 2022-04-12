package br.com.furukawa.model

import br.com.furukawa.enums.TipoPaginaColunas

class UsuarioColunas {

    List<String> colunas
    TipoPaginaColunas tipo

    static belongsTo = [usuario: User]

    static constraints = {

    }

    static mapping = {
        table 'usuario_colunas'
        colunas joinTable: [name: 'usuario_colunas_valores', key: 'coluna_id', column: 'valor']
    }

}
