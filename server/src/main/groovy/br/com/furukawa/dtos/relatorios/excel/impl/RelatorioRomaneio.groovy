package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioRomaneio extends RelatorioExcel {

    List<RelatorioRomaneioItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        switch (filtro){
            case "status":
                return getMessage("status.$value")
            default:
                return value;
        }
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        switch (coluna) {
            case "status":
                return getMessage("status.$value")
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
        return "relatorios.romaneio."
    }

    List<RelatorioRomaneioItem> getItens() {
        return itens
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'quantidadeTotal':
                return styleInteger
            case 'valorTotal':
                return styleMonetario
            case 'emissao':
                return styleDiaHora
            default:
                return defaultStyleTabela
        }
    }

}
