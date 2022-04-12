package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioPlanejamentoDiario extends RelatorioExcel {

    List<RelatorioPlanejamentoDiarioItem> itens
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
        return "relatorio.planejamentoDiario."
    }

    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'quantidadePlanejadaPecas':
            case 'quantidadePlanejadaPessoas':
            case 'quantidadePessoasPresentes':
                return styleInteger
            case 'data':
                return styleDia
            default:
                return defaultStyleTabela
        }
    }
}
