import {
  METAS_LIST_REQUEST,
  METAS_LIST_SUCCESS,
  METAS_PREPARE_NEW_REQUEST,
  METAS_PREPARE_NEW_SUCCESS,
  METAS_PREPARE_EDIT_REQUEST,
  METAS_PREPARE_EDIT_SUCCESS,
  METAS_EDIT_REQUEST,
  METAS_EDIT_SUCCESS,
  METAS_DELETE_REQUEST,
  METAS_DELETE_SUCCESS,
  METAS_NEW_REQUEST,
  METAS_NEW_SUCCESS,
  METAS_ERROR
} from '../actionTypes';

export function metasListRequest(filtros) {
  return {
    type: METAS_LIST_REQUEST,
    filtros
  }
}

export function metasListSuccess(data){
  return {
    type: METAS_LIST_SUCCESS,
    data
  }
}

export function metaDeleteRequest(id, filtros){
  return {
    type: METAS_DELETE_REQUEST,
    id, filtros
  }
}

export function metaDeleteSuccess(data){
  return {
    type: METAS_DELETE_SUCCESS,
    data
  }
}

export function metaPrepareEditRequest(id){
  return {
    type: METAS_PREPARE_EDIT_REQUEST,
    id
  }
}

export function metaPrepareEditSuccess(data){
  return {
    type: METAS_PREPARE_EDIT_SUCCESS,
    data
  }
}

export function metaPrepareNewRequest(){
  return {
    type: METAS_PREPARE_NEW_REQUEST,
  }
}

export function metaPrepareNewSuccess(data){
  return {
    type: METAS_PREPARE_NEW_SUCCESS,
    data
  }
}

export function metaEditRequest(values){
  return {
    type: METAS_EDIT_REQUEST,
    values
  }
}

export function metaEditSuccess(data){
  return {
    type: METAS_EDIT_SUCCESS,
    data
  }
}

export function metaNewRequest(values){
  return {
    type: METAS_NEW_REQUEST,
    values
  }
}

export function metaNewSuccess(data){
  return {
    type: METAS_NEW_SUCCESS,
    data
  }
}

export function metaError(error){
  return {
    type: METAS_ERROR,
    error
  }
}
