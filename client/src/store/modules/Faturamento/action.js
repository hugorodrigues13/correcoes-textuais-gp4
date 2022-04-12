import {
  FATURAMENTO_LIST_REQUEST,
  FATURAMENTO_LIST_SUCCESS,
  FATURAMENTO_ENVIO_LOTE_ROMANEIO_REQUEST,
  FATURAMENTO_ENVIO_LOTE_ROMANEIO_SUCCESS,
  FATURAMENTO_FECHAR_LOTE_INCOMPLETO_REQUEST,
  FATURAMENTO_FECHAR_LOTE_INCOMPLETO_SUCCESS,
  FATURAMENTO_ERROR,
  FATURAMENTO_EXPORTAR_LOTES_REQUEST,
  FATURAMENTO_EXPORTAR_LOTES_SUCCESS,
  FATURAMENTO_CHECAR_LOTE_ROMANEIO_REQUEST,
  FATURAMENTO_CHECAR_LOTE_ROMANEIO_SUCCESS,
  FATURAMENTO_LIST_IMPRESSORAS_REQUEST,
  FATURAMENTO_LIST_IMPRESSORAS_SUCCESS,
  FATURAMENTO_GET_CAIXAS_REQUEST,
  FATURAMENTO_GET_CAIXAS_SUCCESS,
  FATURAMENTO_EXPORTAR_CAIXAS_SUCCESS,
  FATURAMENTO_EXPORTAR_CAIXAS_REQUEST,
  FATURAMENTO_ABRIR_LOTE_REQUEST,
  FATURAMENTO_ABRIR_LOTE_SUCCESS,
  FATURAMENTO_EXPORTAR_EXCEL_REQUEST,
  FATURAMENTO_EXPORTAR_EXCEL_SUCCESS, FATURAMENTO_CONCLUIR_OP_REQUEST, FATURAMENTO_CONCLUIR_OP_SUCCESS,
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function faturamentoListarRequest(filtros) {
  return {
    type: FATURAMENTO_LIST_REQUEST,
    filtros
  }
}

export function faturamentoListarSuccess(data) {
  return {
    type: FATURAMENTO_LIST_SUCCESS,
    data
  }
}

export function faturamentoExportarExcelRequest(filtros){
  return {
    type: FATURAMENTO_EXPORTAR_EXCEL_REQUEST,
    filtros
  }
}

export function faturamentoExportarExcelSuccess(data){
  downloadRelatorio(data, "faturamento.relatorio.nomeArquivo.label")
  return {
    type: FATURAMENTO_EXPORTAR_EXCEL_SUCCESS,
    data
  }
}

export function envioLoteRomaneioRequest(data) {
  return {
    type: FATURAMENTO_ENVIO_LOTE_ROMANEIO_REQUEST,
    data
  }
}

export function envioLoteRomaneioSuccess(data) {
  return {
    type: FATURAMENTO_ENVIO_LOTE_ROMANEIO_SUCCESS,
    data
  }
}

export function concluirOPRequest(data) {
  return {
    type: FATURAMENTO_CONCLUIR_OP_REQUEST,
    data
  }
}

export function concluirOPSuccess(data) {
  return {
    type: FATURAMENTO_CONCLUIR_OP_SUCCESS,
    data
  }
}

export function checarLoteRomaneioRequest(data) {
  return {
    type: FATURAMENTO_CHECAR_LOTE_ROMANEIO_REQUEST,
    data
  }
}

export function checarLoteRomaneioSuccess(data) {
  return {
    type: FATURAMENTO_CHECAR_LOTE_ROMANEIO_SUCCESS,
    data
  }
}

export function fecharLoteIncompletoRequest(data) {
  return {
    type: FATURAMENTO_FECHAR_LOTE_INCOMPLETO_REQUEST,
    data
  }
}

export function fecharLoteIncompletoSuccess(data) {
  return {
    type: FATURAMENTO_FECHAR_LOTE_INCOMPLETO_SUCCESS,
    data
  }
}

export function exportarLotesRequest() {
  return {
    type: FATURAMENTO_EXPORTAR_LOTES_REQUEST,
  }
}

export function exportarLotesSuccess(data) {
  downloadRelatorio(data, "faturamento.relatorio.nomeArquivo.label", '.pdf')
  return {
    type: FATURAMENTO_EXPORTAR_LOTES_SUCCESS,
    data,
  }
}

export function listImpressorasRequest(){
  return {
    type: FATURAMENTO_LIST_IMPRESSORAS_REQUEST,
  }
}

export function listImpressorasSuccess(data){
  return {
    type: FATURAMENTO_LIST_IMPRESSORAS_SUCCESS,
    data,
  }
}

export function getCaixasFaturamentoRequest(lote){
  return {
    type: FATURAMENTO_GET_CAIXAS_REQUEST,
    lote
  }
}

export function getCaixasFaturamentoSuccess(data){
  return {
    type: FATURAMENTO_GET_CAIXAS_SUCCESS,
    data,
  }
}

export function exportarCaixasFaturamentoRequest(lote){
  return {
    type: FATURAMENTO_EXPORTAR_CAIXAS_REQUEST,
    lote,
  }
}

export function exportarCaixasFaturamentoSuccess(data){
  downloadRelatorio(data, "faturamento.caixas.relatorio.nomeArquivo.label")
  return {
    type: FATURAMENTO_EXPORTAR_CAIXAS_SUCCESS,
    data
  }
}

export function faturamento_abrir_lote_request(id) {
  return {
    type: FATURAMENTO_ABRIR_LOTE_REQUEST,
    id,
  }
}

export function faturamento_abrir_lote_success(data) {
  return {
    type: FATURAMENTO_ABRIR_LOTE_SUCCESS,
    data
  }
}


//ERROR
export function error(error) {
  return {
    type: FATURAMENTO_ERROR,
    error
  };
}
