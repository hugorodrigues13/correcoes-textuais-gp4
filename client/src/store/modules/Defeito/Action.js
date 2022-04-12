import {
  DEFEITO_LIST_REQUEST,
  DEFEITO_LIST_SUCCESS,
  DEFEITO_PREPARAR_EDITAR_REQUEST,
  DEFEITO_PREPARAR_EDITAR_SUCCESS,
  DEFEITO_PREPARAR_NOVO_REQUEST,
  DEFEITO_PREPARAR_NOVO_SUCCESS,
  DEFEITO_SALVAR_REQUEST,
  DEFEITO_SALVAR_SUCCESS,
  DEFEITO_EDITAR_REQUEST,
  DEFEITO_EDITAR_SUCCESS,
  DEFEITO_DELETE_REQUEST,
  DEFEITO_ERROR,
  DEFEITO_ATIVAR_OU_DESATIVAR_REQUEST,
} from "../actionTypes"

export function listDefeitoRequest( filtros ) {
  return {
    type: DEFEITO_LIST_REQUEST,
    filtros
  }
}

export function listDefeitoSuccess( data ) {
  return {
    type: DEFEITO_LIST_SUCCESS,
    data
  }
}

export function prepararEditarRequest( id ) {
  return {
    type: DEFEITO_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess( data ) {
  return {
    type: DEFEITO_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: DEFEITO_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess( data ) {
  return {
    type: DEFEITO_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function salvarRequest( entity ) {
  return {
    type: DEFEITO_SALVAR_REQUEST,
    entity
  }
}

export function salvarSuccess( data ) {
  return {
    type: DEFEITO_SALVAR_SUCCESS,
    data
  }
}

export function editarRequest( entity ) {
  return {
    type: DEFEITO_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: DEFEITO_EDITAR_SUCCESS,
    data
  }
}

export function deleteRequest( id, filtros ) {
  return {
    type: DEFEITO_DELETE_REQUEST,
    id, filtros
  }
}

export function ativarOuDesativarRequest(objeto, filtros) {
  return {
    type: DEFEITO_ATIVAR_OU_DESATIVAR_REQUEST,
    objeto,
    filtros
  };
}

export function error( error ) {
  return {
    type: DEFEITO_ERROR,
    error
  }
}
