import {
  TRANSFORMACAO_LOTE_AGRUPAR_REQUEST,
  TRANSFORMACAO_LOTE_AGRUPAR_SUCCESS,
  TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_REQUEST,
  TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_SUCCESS,
  TRANSFORMACAO_LOTE_DIVIDIR_REQUEST,
  TRANSFORMACAO_LOTE_DIVIDIR_SUCCESS,
  TRANSFORMACAO_LOTE_ERROR,
  TRANSFORMACAO_LOTE_PESQUISAR_LOTES_REQUEST, TRANSFORMACAO_LOTE_PESQUISAR_LOTES_SUCCESS, TRANSFORMACAO_LOTE_RESETAR
} from "../actionTypes";

export function transformacaoLoteBuscarCaixasRequest(lote){
  return {
    type: TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_REQUEST,
    lote,
  }
}


export function transformacaoLoteBuscarCaixasSuccess(data){
  return {
    type: TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_SUCCESS,
    data,
  }
}

export function transformacaoLoteDividirLoteRequest(lote, novoLoteCaixas){
  return {
    type: TRANSFORMACAO_LOTE_DIVIDIR_REQUEST,
    lote, novoLoteCaixas,
  }
}

export function transformacaoLoteDividirLoteSuccess(data){
  return {
    type: TRANSFORMACAO_LOTE_DIVIDIR_SUCCESS,
    data,
  }
}

export function transformacaoLoteAgruparRequest(lote1, lote2, manterLote1){
  return {
    type: TRANSFORMACAO_LOTE_AGRUPAR_REQUEST,
    lote1, lote2, manterLote1,
  }
}

export function transformacaoLoteAgruparSuccess(data){
  return {
    type: TRANSFORMACAO_LOTE_AGRUPAR_SUCCESS,
    data,
  }
}

export function transformacaoLotePesquisarLotesRequest(lote1, lote2){
  return {
    type: TRANSFORMACAO_LOTE_PESQUISAR_LOTES_REQUEST,
    lote1,lote2,
  }
}

export function transformacaoLotePesquisarLotesSuccess(data){
  return {
    type: TRANSFORMACAO_LOTE_PESQUISAR_LOTES_SUCCESS,
    data,
  }
}

export function transformacaoLoteResetar(){
  return {
    type: TRANSFORMACAO_LOTE_RESETAR,
  }
}

export function transformacaoLoteError(error){
  return {
    type: TRANSFORMACAO_LOTE_ERROR,
    error,
  }
}
