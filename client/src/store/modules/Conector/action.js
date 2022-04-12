//IMPORT ACTION_TYPES
import {
  CONECTOR_LIST_REQUEST,
  CONECTOR_LIST_SUCCESS,
  CONECTOR_SALVAR_REQUEST,
  CONECTOR_SALVAR_SUCCESS,
  CONECTOR_DELETE_REQUEST,
  CONECTOR_DELETE_SUCCESS,
  CONECTOR_EDITAR_REQUEST,
  CONECTOR_EDITAR_SUCCESS,
  CONECTOR_PREPARAR_NOVO_REQUEST,
  CONECTOR_PREPARAR_NOVO_SUCCESS,
  CONECTOR_PREPARAR_EDITAR_REQUEST,
  CONECTOR_PREPARAR_EDITAR_SUCCESS,
  CONECTOR_ERROR,
  CONECTOR_SET_ENTITY,
} from "../actionTypes";

//LISTAGEM
export function listConectorRequest(filtros) {
  return {
    type: CONECTOR_LIST_REQUEST,
    filtros
  };
}

export function listConectorSuccess(data) {
  return {
    type: CONECTOR_LIST_SUCCESS,
    data
  };
}

//SALVAR
export function conectorSalvarRequest(data){
  return {
    type: CONECTOR_SALVAR_REQUEST,
    data
  }
}

export function conectorSalvarSuccess(data){
   return {
     type: CONECTOR_SALVAR_SUCCESS,
     data
   }
 }

//EDITAR
export function conectorEditarRequest(entity){
  return{
  type: CONECTOR_EDITAR_REQUEST,
  entity
  }
}

export function conectorEditarSuccess(retorno){
  return{
    type: CONECTOR_EDITAR_SUCCESS,
    retorno
  }
}

export function conectorPrepararNovoRequest(){
  return{
    type: CONECTOR_PREPARAR_NOVO_REQUEST,
  }
}

export function conectorPrepararNovoSuccess(data){
  return{
  type: CONECTOR_PREPARAR_NOVO_SUCCESS,
  data
  }
}

export function conectorPrepararEditarRequest(id) {
  return {
    type: CONECTOR_PREPARAR_EDITAR_REQUEST,
    id
  };
}

export function conectorPrepararEditarSuccess(data) {
  return {
    type: CONECTOR_PREPARAR_EDITAR_SUCCESS,
    data
  };
}

//DELETAR
export function conectorDeletarRequest(id, filtros){
  return {
    type: CONECTOR_DELETE_REQUEST,
    id,
    filtros
  }
}

export function conectorSetEntity(entity) {
  return {
    type: CONECTOR_SET_ENTITY,
    entity
  }
}

export function conectorDeletarSuccess(){
  return {
    type: CONECTOR_DELETE_SUCCESS
  }
}

export function error(error) {
  return {
    type: CONECTOR_ERROR,
    error
  };
}
