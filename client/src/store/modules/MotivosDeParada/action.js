import {
  DEFEITO_ATIVAR_OU_DESATIVAR_REQUEST, MOTIVO_DE_PARADA_ATIVAR_OU_DESATIVAR_REQUEST,
  MOTIVO_DE_PARADA_DELETE_REQUEST, MOTIVO_DE_PARADA_DELETE_SUCCESS,
  MOTIVO_DE_PARADA_EDIT_REQUEST, MOTIVO_DE_PARADA_EDIT_SUCCESS,
  MOTIVO_DE_PARADA_ERROR,
  MOTIVO_DE_PARADA_LIST_REQUEST,
  MOTIVO_DE_PARADA_LIST_SUCCESS, MOTIVO_DE_PARADA_NEW_REQUEST, MOTIVO_DE_PARADA_NEW_SUCCESS,
  MOTIVO_DE_PARADA_PREPARE_EDIT_REQUEST,
  MOTIVO_DE_PARADA_PREPARE_EDIT_SUCCESS,
  MOTIVO_DE_PARADA_PREPARE_NEW_REQUEST,
  MOTIVO_DE_PARADA_PREPARE_NEW_SUCCESS
} from "../actionTypes";

export function motivoParadaListRequest(filtros){
  return {
    type: MOTIVO_DE_PARADA_LIST_REQUEST,
    filtros
  }
}

export function motivoParadaListSuccess(data){
  return {
    type: MOTIVO_DE_PARADA_LIST_SUCCESS,
    data
  }
}

export function motivoParadaDeleteRequest(id, filtros){
  return {
    type: MOTIVO_DE_PARADA_DELETE_REQUEST,
    id, filtros
  }
}

export function motivoParadaDeleteSuccess(data){
  return {
    type: MOTIVO_DE_PARADA_DELETE_SUCCESS,
    data
  }
}

export function motivoParadaPrepareEditRequest(id){
  return {
    type: MOTIVO_DE_PARADA_PREPARE_EDIT_REQUEST,
    id
  }
}

export function motivoParadaPrepareEditSuccess(data){
  return {
    type: MOTIVO_DE_PARADA_PREPARE_EDIT_SUCCESS,
    data
  }
}

export function motivoParadaPrepareNewRequest(){
  return {
    type: MOTIVO_DE_PARADA_PREPARE_NEW_REQUEST,
  }
}

export function motivoParadaPrepareNewSuccess(data){
  return {
    type: MOTIVO_DE_PARADA_PREPARE_NEW_SUCCESS,
    data
  }
}

export function motivoParadaEditRequest(values){
  return {
    type: MOTIVO_DE_PARADA_EDIT_REQUEST,
    values
  }
}

export function motivoParadaEditSuccess(data){
  return {
    type: MOTIVO_DE_PARADA_EDIT_SUCCESS,
    data
  }
}

export function motivoParadaNewRequest(values){
  return {
    type: MOTIVO_DE_PARADA_NEW_REQUEST,
    values
  }
}

export function motivoParadaNewSuccess(data){
  return {
    type: MOTIVO_DE_PARADA_NEW_SUCCESS,
    data
  }
}

export function ativarOuDesativarRequest(objeto, filtros) {
  return {
    type: MOTIVO_DE_PARADA_ATIVAR_OU_DESATIVAR_REQUEST,
    objeto,
    filtros
  };
}

export function motivoParadaError(error){
  return {
    type: MOTIVO_DE_PARADA_ERROR,
    error
  }
}
