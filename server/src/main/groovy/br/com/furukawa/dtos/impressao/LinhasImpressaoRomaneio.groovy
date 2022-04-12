package br.com.furukawa.dtos.impressao

import br.com.furukawa.model.ProdutoRomaneio
import br.com.furukawa.model.ServicoRomaneio
import org.json.JSONObject

class LinhasImpressaoRomaneio {
    String codigoServico
    String descricaoServico
    String codigoProduto
    String descricaoProduto
    Long quantidade
    BigDecimal volume
    BigDecimal unitario
    String unidade
    BigDecimal valorTotal

    LinhasImpressaoRomaneio(ServicoRomaneio servico) {
        this.codigoServico = servico.codigo
        this.descricaoServico = servico.getDescricao()
        this.codigoProduto = ""
        this.descricaoProduto = ""
        this.quantidade = servico.quantidade
        this.volume = servico.volume
        this.unitario = servico.valorUnitario
        this.unidade = servico.unidade
        this.valorTotal = servico.valorTotal
    }

    LinhasImpressaoRomaneio(ProdutoRomaneio produto) {
        this.codigoServico = ""
        this.descricaoServico = ""
        this.codigoProduto = produto.codigo
        this.descricaoProduto = produto.descricao
        this.quantidade = produto.quantidade
        this.volume = produto.volume
        this.unitario = 0
        this.unidade = produto.unidade
        this.valorTotal = 0
    }

    JSONObject toJSONObject() {
        return new JSONObject(
                "CODIGO_SERVICO": codigoServico,
                "DESCRICAO_SERVICO": descricaoServico,
                "CODIGO_PRODUTO": codigoProduto,
                "DESCRICAO_PRODUTO": descricaoProduto,
                "QTDE": quantidade,
                "VOLUME": volume,
                "UNITARIO": unitario.setScale(2, BigDecimal.ROUND_HALF_UP),
                "UNIDADE": unidade,
                "VALOR_TOTAL": valorTotal.setScale(2, BigDecimal.ROUND_HALF_UP)
        )
    }
}
