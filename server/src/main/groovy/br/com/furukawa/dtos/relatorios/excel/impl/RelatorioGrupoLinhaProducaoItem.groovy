package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.model.GrupoLinhaDeProducao
import br.com.furukawa.model.ProdutoGrupoLinhaDeProducao

class RelatorioGrupoLinhaProducaoItem implements RelatorioDTO {

    String nome
    String codigo
    String roteiro
    String quantidade

    RelatorioGrupoLinhaProducaoItem(ProdutoGrupoLinhaDeProducao produto){
        this.nome = produto.grupoLinha.nome
        this.codigo = produto.codigo
        this.roteiro = produto.roteiro
        this.quantidade = produto.quantidadePorPallet
    }

}
