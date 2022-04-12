import {
  CLASSE_POR_PLANEJADOR_LIST_REQUEST,
  CLASSE_POR_PLANEJADOR_LIST_SUCCESS,
  CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_REQUEST,
  CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_SUCCESS,
  CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_REQUEST,
  CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_SUCCESS,
  CLASSE_POR_PLANEJADOR_SALVAR_REQUEST,
  CLASSE_POR_PLANEJADOR_SALVAR_SUCCESS,
  CLASSE_POR_PLANEJADOR_EDITAR_REQUEST,
  CLASSE_POR_PLANEJADOR_EDITAR_SUCCESS,
  CLASSE_POR_PLANEJADOR_DELETE_REQUEST,
  CLASSE_POR_PLANEJADOR_DELETE_SUCCESS, CLASSE_POR_PLANEJADOR_ERROR
} from "../actionTypes"

export function listClassePorPlanejadorRequest(filtros) {
  return {
    type: CLASSE_POR_PLANEJADOR_LIST_REQUEST,
    filtros
  }
}

export function listClassePorPlanejadorSuccess(data) {
  return {
    type: CLASSE_POR_PLANEJADOR_LIST_SUCCESS,
    data
  }
}

export function prepararEditarRequest(id) {
  return {
    type: CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess(data) {
  return {
    type: CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess(data) {
  return {
    type: CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function salvarRequest( entity ) {
  return {
    type: CLASSE_POR_PLANEJADOR_SALVAR_REQUEST,
    entity
  }
}

export function salvarSuccess( data ) {
  return {
    type: CLASSE_POR_PLANEJADOR_SALVAR_SUCCESS,
    data
  }
}

export function editarRequest( entity ) {
  return {
    type: CLASSE_POR_PLANEJADOR_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: CLASSE_POR_PLANEJADOR_EDITAR_SUCCESS,
    data
  }
}

export function deleteRequest(id, filtros) {
  return {
    type: CLASSE_POR_PLANEJADOR_DELETE_REQUEST,
    id, filtros
  }
}

export function deleteSuccess() {
  return {
    type: CLASSE_POR_PLANEJADOR_DELETE_SUCCESS
  }
}

export function error(error) {
  return {
    type: CLASSE_POR_PLANEJADOR_ERROR,
    error
  };
}
