import {
  GRUPO_RECURSO_LIST_REQUEST,
  GRUPO_RECURSO_LIST_SUCCESS,
  GRUPO_RECURSO_SALVAR_REQUEST,
  GRUPO_RECURSO_SALVAR_SUCCESS,
  GRUPO_RECURSO_EDITAR_REQUEST,
  GRUPO_RECURSO_EDITAR_SUCCESS,
  GRUPO_RECURSO_DELETAR_REQUEST,
  GRUPO_RECURSO_DELETAR_SUCCESS,
  GRUPO_RECURSO_PREPARAR_NOVO_REQUEST,
  GRUPO_RECURSO_PREPARAR_NOVO_SUCCESS,
  GRUPO_RECURSO_PREPARAR_EDITAR_REQUEST,
  GRUPO_RECURSO_PREPARAR_EDITAR_SUCCESS,
  GRUPO_RECURSO_ERROR,
  GRUPO_RECURSO_ATIVAR_OU_DESATIVAR_REQUEST
} from "../actionTypes";

export function grupoRecursoListRequest(filtros) {
  return {
    type: GRUPO_RECURSO_LIST_REQUEST,
    filtros
  };
}

export function grupoRecursoListSuccess(data) {
  return {
    type: GRUPO_RECURSO_LIST_SUCCESS,
    data
  };
}

export function grupoRecursoSalvarRequest(entity) {
  return {
    type: GRUPO_RECURSO_SALVAR_REQUEST,
    entity
  };
}

export function grupoRecursoSalvarSuccess(data) {
  return {
    type: GRUPO_RECURSO_SALVAR_SUCCESS,
    data
  };
}

export function grupoRecursoEditarRequest(entity) {
  return {
    type: GRUPO_RECURSO_EDITAR_REQUEST,
    entity
  };
}

export function grupoRecursoEditarSuccess(data) {
  return {
    type: GRUPO_RECURSO_EDITAR_SUCCESS,
    data
  };
}

export function grupoRecursoDeletarRequest(id, filtros) {
  return {
    type: GRUPO_RECURSO_DELETAR_REQUEST,
    id,
    filtros
  };
}

export function grupoRecursoDeletarSuccess() {
  return {
    type: GRUPO_RECURSO_DELETAR_SUCCESS,
  };
}

export function grupoRecursoPrepararNovoRequest() {
  return {
    type: GRUPO_RECURSO_PREPARAR_NOVO_REQUEST
  };
}

export function grupoRecursoPrepararNovoSuccess(data) {
  return {
    type: GRUPO_RECURSO_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function grupoRecursoPrepararEditarRequest(id) {
  return {
    type: GRUPO_RECURSO_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function grupoRecursoPrepararEditarSuccess(data) {
  return {
    type: GRUPO_RECURSO_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function ativarOuDesativarRequest(objeto, filtros) {
  return {
    type: GRUPO_RECURSO_ATIVAR_OU_DESATIVAR_REQUEST,
    objeto,
    filtros
  };
}


//ERROR
export function error(error) {
  return {
    type: GRUPO_RECURSO_ERROR,
    error
  };
}
