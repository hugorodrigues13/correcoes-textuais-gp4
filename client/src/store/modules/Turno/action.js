import {
  TURNOS_DELETAR_REQUEST, TURNOS_DELETAR_SUCCESS,
  TURNOS_EDIT_REQUEST, TURNOS_EDIT_SUCCESS, TURNOS_ERROR,
  TURNOS_LISTAR_REQUEST,
  TURNOS_LISTAR_SUCCESS, TURNOS_NOVO_REQUEST, TURNOS_NOVO_SUCCESS,
  TURNOS_PREPARE_EDIT_REQUEST,
  TURNOS_PREPARE_EDIT_SUCCESS, TURNOS_PREPARE_NEW_REQUEST, TURNOS_PREPARE_NEW_SUCCESS
} from "../actionTypes";

export function turnosListarRequest(filtros){
  return {
    type: TURNOS_LISTAR_REQUEST,
    filtros
  }
}

export function turnosListarSuccess(data){
  return {
    type: TURNOS_LISTAR_SUCCESS,
    data
  }
}

export function turnosPrepareEditRequest(id){
  return {
    type: TURNOS_PREPARE_EDIT_REQUEST,
    id
  }
}

export function turnosPrepareEditSuccess(data){
  return {
    type: TURNOS_PREPARE_EDIT_SUCCESS,
    data
  }
}

export function turnosPrepareNewRequest(){
  return {
    type: TURNOS_PREPARE_NEW_REQUEST,
  }
}

export function turnosPrepareNewSuccess(data){
  return {
    type: TURNOS_PREPARE_NEW_SUCCESS,
    data
  }
}

export function turnosEditRequest(values){
  return {
    type: TURNOS_EDIT_REQUEST,
    values
  }
}

export function turnosEditSuccess(data){
  return {
    type: TURNOS_EDIT_SUCCESS,
    data
  }
}

export function turnosNovoRequest(values){
  return {
    type: TURNOS_NOVO_REQUEST,
    values
  }
}

export function turnosNovoSuccess(data){
  return {
    type: TURNOS_NOVO_SUCCESS,
    data
  }
}

export function turnosDeletarRequest(id, filtros){
  return {
    type: TURNOS_DELETAR_REQUEST,
    id, filtros
  }
}

export function turnosDeletarSuccess(data){
  return {
    type: TURNOS_DELETAR_SUCCESS,
    data,
  }
}

export function turnosError(error){
  return {
    type: TURNOS_ERROR,
    error,
  }
}
