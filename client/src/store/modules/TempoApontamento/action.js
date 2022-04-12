import {
  TEMPO_APONTAMENTO_EDIT_REQUEST, TEMPO_APONTAMENTO_EDIT_SUCCESS,
  TEMPO_APONTAMENTO_ERROR,
  TEMPO_APONTAMENTO_LIST_REQUEST,
  TEMPO_APONTAMENTO_LIST_SUCCESS
} from "../actionTypes";

export function tempoApontamentoListRequest(filtros){
  return {
    type: TEMPO_APONTAMENTO_LIST_REQUEST,
    filtros
  }
}

export function tempoApontamentoListSuccess(data){
  return {
    type: TEMPO_APONTAMENTO_LIST_SUCCESS,
    data
  }
}

export function tempoApontamentoEditRequest(id, tempo, todos, filtros){
  return {
    type: TEMPO_APONTAMENTO_EDIT_REQUEST,
    id, tempo, todos, filtros
  }
}

export function tempoApontamentoEditSuccess(data){
  return {
    type: TEMPO_APONTAMENTO_EDIT_SUCCESS,
    data
  }
}

export function tempoApontamentoError(error){
  return {
    type: TEMPO_APONTAMENTO_ERROR,
    error
  }
}
