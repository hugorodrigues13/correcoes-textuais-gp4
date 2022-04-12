import {
  CONF_GERAL_LIST_REQUEST,
  CONF_GERAL_LIST_SUCCESS,
  CONF_GERAL_UPDATE_VALOR_REQUEST,
  CONF_GERAL_UPDATE_VALOR_SUCCESS,
  CONF_GERAL_ERROR
} from "../actionTypes";

export function listConfGeralRequest(filtros) {
  return {
    type: CONF_GERAL_LIST_REQUEST,
    filtros
  };
}

export function listConfGeralSuccess(data) {
  return {
    type: CONF_GERAL_LIST_SUCCESS,
    data
  };
}

export function updateValorRequest(entity) {
  return {
    type: CONF_GERAL_UPDATE_VALOR_REQUEST,
    entity
  };
}

export function updateValorSuccess(data) {
  return {
    type: CONF_GERAL_UPDATE_VALOR_SUCCESS,
    data
  };
}

export function error(error) {
  return {
    type: CONF_GERAL_ERROR,
    error
  };
}
