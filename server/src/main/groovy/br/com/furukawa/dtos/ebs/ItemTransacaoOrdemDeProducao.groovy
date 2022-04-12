package br.com.furukawa.dtos.ebs

import br.com.furukawa.model.ApontamentoDeMaterial
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.RecebimentoNF

class ItemTransacaoOrdemDeProducao {
    String sourceCode
    String sourceLineId
    String sourceHeaderId
    String processFlag
    String validationRequired
    String transactionMode
    String lockFlag
    Long inventoryItemId
    String codigoProduto
    Long organizationId
    BigDecimal quantidade
    String unidade
    String codigoSubinventario
    Long locatorId
    Long wipEntityId
    String codigoOrdemDeProducao
    String transactionSourceName = "1"
    Long sequenciaOperacao
    String finalCompletionFlag
    String wipEntityType

    List<LoteTransacaoOrdemDeProducao> lotes = new ArrayList()

    static ItemTransacaoOrdemDeProducao criaItemTransacaoConclusao(RecebimentoNF recebimentoNF, OrdemDeProducao ordemDeProducao, RoteiroWIP roteiroWIP) {
        ItemTransacaoOrdemDeProducao itemTransacaoOrdemDeProducao = new ItemTransacaoOrdemDeProducao()
        itemTransacaoOrdemDeProducao.sourceCode = "GP4" + (recebimentoNF.interfaceTransactionId ? "-${recebimentoNF.interfaceTransactionId}" : "-SN${recebimentoNF.id}")
        itemTransacaoOrdemDeProducao.sourceLineId = recebimentoNF.interfaceTransactionId
        itemTransacaoOrdemDeProducao.sourceHeaderId = recebimentoNF.interfaceTransactionId
        itemTransacaoOrdemDeProducao.processFlag = "1"
        itemTransacaoOrdemDeProducao.validationRequired = "1"
        itemTransacaoOrdemDeProducao.transactionMode = "3"
        itemTransacaoOrdemDeProducao.lockFlag = "2"
        itemTransacaoOrdemDeProducao.inventoryItemId = roteiroWIP.inventoryItemId
        itemTransacaoOrdemDeProducao.codigoProduto = roteiroWIP.codigoProduto
        itemTransacaoOrdemDeProducao.organizationId = ordemDeProducao.getOrganizacaoOP()?.organizationID?.toLong()
        itemTransacaoOrdemDeProducao.quantidade = recebimentoNF.quantidade
        itemTransacaoOrdemDeProducao.unidade = roteiroWIP.unidade
        itemTransacaoOrdemDeProducao.codigoSubinventario = roteiroWIP.codigoSubinventario
        itemTransacaoOrdemDeProducao.locatorId = roteiroWIP.completionLocatorId
        itemTransacaoOrdemDeProducao.wipEntityId = ordemDeProducao.wipEntityID
        itemTransacaoOrdemDeProducao.codigoOrdemDeProducao = recebimentoNF.ordemDeProducao
        itemTransacaoOrdemDeProducao.finalCompletionFlag = "N"
        itemTransacaoOrdemDeProducao.wipEntityType = "1"

        if(recebimentoNF.lotesQuantidades) {
            recebimentoNF.lotesQuantidades.each {
                itemTransacaoOrdemDeProducao.lotes.add(new LoteTransacaoOrdemDeProducao(numeroLote: it.codigoLote, quantidadeUtilizada: it.quantidade))
            }
        } else {
            ordemDeProducao.getLotesDaNF(recebimentoNF.notaFiscal).each {
                itemTransacaoOrdemDeProducao.lotes.add(new LoteTransacaoOrdemDeProducao(numeroLote: it.key, quantidadeUtilizada: it.value))
            }
        }

        return itemTransacaoOrdemDeProducao
    }

    static ItemTransacaoOrdemDeProducao criaItemTransacaoAjusteComponente(ApontamentoDeMaterial apontamentoDeMaterial, OrdemDeProducao ordemDeProducao, RoteiroWIP roteiroWIP) {
        ComponenteWIP componenteWIP = roteiroWIP.operacoes.first().componentes.find {it.codigoProduto == apontamentoDeMaterial.codigoProduto}
        BigDecimal quantidade = apontamentoDeMaterial.tipo.isConsumo() ? apontamentoDeMaterial.quantidade.negate() : apontamentoDeMaterial.quantidade

        ItemTransacaoOrdemDeProducao itemTransacaoOrdemDeProducao = new ItemTransacaoOrdemDeProducao()
        itemTransacaoOrdemDeProducao.sourceCode = "GP4-AM${apontamentoDeMaterial.id}"
        itemTransacaoOrdemDeProducao.sourceLineId = apontamentoDeMaterial.id
        itemTransacaoOrdemDeProducao.sourceHeaderId = apontamentoDeMaterial.id
        itemTransacaoOrdemDeProducao.processFlag = "1"
        itemTransacaoOrdemDeProducao.validationRequired = "1"
        itemTransacaoOrdemDeProducao.transactionMode = "3"
        itemTransacaoOrdemDeProducao.lockFlag = "2"
        itemTransacaoOrdemDeProducao.inventoryItemId = componenteWIP.inventoryItemId
        itemTransacaoOrdemDeProducao.codigoProduto = componenteWIP.codigoProduto
        itemTransacaoOrdemDeProducao.organizationId = ordemDeProducao.getOrganizacaoOP()?.organizationID?.toLong()
        itemTransacaoOrdemDeProducao.quantidade = quantidade
        itemTransacaoOrdemDeProducao.unidade = componenteWIP.unidade
        itemTransacaoOrdemDeProducao.codigoSubinventario = componenteWIP.codigoSubinventario
        itemTransacaoOrdemDeProducao.locatorId = componenteWIP.locatorId
        itemTransacaoOrdemDeProducao.wipEntityId = componenteWIP.wipEntityId
        itemTransacaoOrdemDeProducao.codigoOrdemDeProducao = apontamentoDeMaterial.ordemDeProducao
        itemTransacaoOrdemDeProducao.finalCompletionFlag = "N"
        itemTransacaoOrdemDeProducao.wipEntityType = "1"
        itemTransacaoOrdemDeProducao.sequenciaOperacao = componenteWIP.sequenciaOperacao

        itemTransacaoOrdemDeProducao.lotes.add(
                new LoteTransacaoOrdemDeProducao(
                        numeroLote: apontamentoDeMaterial.codigoLote,
                        quantidadeUtilizada: quantidade
                )
        )

        return itemTransacaoOrdemDeProducao
    }

    String asXML() {
        String xml = "<itens>\n"

        xml += Arrays.asList(this.class.declaredFields).findAll { !it.synthetic }.collect { f ->
            f.setAccessible(true)
            if (f.getName() == "lotes") {
                return "\t" + f.get(this).collect {
                    "${it.asXML()?.replace("\n", "\n\t")}"
                }.join("\n\t")
            } else {
                return "\t<${f.getName()}>${f.get(this) != null ? f.get(this) : ""}</${f.getName()}>"
            }
        }.join("\n")

        xml += "\n</itens>"

        return xml
    }
}
