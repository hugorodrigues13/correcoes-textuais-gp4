package br.com.furukawa.dtos.impressao

import br.com.furukawa.dtos.ebs.ComponenteWIP
import br.com.furukawa.enums.TipoBaixa
import br.com.furukawa.model.OrdemDeFabricacao
import org.json.JSONObject

import java.math.RoundingMode

class ImpressaoEtiquetaFolhaImpressaoMP {

    String codigo
    String descricao
    String um
    BigDecimal quantidade
    BigDecimal total
    TipoBaixa tipoBaixa
    BigDecimal totalSemAproveitamento
    BigDecimal aproveitamento

    ImpressaoEtiquetaFolhaImpressaoMP(ComponenteWIP mp, OrdemDeFabricacao of) {
        BigDecimal qntdLote = of.quantidadeTotal
        this.codigo = mp.codigoProduto
        this.descricao = mp.descricaoProduto
        this.um = mp.unidade
        this.aproveitamento = mp.componentYieldFactor
        this.quantidade = arredondar(mp.quantidadePorMontagem)
        this.total = arredondar(this.quantidade / this.aproveitamento * qntdLote)
        this.tipoBaixa = TipoBaixa.getById(mp.wipSupplyType)
        this.totalSemAproveitamento = mp.quantidadePorMontagem
    }

    JSONObject toJsonObject() {
        return new JSONObject(
                "CODIGO_MP": codigo,
                "DESCRICAO_MP": descricao,
                "UM": um,
                "QTDE_POR_MONTAGEM": quantidade,
                "TOTAL_MP": total,
                "APROVEITAMENTO": aproveitamento,
                "TOTAL_MP_SEM_APROVEITAMENTO": totalSemAproveitamento,
                "TIPO_BAIXA": tipoBaixa.name
        )
    }

    String getJsonString() {
        return this.toJsonObject().toString()
    }

    private BigDecimal arredondar(BigDecimal d){
        return d.scale() > 5 ? d.setScale(5, RoundingMode.HALF_EVEN) : d;
    }

}
