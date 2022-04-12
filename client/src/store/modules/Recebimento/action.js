import {
  RECEBIMENTO_CONCLUIR_MANUALMENTE_REQUEST, RECEBIMENTO_CONCLUIR_MANUALMENTE_SUCCESS,
  RECEBIMENTO_ERROR,
  RECEBIMENTO_LIST_REQUEST,
  RECEBIMENTO_LIST_SUCCESS
} from "../actionTypes";

export function recebimentoListRequest(filtros){
  return {
    type: RECEBIMENTO_LIST_REQUEST,
    filtros
  }
}

export function recebimentoConcluirManualmenteRequest({id, filtros}){
  return {
    type: RECEBIMENTO_CONCLUIR_MANUALMENTE_REQUEST,
    action: { id, filtros }
  }
}

export function recebimentoConcluirManualmenteSuccess(){
  return {
    type: RECEBIMENTO_CONCLUIR_MANUALMENTE_SUCCESS,
  }
}

export function recebimentoListSuccess(data){
  return {
    type: RECEBIMENTO_LIST_SUCCESS,
    data
  }
}

export function recebimentoError(error){
  return {
    type: RECEBIMENTO_ERROR,
    error
  }
}
