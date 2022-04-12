package br.com.furukawa.dtos

import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.model.ImpressaoApontamentoLote
import br.com.furukawa.model.LogOperacao
import br.com.furukawa.model.Lote

class FaturamentoDTO {
    Long id
    String lote
    String codigoProduto
    String descricaoProduto
    String statusLote
    String numeroLote
    String local
    String ordemDeFabricacao
    String agrupamento
    Integer ano
    String semana
    Integer quantidade
    Integer quantidadeMaxima
    Integer quantidadePorCaixa
    String dataFechamento
    Integer impressaoPendente
    Long idImpressao

    String isGrupoLinhaDeProducao(){
        def nomeGrupoLinhaDeProducao = local ? local : ""
        return nomeGrupoLinhaDeProducao
    }

    boolean isAgrupamento() {
        return this.quantidadeMaxima
    }

    String getCodigoLote() {
        return "${numeroLote}${semana}${ano}"
    }

    boolean hasImpressoesPendentes(){
        return ImpressaoApontamentoLote.read(idImpressao)?.any { imp ->
            imp.caixas.any {it.seriais.size() != quantidadePorCaixa }
        }
    }

    boolean foiAgrupado() {
        List<LogOperacao> logs = LogOperacao.createCriteria().list({
            eq "tipoLogOperacao", TipoLogOperacao.AGRUPAR_LOTE
            parametros {
                eq "tipo", TipoParametroLogOperacao.CODIGO_LOTE
                eq "valor", this.getCodigoLote()
            }
        })
        return logs?.size()
    }
}
