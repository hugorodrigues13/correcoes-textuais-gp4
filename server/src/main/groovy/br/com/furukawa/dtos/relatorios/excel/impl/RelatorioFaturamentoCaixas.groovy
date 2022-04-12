package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioFaturamentoCaixas extends RelatorioExcel{

    List<RelatorioFaturamentoCaixasItem> itens

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
        return ['numeroCaixa', 'recurso', 'linhaProducao', 'total', 'apontados']
                .collectEntries({[it, getMessage(it)]})
    }

    @Override
    protected List<RelatorioDTO> getItens() {
        return itens
    }

    @Override
    protected String getIntlPrefix() {
        return "relatorio.faturamento.caixas."
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'numeroCaixa':
            case 'total':
            case 'apontados':
                return styleInteger
            default:
                return defaultStyleTabela
        }
    }
}
