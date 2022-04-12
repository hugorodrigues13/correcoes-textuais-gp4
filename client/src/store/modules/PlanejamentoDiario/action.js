import {
  PLANEJAMENTO_DIARIO_DELETAR_REQUEST,
  PLANEJAMENTO_DIARIO_DELETAR_SUCCESS,
  PLANEJAMENTO_DIARIO_EDIT_REQUEST,
  PLANEJAMENTO_DIARIO_EDIT_SUCCESS,
  PLANEJAMENTO_DIARIO_ERROR,
  PLANEJAMENTO_DIARIO_EXPORTAR_REQUEST, PLANEJAMENTO_DIARIO_EXPORTAR_SUCCESS,
  PLANEJAMENTO_DIARIO_LISTAR_REQUEST,
  PLANEJAMENTO_DIARIO_LISTAR_SUCCESS,
  PLANEJAMENTO_DIARIO_NOVO_REQUEST,
  PLANEJAMENTO_DIARIO_NOVO_SUCCESS,
  PLANEJAMENTO_DIARIO_PREPARE_EDIT_REQUEST,
  PLANEJAMENTO_DIARIO_PREPARE_EDIT_SUCCESS,
  PLANEJAMENTO_DIARIO_PREPARE_NEW_REQUEST,
  PLANEJAMENTO_DIARIO_PREPARE_NEW_SUCCESS
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function planejamentoDiarioListarRequest(filtros){
  return {
    type: PLANEJAMENTO_DIARIO_LISTAR_REQUEST,
    filtros
  }
}

export function planejamentoDiarioListarSuccess(data){
  return {
    type: PLANEJAMENTO_DIARIO_LISTAR_SUCCESS,
    data
  }
}

export function planejamentoDiarioPrepareEditRequest(id){
  return {
    type: PLANEJAMENTO_DIARIO_PREPARE_EDIT_REQUEST,
    id
  }
}

export function planejamentoDiarioPrepareEditSuccess(data){
  return {
    type: PLANEJAMENTO_DIARIO_PREPARE_EDIT_SUCCESS,
    data
  }
}

export function planejamentoDiarioPrepareNewRequest(){
  return {
    type: PLANEJAMENTO_DIARIO_PREPARE_NEW_REQUEST,
  }
}

export function planejamentoDiarioPrepareNewSuccess(data){
  return {
    type: PLANEJAMENTO_DIARIO_PREPARE_NEW_SUCCESS,
    data
  }
}

export function planejamentoDiarioEditRequest(values){
  return {
    type: PLANEJAMENTO_DIARIO_EDIT_REQUEST,
    values
  }
}

export function planejamentoDiarioEditSuccess(data){
  return {
    type: PLANEJAMENTO_DIARIO_EDIT_SUCCESS,
    data
  }
}

export function planejamentoDiarioNovoRequest(values){
  return {
    type: PLANEJAMENTO_DIARIO_NOVO_REQUEST,
    values
  }
}

export function planejamentoDiarioNovoSuccess(data){
  return {
    type: PLANEJAMENTO_DIARIO_NOVO_SUCCESS,
    data
  }
}

export function planejamentoDiarioDeletarRequest(id, filtros){
  return {
    type: PLANEJAMENTO_DIARIO_DELETAR_REQUEST,
    id, filtros
  }
}

export function planejamentoDiarioDeletarSuccess(data){
  return {
    type: PLANEJAMENTO_DIARIO_DELETAR_SUCCESS,
    data,
  }
}

export function planejamentoDiarioExportarRequest(filtros){
  return {
    type: PLANEJAMENTO_DIARIO_EXPORTAR_REQUEST,
    filtros
  }
}

export function planejamentoDiarioExportarSuccess(data){
  downloadRelatorio(data, "planejamentoDiario.relatorio.nomeArquivo.label")
  return {
    type: PLANEJAMENTO_DIARIO_EXPORTAR_SUCCESS,
    data
  }
}

export function planejamentoDiarioError(error){
  return {
    type: PLANEJAMENTO_DIARIO_ERROR,
    error,
  }
}
