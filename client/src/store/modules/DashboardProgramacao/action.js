import {DASH_PROGRAMACAO_ERROR, DASH_PROGRAMACAO_LIST_REQUEST, DASH_PROGRAMACAO_LIST_SUCCESS} from "../actionTypes";

export function listProgramacaoRequest(filtros) {
  return {
    type: DASH_PROGRAMACAO_LIST_REQUEST,
    filtros
  }
}

export function listProgramacaoSuccess( data ) {
  return {
    type: DASH_PROGRAMACAO_LIST_SUCCESS,
    data
  };
}

export function error( error ) {
  return {
    type: DASH_PROGRAMACAO_ERROR,
    error
  }
}
