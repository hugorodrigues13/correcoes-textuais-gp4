import {
  CHANGE_SESSION_STATE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_CLEAN,
  LOGIN_PERMISSAO_REQUEST,
  LOGIN_PERMISSAO_SUCCESS,
  LOGOUT, LOGIN_SET_LANGUAGE
} from "../actionTypes";

export function loginRequest(user) {
  return {
    type: LOGIN_REQUEST,
    user
  };
}

export function loginSucess(user) {
  return {
    type: LOGIN_SUCCESS,
    user
  };
}

export function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error
  };
}

export function setSessaoSate(sessao) {
  return {
    type: CHANGE_SESSION_STATE,
    sessao
  };
}

export function getPermissaoRequest() {
  return {
    type: LOGIN_PERMISSAO_REQUEST
  };
}

export function getPermissaoSuccess(permissoes) {
  return {
    type: LOGIN_PERMISSAO_SUCCESS,
    permissoes
  };
}

export function exibeModalLogin(rota) {
  return {
    type: CHANGE_SESSION_STATE,
    sessao: {
      isExpirada: true,
      isUsuarioLogado: true,
      rotaAtual: rota,
      isExibirModalLogin: true
    }
  };
}

export function changeIdioma(language) {
  return {
    type: LOGIN_SET_LANGUAGE,
    language
  };
}

export function loginClean() {
  return {
    type: LOGIN_CLEAN
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}
