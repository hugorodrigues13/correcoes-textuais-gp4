package br.com.furukawa.dtos.relatorios.excel.impl

import br.com.furukawa.dtos.relatorios.excel.RelatorioExcel
import org.apache.poi.ss.usermodel.CellStyle

class RelatorioSerial extends RelatorioExcel {

    List<RelatorioSerialItem> itens
    boolean completo

    @Override
    List<RelatorioSerialItem> getItens() {
        return itens
    }

    @Override
    protected String getIntlPrefix() {
        return "relatorios.serial."
    }

    @Override
    protected String formataFiltro(String filtro) {
        return getMessage(filtro)
    }

    @Override
    protected String formataFiltroValor(String filtro, String value) {
        switch (filtro){
            case "statusOrdemFabricacao":
                return value.split(",").collect({getMessage("status.$it")}).join(", ")
            default:
                return value;
        }
    }

    private static final List<String> COLUNAS_RESUMIDAS = ["serial","codigoProduto" ,"descricaoProduto","ordemFabricacao" ,"ordemProducao" ,"lote" ,"status" ,"linhaProducao" ,"grupoLinhaProducao" ,"statusOrdemFabricacao", "statusLote", "comprimento", "cliente"]
    private static final List<String> COLUNAS_DETALHADAS =  ["serial" ,"codigoProduto" ,"descricaoProduto" ,"ordemFabricacao","ordemProducao" ,"lote" ,"status" ,"horario","recurso" ,"grupoRecurso" ,"linhaProducao" ,"grupoLinhaProducao" ,"statusOrdemFabricacao", "statusLote", "comprimento", "cliente" ,"defeito" ,"apontadoPor"]

    @Override
    protected Map<String, String> getColunas() {
        return (completo ? COLUNAS_DETALHADAS : COLUNAS_RESUMIDAS)
                .collectEntries({[it, getMessage(it)]})
    }

    @Override
    protected String formataColunaValor(String coluna, String value) {
        switch (coluna){
            case "statusOrdemFabricacao":
            case "statusLote":
            case "status":
                return value ? getMessage("status.$value") : ''
            case "lote":
                if (value == "-/") return ""
            default:
                return value
        }
    }

    @Override
    protected CellStyle getColunaTipo(String coluna) {
        switch (coluna){
            case 'horario':
                return styleDiaHora
            default:
                return defaultStyleTabela
        }
    }

}
