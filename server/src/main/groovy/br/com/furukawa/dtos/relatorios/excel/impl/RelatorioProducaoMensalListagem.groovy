package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioProducaoMensalListagem extends RelatorioExcel {
    List<RelatorioProducaoMensalItem> itens
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
        return colunas.collectEntries({
            if(it.equals("periodo")){
                it = it.replace("periodo", "mes")
                [it, getMessage(it)]
            } else {
                [it, getMessage(it)]
            }

        })
    }

    @Override
    protected String getIntlPrefix() {
        return "relatorios.producaoMensal.listagem."
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
