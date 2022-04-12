package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import br.com.furukawa.model.ProdutoGrupoLinhaDeProducao
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioGrupoLinhaProducao extends RelatorioExcel {

    List<RelatorioGrupoLinhaProducaoItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        return value
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
    protected List<RelatorioDTO> getItens() {
        return itens
    }

    @Override
    protected String getIntlPrefix() {
        return "relatorios.gldp."
    }

    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'quantidade':
                return styleInteger
            default:
                return defaultStyleTabela
        }
    }
}
