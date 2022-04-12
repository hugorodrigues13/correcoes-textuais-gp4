import {
  LOG_OPERACAO_LIST_REQUEST,
  LOG_OPERACAO_LIST_SUCCESS,
  LOG_OPERACAO_GET_ID_REQUEST,
  LOG_OPERACAO_GET_ID_SUCCESS,
  LOG_OPERACAO_ERROR
} from "../actionTypes";

export function listLogOperacaoRequest(filtros) {
  return {
    type: LOG_OPERACAO_LIST_REQUEST,
    filtros
  };
}

export function listLogOperacaoSuccess(data) {
  return {
    type: LOG_OPERACAO_LIST_SUCCESS,
    data
  };
}

export function getLogByIdRequest(id) {
  return {
    type: LOG_OPERACAO_GET_ID_REQUEST,
    id
  };
}

export function getLogByIdSuccess(entity) {
  return {
    type: LOG_OPERACAO_GET_ID_SUCCESS,
    entity
  };
}

export function error(error) {
  return {
    type: LOG_OPERACAO_ERROR,
    error
  };
}
