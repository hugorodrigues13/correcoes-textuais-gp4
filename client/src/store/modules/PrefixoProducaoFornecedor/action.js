import {
  PREFIXO_PRODUCAO_FORNECEDOR_LIST_REQUEST,
  PREFIXO_PRODUCAO_FORNECEDOR_LIST_SUCCESS,
  PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_REQUEST,
  PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_SUCCESS,
  PREFIXO_PRODUCAO_FORNECEDOR_ERROR,
  PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_REQUEST,
  PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_SUCCESS,
} from "../actionTypes"

export function listPrefixoProducaoFornecedorRequest(filtros) {
  return {
    type: PREFIXO_PRODUCAO_FORNECEDOR_LIST_REQUEST,
    filtros,
  }
}

export function listPrefixoProducaoFornecedorSuccess(data) {
  return {
    type: PREFIXO_PRODUCAO_FORNECEDOR_LIST_SUCCESS,
    data
  }
}

export function updateValorRequest(entity) {
  return {
    type: PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_REQUEST,
    entity
  };
}

export function updateValorSuccess(data) {
  return {
    type: PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_SUCCESS,
    data
  };
}

export function prepararEditarRequest( id ) {
  return {
    type: PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess( data ) {
  return {
    type: PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function error( error ) {
  return {
    type: PREFIXO_PRODUCAO_FORNECEDOR_ERROR,
    error
  }
}
