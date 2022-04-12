package br.com.furukawa.dtos.ebs

import br.com.furukawa.model.ApontamentoDeMaterial
import br.com.furukawa.model.Lote
import br.com.furukawa.model.OrdemDeProducao
import br.com.furukawa.model.RecebimentoNF

class TransacaoOrdemDeProducao {
    String usuario
    String comentario
    String transactionTypeId
    boolean flagConclusao

    List<ItemTransacaoOrdemDeProducao> itens = new ArrayList<>()

    static TransacaoOrdemDeProducao criaTransacaoConclusao(RecebimentoNF recebimentoNF, OrdemDeProducao ordemDeProducao, RoteiroWIP roteiroWIP) {
        TransacaoOrdemDeProducao transacaoOrdemDeProducao = new TransacaoOrdemDeProducao()
        transacaoOrdemDeProducao.usuario = "VZIPPERER"
        transacaoOrdemDeProducao.comentario = "Integração Conclusão GP4.0"
        transacaoOrdemDeProducao.transactionTypeId = "44"
        transacaoOrdemDeProducao.flagConclusao = true

        transacaoOrdemDeProducao.itens.add(ItemTransacaoOrdemDeProducao.criaItemTransacaoConclusao(recebimentoNF, ordemDeProducao, roteiroWIP))

        return transacaoOrdemDeProducao
    }

    static TransacaoOrdemDeProducao criaTransacaoAjusteComponente(ApontamentoDeMaterial apontamentoDeMaterial, OrdemDeProducao ordemDeProducao, RoteiroWIP roteiroWIP) {
        TransacaoOrdemDeProducao transacaoOrdemDeProducao = new TransacaoOrdemDeProducao()
        transacaoOrdemDeProducao.usuario = "VZIPPERER"
        transacaoOrdemDeProducao.comentario = "Integração Ajuste de Componente GP4.0"
        transacaoOrdemDeProducao.transactionTypeId = apontamentoDeMaterial.tipo.idOracle
        transacaoOrdemDeProducao.flagConclusao = false

        transacaoOrdemDeProducao.itens.add(ItemTransacaoOrdemDeProducao.criaItemTransacaoAjusteComponente(apontamentoDeMaterial, ordemDeProducao, roteiroWIP))

        return transacaoOrdemDeProducao
    }

    String asXML() {
        String xml = "<transacao>\n"

        xml += Arrays.asList(this.class.declaredFields).findAll { !it.synthetic }.collect { f ->
            f.setAccessible(true)
            if (f.getName() == "itens") {
                return "\t" + f.get(this).collect {
                    "${it.asXML()?.replace("\n", "\n\t")}"
                }.join("\n\t")
            } else {
                return "\t<${f.getName()}>${f.get(this) != null ? f.get(this) : ""}</${f.getName()}>"
            }
        }.join("\n")

        xml += "\n</transacao>"

        return xml
    }
}
