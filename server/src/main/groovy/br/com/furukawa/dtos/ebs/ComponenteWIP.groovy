package br.com.furukawa.dtos.ebs

import br.com.furukawa.model.ComponenteOPWIP
import org.json.JSONObject

class ComponenteWIP {
    Long inventoryItemId
    String codigoProduto
    Long organizationId
    String codigoOperacao
    Long sequenciaOperacao
    String unidade
    String codigoSubinventario
    Long locatorId
    Long wipEntityId
    String codigoOrdemDeProducao
    Integer wipSupplyType
    BigDecimal quantidadeRequerida
    BigDecimal quantidadeEmitida
    BigDecimal componentYieldFactor
    BigDecimal quantidadePorMontagem
    String descricaoProduto

    ComponenteWIP() {

    }

    ComponenteWIP(JSONObject object) {
        this.inventoryItemId = object.inventoryItemId
        this.codigoProduto = object.codigoProduto
        this.organizationId = object.organizationId
        this.codigoOperacao = object.codigoOperacao
        this.sequenciaOperacao = object.sequenciaOperacao
        this.unidade = object.unidade
        this.codigoSubinventario = object.codigoSubinventario
        this.locatorId = object.locatorId
        this.wipEntityId = object.wipEntityId
        this.codigoOrdemDeProducao = object.codigoOrdemDeProducao
        this.wipSupplyType = object.wipSupplyType
        this.quantidadeRequerida = object.has("quantidadeRequerida") ? new BigDecimal( object.quantidadeRequerida.toString() ) : null
        this.quantidadeEmitida = object.has("quantidadeEmitida") ? new BigDecimal( object.quantidadeEmitida.toString() ) : null
        this.componentYieldFactor = object.has("componentYieldFactor") ? new BigDecimal( object.componentYieldFactor.toString() ) : null
        this.quantidadePorMontagem = object.has("quantidadePorMontagem") ? new BigDecimal( object.quantidadePorMontagem.toString() ) : null

        if(object.has("descricaoProduto")) {
            this.descricaoProduto = object.descricaoProduto
        }
    }

    static ComponenteWIP montaPorComponenteOP(ComponenteOPWIP componenteOPWIP) {
        ComponenteWIP componenteWIP = new ComponenteWIP()
        componenteWIP.inventoryItemId = componenteOPWIP.inventoryItemId
        componenteWIP.codigoProduto = componenteOPWIP.codigoProduto
        componenteWIP.organizationId = componenteOPWIP.organizationId
        componenteWIP.codigoOperacao = componenteOPWIP.operationCode
        componenteWIP.sequenciaOperacao = componenteOPWIP.operationSequence
        componenteWIP.unidade = componenteOPWIP.unidade
        componenteWIP.codigoSubinventario = componenteOPWIP.codigoSubinventario
        componenteWIP.locatorId = componenteOPWIP.locatorId
        componenteWIP.wipEntityId = componenteOPWIP.ordemDeProducao.wipEntityID
        componenteWIP.codigoOrdemDeProducao = componenteOPWIP.ordemDeProducao.codigoOrdem
        componenteWIP.wipSupplyType = componenteOPWIP.wipSupplyType
        componenteWIP.quantidadeRequerida = componenteOPWIP.quantidadeRequerida
        componenteWIP.quantidadeEmitida = componenteOPWIP.quantidadeEmitida
        componenteWIP.componentYieldFactor = componenteOPWIP.componentYieldFactor
        componenteWIP.quantidadePorMontagem = componenteOPWIP.quantidadePorMontagem
        componenteWIP.descricaoProduto = componenteOPWIP.descricaoProduto

        return componenteWIP
    }
}
