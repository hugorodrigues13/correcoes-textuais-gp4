import {
  RECURSO_LIST_REQUEST,
  RECURSO_LIST_SUCCESS,
  RECURSO_PREPARAR_EDITAR_REQUEST,
  RECURSO_PREPARAR_EDITAR_SUCCESS,
  RECURSO_PREPARAR_NOVO_REQUEST,
  RECURSO_PREPARAR_NOVO_SUCCESS,
  RECURSO_SALVAR_REQUEST,
  RECURSO_SALVAR_SUCCESS,
  RECURSO_EDITAR_REQUEST,
  RECURSO_EDITAR_SUCCESS,
  RECURSO_DELETE_REQUEST,
  RECURSO_DELETE_SUCCESS,
  RECURSO_ERROR,
  RECURSO_ATIVAR_OU_DESATIVAR_REQUEST,
  RECURSO_PREPARAR_CLONAR_REQUEST,
  RECURSO_PREPARAR_CLONAR_SUCCESS,
  RECURSO_CLONAR_REQUEST, RECURSO_CLONAR_SUCCESS
} from "../actionTypes"

export function listRecursoRequest(filtros) {
  return {
    type: RECURSO_LIST_REQUEST,
    filtros
  }
}

export function listRecursoSuccess(data) {
  return {
    type: RECURSO_LIST_SUCCESS,
    data
  }
}

export function prepararEditarRequest(id) {
  return {
    type: RECURSO_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess(data) {
  return {
    type: RECURSO_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: RECURSO_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess(data) {
  return {
    type: RECURSO_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function salvarRequest( entity ) {
  return {
    type: RECURSO_SALVAR_REQUEST,
    entity
  }
}

export function salvarSuccess( data ) {
  return {
    type: RECURSO_SALVAR_SUCCESS,
    data
  }
}

export function editarRequest( entity ) {
  return {
    type: RECURSO_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: RECURSO_EDITAR_SUCCESS,
    data
  }
}

export function deleteRequest(id, filtros) {
  return {
    type: RECURSO_DELETE_REQUEST,
    id, filtros
  }
}

export function deleteSuccess() {
  return {
    type: RECURSO_DELETE_SUCCESS
  }
}

export function ativarOuDesativarRequest(objeto, filtros) {
  return {
    type: RECURSO_ATIVAR_OU_DESATIVAR_REQUEST,
    objeto,
    filtros
  };
}

export function prepararClonarRequest(id) {
  return {
    type: RECURSO_PREPARAR_CLONAR_REQUEST,
    id
  }
}

export function prepararClonarSuccess(data) {
  return {
    type: RECURSO_PREPARAR_CLONAR_SUCCESS,
    data
  }
}

export function clonarRequest(entity) {
  return {
    type: RECURSO_CLONAR_REQUEST,
    entity
  }
}

export function clonarSuccess(data) {
  return {
    type: RECURSO_CLONAR_SUCCESS,
    data
  }
}

// ERROR
export function error(error) {
  return {
    type: RECURSO_ERROR,
    error
  };
}
