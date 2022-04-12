package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioApontamentoPendenteListagem extends RelatorioExcel{

    List<RelatorioApontamentoPendenteItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        return value;
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        return value
    }

    @Override
    protected Map<String, String> getColunas() {
        return colunas.collectEntries({[it, getMessage(it)]})
    }

    @Override
    protected String getIntlPrefix() {
        return "relatorios.apontamentoPendente.listagem."
    }

    List<RelatorioApontamentoPendenteItem> getItens() {
        return itens
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'data':
                return styleDiaHora
            default:
                return defaultStyleTabela
        }
    }
}
