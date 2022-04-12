package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioSerialListagem extends RelatorioExcel{

    List<RelatorioSerialListagemItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        switch (filtro){
            case "status":
                return value.split(";").collect({getMessage("status.$it")}).join(", ")
            case "statusOrdemFabricacao":
                return value.split(";").collect({getMessage("statusOrdemFabricacao.$it")}).join(", ")
            case "statusWip":
                return value.split(";").collect({getMessage("statusWip.$it")}).join(", ")
            default:
                return value;
        }
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        switch (coluna) {
            case "status":
                return getMessage("status.$value")
            case "statusOrdemFabricacao":
                return getMessage("statusOrdemFabricacao.$value")
            case "statusWip":
                return value ? getMessage("statusWip.$value") : ''
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
        return "relatorios.serial.listagem."
    }

    List<RelatorioSerialListagemItem> getItens() {
        return itens
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'dataFinalizacao':
                return styleDia
            case 'ultimoApontamento':
                return styleDiaHora
            default:
                return defaultStyleTabela
        }
    }

}
