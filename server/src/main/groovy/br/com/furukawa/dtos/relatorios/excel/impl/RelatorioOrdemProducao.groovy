package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.RelatorioDTO
import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioOrdemProducao extends RelatorioExcel{

    List<RelatorioOrdemProducaoItem> itens
    List<String> colunas

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        switch (filtro){
            case "planejador":
                return value == "todos" || value == "padrao" ? getMessage(value) : value
            case "status":
                return getMessage("status.$value")
            case "statusOracle":
                return value.split(";").collect({getMessage("statusOracle.$it")}).join(", ")
            default:
                return value;
        }
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        switch (coluna){
            case "status":
                return getMessage("status.$value")
            case "statusOracle":
                return value == null ? null : getMessage("statusOracle.$value")
            case "lista":
            case "roteiro":
                return value ?: "00"
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
        return "relatorios.ops."
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'quantidade':
            case 'quantidadeRestante':
            case 'quantidadeEntregue':
            case 'quantidadePendenteRomaneio':
            case 'quantidadeTransito':
            case 'totalSequenciado':
            case 'totalPecasProducao':
            case 'totalPecasFinalizadas':
                return styleInteger
            case 'dataCriacao':
                return styleDiaHora
            case 'dataPrevisaoFinalizacao':
                return styleDia
            default:
                return defaultStyleTabela
        }
    }

}
