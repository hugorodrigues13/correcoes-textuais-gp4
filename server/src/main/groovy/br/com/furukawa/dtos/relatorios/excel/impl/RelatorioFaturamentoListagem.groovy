package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioFaturamentoListagem extends RelatorioExcel {

    List<RelatorioFaturamentoListagemItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        switch (filtro){
            case "status":
            case "statusLote":
                return getMessage("status.$value")
            default:
                return value ?: "";
        }
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        switch (coluna){
            case "status":
            case "statusLote":
                return getMessage("status.$value")
            case 'agrupamento':
                return getMessage("agrupamento.$value")
            default:
                return value;
        }
    }

    @Override
    protected Map<String, String> getColunas() {
        return colunas.collectEntries({[it, getMessage(it)]})
    }

    @Override
    protected List<RelatorioDTO> getItens() {
        return itens
    }

    @Override
    protected String getIntlPrefix() {
        return "relatorios.faturamento.listagem."
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna) {
            case 'quantidade':
            case 'quantidadeMaxima':
            case 'quantidadePorCaixa':
                return styleInteger
            default:
                return defaultStyleTabela
        }
    }
}
