package br.com.furukawa.dtos.filtros

import br.com.furukawa.dtos.Ordenacao
import br.com.furukawa.dtos.Paginacao
import br.com.furukawa.enums.StatusLote
import br.com.furukawa.enums.TipoLogOperacao
import br.com.furukawa.enums.TipoParametroLogOperacao
import br.com.furukawa.model.OrdemDeFabricacao

class FiltroFaturamento extends Filtro {
    Long id
    String lote
    String codigoProduto
    String statusLote
    String descricao
    String local
    OrdemDeFabricacao ordemDeFabricacao
    Boolean agrupamento
    Integer quantidade
    Integer quantidadeMaxima
    Integer quantidadePorCaixa
    Date dataDeFechamento
    Ordenacao ordenacao
    Paginacao paginacao

    FiltroFaturamento(Map params) {
        super(params)
        this.ordenacao = new Ordenacao(sort: params.sort ?: "(ano||semana||numero_lote)", order: params.order)
        this.statusLote = params.statusLote != "TODOS" ? params.statusLote : null
    }

    @Override
    String traduzirPropParaColuna(String prop) {
        switch (prop){
            case 'id':
                return 'l.id'
            case 'lote':
                return "l.numero_lote || LPAD(l.semana, 2, '0') || l.ano"
            case 'codigoProduto':
                return "l.codigo_produto"
            case 'descricao':
                return "nvl(prod.descricao, l.descricao_produto)"
            case 'statusLote':
                return "l.status_lote"
            case 'ano':
                return "l.ano"
            case 'quantidade':
                return "count(sf.id)"
            case 'quantidadeMaxima':
                return "l.quantidade_maxima"
            case 'quantidadePorCaixa':
                return "l.quantidade_por_caixa"
            case 'semana':
                return "l.semana"
            case 'ordemDeFabricacao':
                return "ofab.numero || '-' || ofab.ano"
            case 'local':
                return "gl.nome"
            case 'dataFinalizacao':
                return montaSubQueryDataFechamento()
            default:
                return prop
        }
    }

    @Override
    String traduzirPropParaOrder(String prop) {
        switch(prop){
            case 'quantidade':
            case 'quantidadeMaxima':
            case 'quantidadePorCaixa':
            case 'codigoProduto':
            case 'descricaoProduto':
                return traduzirPropParaColuna(prop)
            case 'dataFechamento':
                return "to_date(${traduzirPropParaColuna(prop)}, 'DD/MM/YYYY HH24:MI')"
            default:
                return prop
        }
    }

    protected Object customizarProp(String prop, Object valor) {
        switch (prop){
            case 'quantidade':
            case 'quantidadeMaxima':
            case 'quantidadePorCaixa':
                return valor?.isNumber() ? valor.toLong() : 0L
            default:
                return valor
        }
    }

    static String montaSubQueryDataFechamento() {
        return """
        case when l.status_lote='${StatusLote.ABERTO}' then null else
        coalesce(greatest(max(sf.data_ultimo_apontamento), max(lo.data)), max(sf.data_ultimo_apontamento), max(lo.data)) end
        """
    }

    @Override
    String gerarOrderBy(){
        Ordenacao ordenacao = this.ordenacao
        return "ORDER BY ${traduzirPropParaOrder((ordenacao.sort))} ${ordenacao.order} NULLS LAST"
    }
}
