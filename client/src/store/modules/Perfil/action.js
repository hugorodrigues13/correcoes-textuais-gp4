import {
  PERFIL_LIST_REQUEST,
  PERFIL_LIST_SUCCESS,
  PERFIL_SALVAR_REQUEST,
  PERFIL_SALVAR_SUCCESS,
  PERFIL_DELETE_REQUEST,
  PERFIL_DELETE_SUCCESS,
  PERFIL_EDITAR_REQUEST,
  PERFIL_EDITAR_SUCCESS,
  PERFIL_ERROR,
  PERFIL_PREPARAR_EDITAR_REQUEST, PERFIL_PREPARAR_EDITAR_SUCCESS,
  PERFIL_PREPARAR_NOVO_REQUEST, PERFIL_PREPARAR_NOVO_SUCCESS
} from "../actionTypes";

export function listPerfilRequest(filtros) {
  return {
    type: PERFIL_LIST_REQUEST,
    filtros
  };
}

export function listPerfilSuccess(data) {
  return {
    type: PERFIL_LIST_SUCCESS,
    data
  };
}

export function perfilSalvarRequest(entity) {
  return {
    type: PERFIL_SALVAR_REQUEST,
    entity
  };
}

export function perfilSalvarSucess(data) {
  return {
    type: PERFIL_SALVAR_SUCCESS,
    data
  };
}

export function perfilEditarRequest(entity) {
  return {
    type: PERFIL_EDITAR_REQUEST,
    entity
  };
}

export function perfilEditarSucess(data) {
  return {
    type: PERFIL_EDITAR_SUCCESS,
    data
  };
}

export function prepararEditarRequest(id) {
  return {
    type: PERFIL_PREPARAR_EDITAR_REQUEST,
    id
  };
}

export function prepararEditarSuccess(data) {
  return {
    type: PERFIL_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: PERFIL_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess(data) {
  return {
    type: PERFIL_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function deleteRequest(id, filtros) {
  return {
    type: PERFIL_DELETE_REQUEST,
    id,
    filtros
  };
}

export function deleteSuccess() {
  return {
    type: PERFIL_DELETE_SUCCESS
  };
}

export function error(error) {
  return {
    type: PERFIL_ERROR,
    error
  };
}
