package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioOrdemFabricacao extends RelatorioExcel {

    List<RelatorioOrdemFabricacaoItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        switch (filtro){
            case "status":
            case "statusWIP":
                return value.split(";").collect({getMessage("status.$it")}).join(", ")
            default:
                return value ?: "";
        }
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        switch (coluna){
            case "status":
                return getMessage("status.$value")
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
        return "relatorios.ofs."
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'quantidadeProgramada':
            case 'quantidadeProduzida':
            case 'ordemSequenciamento':
                return styleInteger
            case 'comprimento':
                return styleDouble
            case 'dataPrevisaoFinalizacao':
            case 'dataUltimaImpressao':
                return styleDia
            case 'dataCriacao':
                return styleDiaHora
            default:
                return defaultStyleTabela
        }
    }
}
