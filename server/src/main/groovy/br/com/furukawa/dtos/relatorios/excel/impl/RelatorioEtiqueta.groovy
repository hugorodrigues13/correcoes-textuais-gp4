package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioEtiqueta extends RelatorioExcel {

    List<RelatorioEtiquetaItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        switch (filtro){
            case "serial":
                return getMessage("serial.$value")
            default:
                return value;
        }
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        switch (coluna) {
            case "serial":
                return getMessage("serial.$value")
            default:
                return value
        }
    }

    @Override
    protected Map<String, String> getColunas() {
        return colunas.collectEntries({[it, getMessage(it)]})
    }

    @Override
    protected String getIntlPrefix() {
        return "relatorios.etiqueta."
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'copias':
            case 'quantidadeAgrupamento':
                return styleInteger
            default:
                return defaultStyleTabela
        }
    }

    List<RelatorioEtiquetaItem> getItens() {
        return itens
    }
}
