package br.com.furukawa.model

import br.com.furukawa.dtos.ebs.ComponenteWIP

class ComponenteOPWIP {
    Long inventoryItemId
    String codigoProduto
    Long organizationId
    String unidade
    String codigoSubinventario
    Long locatorId
    Integer wipSupplyType
    BigDecimal quantidadeRequerida
    BigDecimal quantidadeEmitida
    BigDecimal componentYieldFactor
    BigDecimal quantidadePorMontagem
    String descricaoProduto
    Long operationSequence
    String operationCode
    OrdemDeProducao ordemDeProducao

    ComponenteOPWIP(ComponenteWIP componenteWIP, OrdemDeProducao ordemDeProducao) {
        this.inventoryItemId = componenteWIP.inventoryItemId
        this.codigoProduto = componenteWIP.codigoProduto
        this.organizationId = componenteWIP.organizationId
        this.unidade = componenteWIP.unidade
        this.codigoSubinventario = componenteWIP.codigoSubinventario
        this.locatorId = componenteWIP.locatorId
        this.wipSupplyType = componenteWIP.wipSupplyType
        this.quantidadeRequerida = componenteWIP.quantidadeRequerida
        this.quantidadeEmitida = componenteWIP.quantidadeEmitida
        this.componentYieldFactor = componenteWIP.componentYieldFactor
        this.quantidadePorMontagem = componenteWIP.quantidadePorMontagem
        this.descricaoProduto = componenteWIP.descricaoProduto
        this.ordemDeProducao = ordemDeProducao
        this.operationSequence = componenteWIP.sequenciaOperacao
        this.operationCode = componenteWIP.codigoOperacao
    }

    static constraints = {
    }

    static mapping = {
        id generator: 'sequence', params: [sequence: 'componente_op_wip_seq']
        table 'componente_op_wip'
    }
}
