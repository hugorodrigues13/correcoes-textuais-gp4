import {
  DASHBOARD_PRODUCAO_INDICADORES_REQUEST, DASHBOARD_PRODUCAO_INDICADORES_SUCCESS,
  DASHBOARD_PRODUCAO_LIST_REQUEST,
  DASHBOARD_PRODUCAO_LIST_SUCCESS,
  DASHBOARD_PRODUCAO_SERIAIS_DIA_REQUEST, DASHBOARD_PRODUCAO_SERIAIS_DIA_SUCCESS,
  DASHBOARD_PRODUCAO_STATUS_SERIAIS_REQUEST,
  DASHBOARD_PRODUCAO_STATUS_SERIAIS_SUCCESS,
  IMPRESSORA_ERROR
} from "../actionTypes"

export function listDashboardProducaoRequest() {
  return {
    type: DASHBOARD_PRODUCAO_LIST_REQUEST
  }
}

export function listDashboardProducaoSuccess(data) {
  return {
    type: DASHBOARD_PRODUCAO_LIST_SUCCESS,
    data
  }
}

export function indicadoresRequest() {
  return {
    type: DASHBOARD_PRODUCAO_INDICADORES_REQUEST
  }
}

export function indicadoresSuccess(data) {
  return {
    type: DASHBOARD_PRODUCAO_INDICADORES_SUCCESS,
    data
  }
}

export function statusSeriaisRequest(filtros) {
  return {
    type: DASHBOARD_PRODUCAO_STATUS_SERIAIS_REQUEST,
    filtros
  }
}

export function statusSeriaisSuccess(data) {
  return {
    type: DASHBOARD_PRODUCAO_STATUS_SERIAIS_SUCCESS,
    data
  }
}

export function seriaisDiaRequest(filtros) {
  return {
    type: DASHBOARD_PRODUCAO_SERIAIS_DIA_REQUEST,
    filtros
  }
}

export function seriaisDiaSuccess(data) {
  return {
    type: DASHBOARD_PRODUCAO_SERIAIS_DIA_SUCCESS,
    data
  }
}


//ERROR
export function error(error) {
  return {
    type: IMPRESSORA_ERROR,
    error
  };
}
