import {
  APONTAMENTOS_PENDENTES_ERROR,
  APONTAMENTOS_PENDENTES_EXPORTAR_REQUEST,
  APONTAMENTOS_PENDENTES_EXPORTAR_SUCCESS,
  APONTAMENTOS_PENDENTES_LIST_REQUEST,
  APONTAMENTOS_PENDENTES_LIST_SUCCESS
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function apontamentosPendentesListRequest(filtros){
  return {
    type: APONTAMENTOS_PENDENTES_LIST_REQUEST,
    filtros
  }
}

export function apontamentosPendentesListSuccess(data){
  return {
    type: APONTAMENTOS_PENDENTES_LIST_SUCCESS,
    data
  }
}

export function apontamentosPendentesError(error){
  return {
    type: APONTAMENTOS_PENDENTES_ERROR,
    error
  }
}

export function apontamentosPendentesExportarSuccess(data){
  downloadRelatorio(data, "apontamentosPendentes.relatorio.nomeArquivo.label")
  return {
    type: APONTAMENTOS_PENDENTES_EXPORTAR_SUCCESS,
    data
  }
}

export function apontamentosPendentesExportarRequest(filtros) {
  return {
    type: APONTAMENTOS_PENDENTES_EXPORTAR_REQUEST,
    filtros
  }
}
