package br.com.furukawa.dtos

import br.com.furukawa.model.GrupoRecurso
import br.com.furukawa.model.LinhaDeProducao
import br.com.furukawa.model.Lote
import br.com.furukawa.model.ProdutoEtiqueta
import br.com.furukawa.model.Recurso

class ImpressaoEtiquetaSerialApontamentoDTO {
    String codigoProduto
    Recurso recurso
    GrupoRecurso grupoRecurso
    LinhaDeProducao linhaDeProducao
    ProdutoEtiqueta produtoEtiqueta
    Lote lote

    ImpressaoEtiquetaSerialApontamentoDTO(String codigoProduto,
                                          Recurso recurso,
                                          GrupoRecurso grupoRecurso,
                                          LinhaDeProducao linhaDeProducao,
                                          ProdutoEtiqueta produtoEtiqueta,
                                          Lote lote) {

        this.codigoProduto = codigoProduto
        this.recurso = recurso
        this.grupoRecurso = grupoRecurso
        this.linhaDeProducao = linhaDeProducao
        this.produtoEtiqueta = produtoEtiqueta
        this.lote = lote
    }
}
