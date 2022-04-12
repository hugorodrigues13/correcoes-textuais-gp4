import {
  ORGANIZACAO_LIST_REQUEST,
  ORGANIZACAO_LIST_SUCCESS,
  ORGANIZACAO_SET,
  ORGANIZACAO_SET_SUCESS,
  ORGANIZACAO_ERROR, ORGANIZACAO_SET_FORNECEDOR_REQUEST, ORGANIZACAO_SET_FORNECEDOR_SUCCESS
} from "../actionTypes";

// LIST
export function listRequest() {
  return {
    type: ORGANIZACAO_LIST_REQUEST
  };
}

export function listSuccess(data) {
  return {
    type: ORGANIZACAO_LIST_SUCCESS,
    data
  };
}

// SET
export function setOrganizacao(organizacao, isLogin) {
  return {
    type: ORGANIZACAO_SET,
    organizacao,
    isLogin
  };
}

export function setOrganizacaoSuccess(organizacao, isLogin, fornecedores) {
  return {
    type: ORGANIZACAO_SET_SUCESS,
    organizacao,
    isLogin,
    fornecedores
  };
}

// SET
export function setFornecedor(fornecedor, isLogin) {
  return {
    type: ORGANIZACAO_SET_FORNECEDOR_REQUEST,
    fornecedor,
    isLogin
  };
}

export function setFornecedorSuccess(fornecedor, isLogin) {
  return {
    type: ORGANIZACAO_SET_FORNECEDOR_SUCCESS,
    fornecedor,
    isLogin
  };
}

// ERROR
export function error(error) {
  return {
    type: ORGANIZACAO_ERROR,
    error
  };
}
