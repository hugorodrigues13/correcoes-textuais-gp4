import {
  APOIO_BUSCAR_LINHA_REQUEST,
  APOIO_BUSCAR_LINHA_SUCCESS,
  APOIO_BUSCAR_SERIAL_REQUEST,
  APOIO_BUSCAR_SERIAL_SUCCESS,
  APOIO_REDIRECIONAR_SERIAL_REQUEST,
  APOIO_DESCARTAR_SERIAL_REQUEST,
  APOIO_BUSCAR_GRUPOS_LINHAS_REQUEST,
  APOIO_BUSCAR_GRUPOS_LINHAS_SUCCESS,
  APOIO_BUSCAR_GRUPO_LINHAS_REQUEST, APOIO_BUSCAR_GRUPO_LINHAS_SUCCESS,
} from "../actionTypes"

export function buscarGruposLinhasDeProducaoRequest(){
  return {
    type: APOIO_BUSCAR_GRUPOS_LINHAS_REQUEST
  }
}

export function buscarGruposLinhasDeProducaoSuccess(data){
  return {
    type: APOIO_BUSCAR_GRUPOS_LINHAS_SUCCESS,
    data
  }
}

export function buscarGrupoLinhasDeProducaoRequest(id){
  return {
    type: APOIO_BUSCAR_GRUPO_LINHAS_REQUEST,
    id
  }
}

export function buscarGrupoLinhasDeProducaoSuccess(data){
  return {
    type: APOIO_BUSCAR_GRUPO_LINHAS_SUCCESS,
    data
  }
}

export function buscarSerialSelecionadoRequest(id){
  return {
    type: APOIO_BUSCAR_SERIAL_REQUEST,
    id
  }
}

export function buscarSerialSelecionadoSuccess(data){
  return {
    type: APOIO_BUSCAR_SERIAL_SUCCESS,
    data
  }
}


export function redirecionarSerialRequest(entity, grupoSelecionado){
  return {
    type: APOIO_REDIRECIONAR_SERIAL_REQUEST,
    entity, grupoSelecionado
  }
}


export function descartarSerialRequest(id, grupoSelecionado){
  return {
    type: APOIO_DESCARTAR_SERIAL_REQUEST,
    id, grupoSelecionado
  }
}
