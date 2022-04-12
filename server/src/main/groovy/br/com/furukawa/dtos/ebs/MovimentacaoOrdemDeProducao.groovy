package br.com.furukawa.dtos.ebs

import br.com.furukawa.model.RecebimentoNF

class MovimentacaoOrdemDeProducao {
    String user = "VZIPPERER"
    String sourceCode
    Long sourceLineId
    Integer processPhase = 1 //(1 - Move Validation, 2 - Move Processing, 3 - Operation Backflush Setup)
    Integer processStatus = 1 //(1 - Pending, 2 - Running, 3 - Error)
    Integer transactionType = 1//(1 - Move, 2 - Move Completion, 3 - Move Return) Movimentação Entra as Operações)
    Long organizationId
    String wipEntityName
    Integer entityType = 1
    Integer fromOperationSeq
    Integer fromIntraOperationStepType = 1//fm_intraoperation_step_type (1 - Queue, 2 - Run, 3 - To Move, 4 - Reject, 5 - Scrap)
    Integer toOperationSeq
    Integer toIntraOperationStepType = 3//to_intraoperation_step_type (1 - Queue, 2 - Run, 3 - To Move, 4 - Reject, 5 - Scrap)
    BigDecimal transactionQuantity
    String transactionUOM
    String reference = "Integração de Movimentação Discreta - GP4.0 x WIP."

    MovimentacaoOrdemDeProducao(RecebimentoNF recebimentoNF, Long organizationId, RoteiroWIP roteiroWIP) {
        this.sourceLineId = recebimentoNF.interfaceTransactionId
        this.sourceCode = "GP4" + (recebimentoNF.interfaceTransactionId ? "-${recebimentoNF.interfaceTransactionId}" : "-SN${recebimentoNF.id}")
        this.organizationId = organizationId
        this.wipEntityName = recebimentoNF.ordemDeProducao
        this.fromOperationSeq = roteiroWIP.getSequenciaPrimeiraOperacao()
        this.fromIntraOperationStepType = 1
        this.toOperationSeq = roteiroWIP.getSequenciaUltimaOperacao()
        this.transactionQuantity = recebimentoNF.quantidade
        this.transactionUOM = roteiroWIP.unidade
    }

    String asXML() {
        String xml = "<movimentacao>\n"

        xml += Arrays.asList(this.class.declaredFields).findAll { !it.synthetic }.collect { f ->
            f.setAccessible(true)
            return "\t<${f.getName()}>${f.get(this) != null ? f.get(this) : ""}</${f.getName()}>"
        }.join("\n")

        xml += "\n</movimentacao>"

        return xml
    }
}
