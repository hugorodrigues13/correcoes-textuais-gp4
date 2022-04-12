import {
  ALMOXARIFADO_LIST_REQUEST,
  ALMOXARIFADO_ERROR,
  ALMOXARIFADO_LIST_SUCCESS,
  ALMOXARIFADO_SET_OPEN_REQUEST,
  ALMOXARIFADO_SET_OPEN_SUCCESS,
  ALMOXARIFADO_CHANGE_PAGINATION_REQUEST,
  ALMOXARIFADO_CHANGE_PAGINATION_SUCCESS,
  ALMOXARIFADO_LIST_MATERIAIS_REQUEST,
  ALMOXARIFADO_LIST_MATERIAIS_SUCCESS,
} from "../actionTypes";

export function listAlmoxarifadoRequest( filtros ) {
  return {
    type: ALMOXARIFADO_LIST_REQUEST,
    filtros
  }
}

export function listAlmoxarifadoSuccess( data ) {
  return {
    type: ALMOXARIFADO_LIST_SUCCESS,
    data
  };
}

export function setOpenAlmoxarifadoRequest( id, justificativa ) {
  return {
    type: ALMOXARIFADO_SET_OPEN_REQUEST,
    id, justificativa
  }
}

export function setOpenAlmoxarifadoSuccess( data ) {
  return {
    type: ALMOXARIFADO_SET_OPEN_SUCCESS,
    data
  };
}

export function changePaginationAlmoxarifadoRequest( page, pageSize ) {
  return {
    type: ALMOXARIFADO_CHANGE_PAGINATION_REQUEST,
    page,
    pageSize,
  }
}

export function changePaginationAlmoxarifadoSuccess( page, pageSize ) {
  return {
    type: ALMOXARIFADO_CHANGE_PAGINATION_SUCCESS,
    page,
    pageSize,
  };
}

export function listarMateriaisRequest(filtros){
  return {
    type: ALMOXARIFADO_LIST_MATERIAIS_REQUEST,
    filtros,
  }
}

export function listarMateriaisSuccess(data){
  return {
    type: ALMOXARIFADO_LIST_MATERIAIS_SUCCESS,
    data,
  }
}

export function error( error ) {
  return {
    type: ALMOXARIFADO_ERROR,
    error
  }
}
