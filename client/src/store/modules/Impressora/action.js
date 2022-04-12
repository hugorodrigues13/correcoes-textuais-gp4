import {
  IMPRESSORA_LIST_REQUEST,
  IMPRESSORA_LIST_SUCCESS,
  IMPRESSORA_PREPARAR_EDITAR_REQUEST,
  IMPRESSORA_PREPARAR_EDITAR_SUCCESS,
  IMPRESSORA_PREPARAR_NOVO_REQUEST,
  IMPRESSORA_PREPARAR_NOVO_SUCCESS,
  IMPRESSORA_SALVAR_REQUEST,
  IMPRESSORA_SALVAR_SUCCESS,
  IMPRESSORA_EDITAR_REQUEST,
  IMPRESSORA_EDITAR_SUCCESS,
  IMPRESSORA_DELETE_REQUEST,
  IMPRESSORA_DELETE_SUCCESS,
  IMPRESSORA_ERROR
} from "../actionTypes"

export function listImpressoraRequest(filtros) {
  return {
    type: IMPRESSORA_LIST_REQUEST,
    filtros
  }
}

export function listImpressoraSuccess(data) {
  return {
    type: IMPRESSORA_LIST_SUCCESS,
    data
  }
}

export function prepararEditarRequest(id) {
  return {
    type: IMPRESSORA_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess(data) {
  return {
    type: IMPRESSORA_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: IMPRESSORA_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess(data) {
  return {
    type: IMPRESSORA_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function salvarRequest( entity ) {
  return {
    type: IMPRESSORA_SALVAR_REQUEST,
    entity
  }
}

export function salvarSuccess( data ) {
  return {
    type: IMPRESSORA_SALVAR_SUCCESS,
    data
  }
}

export function editarRequest( entity ) {
  return {
    type: IMPRESSORA_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: IMPRESSORA_EDITAR_SUCCESS,
    data
  }
}

export function deleteRequest(id, filtros) {
  return {
    type: IMPRESSORA_DELETE_REQUEST,
    id, filtros
  }
}

export function deleteSuccess() {
  return {
    type: IMPRESSORA_DELETE_SUCCESS
  }
}

//ERROR
export function error(error) {
  return {
    type: IMPRESSORA_ERROR,
    error
  };
}
