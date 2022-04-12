import {
  AUDITORIA_LIST_REQUEST,
  AUDITORIA_LIST_SUCCESS,
  AUDITORIA_GET_ID_REQUEST,
  AUDITORIA_GET_ID_SUCCESS,
  AUDITORIA_ERROR
} from "../actionTypes";

export function listAuditoriaRequest(filtros) {
  return {
    type: AUDITORIA_LIST_REQUEST,
    filtros
  };
}

export function listAuditoriaSuccess(data) {
  return {
    type: AUDITORIA_LIST_SUCCESS,
    data
  };
}

export function getAuditoriaByIdRequest(id) {
  return {
    type: AUDITORIA_GET_ID_REQUEST,
    id
  };
}

export function getAuditoriaByIdSuccess(data) {
  return {
    type: AUDITORIA_GET_ID_SUCCESS,
    data
  };
}

export function error(error) {
  return {
    type: AUDITORIA_ERROR,
    error
  };
}
