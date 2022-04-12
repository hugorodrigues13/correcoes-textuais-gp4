import {
  ACESSO_LIST_REQUEST,
  ACESSO_LIST_SUCCESS,
  ACESSO_SALVAR_REQUEST,
  ACESSO_SALVAR_SUCCESS,
  ACESSO_EDITAR_REQUEST,
  ACESSO_EDITAR_SUCCESS,
  ACESSO_DELETE_REQUEST,
  ACESSO_DELETE_SUCCESS,
  ACESSO_PREPARAR_EDITAR_REQUEST,
  ACESSO_PREPARAR_EDITAR_SUCCESS,
  ACESSO_PREPARAR_NOVO_REQUEST,
  ACESSO_PREPARAR_NOVO_SUCCESS,
  ACESSO_ERROR,
  ACESSO_FILTRAR_FORNECEDOR
} from "../actionTypes";

export function listAcessoRequest( filtros ) {
  return {
    type: ACESSO_LIST_REQUEST,
    filtros
  }
}

export function listAcessoSuccess( data ) {
  return {
    type: ACESSO_LIST_SUCCESS,
    data
  };
}

export function salvarRequest( entity ) {
  return {
    type: ACESSO_SALVAR_REQUEST,
    entity
  }
}

export function salvarSuccess( data ) {
  return {
    type: ACESSO_SALVAR_SUCCESS,
    data
  }
}

export function editarRequest( entity ) {
  return {
    type: ACESSO_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: ACESSO_EDITAR_SUCCESS,
    data
  }
}

export function prepararEditarRequest( id ) {
  return {
    type: ACESSO_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess( data ) {
  return {
    type: ACESSO_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: ACESSO_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess( data ) {
  return {
    type: ACESSO_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function deleteRequest( id, filtros ) {
  return {
    type: ACESSO_DELETE_REQUEST,
    id, filtros
  }
}

export function filtrarFornecedor( organizationID ) {
  return {
    type: ACESSO_FILTRAR_FORNECEDOR,
    organizationID
  }
}

export function error( error ) {
  return {
    type: ACESSO_ERROR,
    error
  }
}
