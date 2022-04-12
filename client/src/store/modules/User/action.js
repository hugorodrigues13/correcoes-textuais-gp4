import {
  USER_LIST_ALL_REQUEST,
  USER_LIST_ALL_SUCCESS,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_ATIVAR_OU_DESATIVAR_REQUEST,
  USER_SALVAR_REQUEST,
  USER_SALVAR_SUCCESS,
  USER_EDITAR_REQUEST,
  USER_EDITAR_SUCCESS,
  USER_ALTERAR_REQUEST,
  USER_ALTERAR_SUCCESS,
  USER_CURRENT_REQUEST,
  USER_CURRENT_SUCCESS,
  LOGIN_CLEAN,
  USER_ERROR,
  USER_PREPARAR_NOVO_REQUEST,
  USER_PREPARAR_NOVO_SUCCESS,
  USER_PREPARAR_EDITAR_REQUEST,
  USER_PREPARAR_EDITAR_SUCCESS,
  USER_PREPARAR_EDITAR_PERFIL_REQUEST,
  USER_PREPARAR_EDITAR_PERFIL_SUCCESS,
  USER_GRUPO_RECURSO_REQUEST,
  USER_GRUPO_RECURSO_SUCCESS,
  USER_RECURSO_REQUEST,
  USER_RECURSO_SUCCESS,
  USER_SET_USER_DATA,
  USER_SET_COLUNAS_REQUEST,
  USER_SET_COLUNAS_SUCCESS,
  USER_GET_COLUNAS_REQUEST, USER_GET_COLUNAS_SUCCESS
} from "../actionTypes";

// LIST
export function getUserAllRequest(filtros) {
  return {
    type: USER_LIST_ALL_REQUEST,
    filtros
  };
}

export function getUserAllSuccess(data) {
  return {
    type: USER_LIST_ALL_SUCCESS,
    data
  };
}

// DELETE
export function deleteUserRequest(id, filtros) {
  return {
    type: USER_DELETE_REQUEST,
    id,
    filtros
  };
}

export function deleteUSerSuccess() {
  return {
    type: USER_DELETE_SUCCESS
  };
}

// ATIVAR DESATIVAR
export function ativarOuDesativarRequest(objeto, filtros) {
  return {
    type: USER_ATIVAR_OU_DESATIVAR_REQUEST,
    objeto,
    filtros
  };
}

// SALVAR
export function salvarRequest(entity) {
  return {
    type: USER_SALVAR_REQUEST,
    entity
  };
}

export function salvarSuccess() {
  return {
    type: USER_SALVAR_SUCCESS
  };
}

export function prepararNovoUserRequest() {
  return {
    type: USER_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoUserSuccess( data ) {
  return {
    type: USER_PREPARAR_NOVO_SUCCESS,
    data
  }
}

//EDITAR
export function editarRequest( entity ){
  return {
    type: USER_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: USER_EDITAR_SUCCESS,
    data
  }
}

// SALVAR ALTERACAO USUARIO
export function alterarDadosUsuarioRequest(entity) {
  return {
    type: USER_ALTERAR_REQUEST,
    entity
  };
}

export function alterarDadosUsuarioSuccess() {
  return {
    type: USER_ALTERAR_SUCCESS
  };
}

export function prepararEditarUserRequest( id ) {

  return{
    type: USER_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarUserSuccess( data ) {
  return{
    type: USER_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararEditarPerfilRequest() {
  return {
    type: USER_PREPARAR_EDITAR_PERFIL_REQUEST
  }
}

export function prepararEditarPerfilSuccess( data ) {
  return {
    type: USER_PREPARAR_EDITAR_PERFIL_SUCCESS,
    data
  }
}
//CURRENT
export function currentRequest() {
  return {
    type: USER_CURRENT_REQUEST
  };
}

export function currentSuccess(data) {
  return {
    type: USER_CURRENT_SUCCESS,
    data
  };
}

export function limparLogin() {
  return {
    type: LOGIN_CLEAN
  };
}

export function grupoRecursoRequest() {
  return {
    type: USER_GRUPO_RECURSO_REQUEST
  }
}

export function grupoRecursoSuccess( data ) {
  return {
    type: USER_GRUPO_RECURSO_SUCCESS,
    data
  };
}

export function getRecursoPeloId(id) {
  return {
    type: USER_RECURSO_REQUEST,
    id
  }
}

export function getRecursoPeloIdSuccess(data) {
  return {
    type: USER_RECURSO_SUCCESS,
    data
  }
}

export function setUserData( data ) {
  return {
    type: USER_SET_USER_DATA,
    data
  }
}

export function setUsuarioColunasRequest(tipo, colunas){
  return {
    type: USER_SET_COLUNAS_REQUEST,
    tipo,
    colunas
  }
}

export function setUsuarioColunasSuccess(data){
  return {
    type: USER_SET_COLUNAS_SUCCESS,
    data
  }
}

export function getUsuarioColunasRequest(tipo){
  return {
    type: USER_GET_COLUNAS_REQUEST,
    tipo,
  }
}

export function getUsuarioColunasSuccess(data){
  return {
    type: USER_GET_COLUNAS_SUCCESS,
    data
  }
}

export function error(error) {
  return {
    type: USER_ERROR,
    error
  };
}
