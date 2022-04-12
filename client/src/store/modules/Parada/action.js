import * as ACTION from "../actionTypes";

// LIST
export function listRequest(filtros) {
  return {
    type: ACTION.PARADA_LIST_REQUEST,
    filtros
  };
}

export function listSuccess(data) {
  return {
    type: ACTION.PARADA_LIST_SUCCESS,
    data
  };
}

export function listSelectMotivoParadaRequest (){
  return {
    type: ACTION.PARADA_LIST_MOTIVO_PARADA_REQUEST,
  };
}

export function listSelectMotivoParadaSuccess (data){
  return {
    type: ACTION.PARADA_LIST_MOTIVO_PARADA_SUCCESS,
    data
  };
}

export function dividirParadasRequest (data) {
  return {
    type: ACTION.PARADA_DIVIDIR_REQUEST,
    data
  };
}

export function dividirParadasSuccess () {
  return {
    type: ACTION.PARADA_DIVIDIR_SUCCESS
  };
}

export function updateMotivoRequest (data) {
  return {
    type: ACTION.PARADA_LIST_UPDATE_MOTIVO_REQUEST,
    data
  };
}

export function updateMotivoSuccess () {
  return {
    type: ACTION.PARADA_LIST_UPDATE_MOTIVO_SUCCESS,
  };
}

// ERROR
export function error(error) {
  return {
    type: ACTION.PARADA_ERROR,
    error
  };
}
