//IMPORT ACTION_TYPES
import {
  APONTAMENTO_GERAR_ETIQUETA_REQUEST,
  APONTAMENTO_GERAR_ETIQUETA_SUCCESS,
  APONTAMENTO_SALVAR_REQUEST,
  APONTAMENTO_SALVAR_SUCCESS,
  APONTAMENTO_VALIDAR_SERIAL_REQUEST,
  APONTAMENTO_VALIDAR_SERIAL_SUCCESS,
  FECHAR_MODAL,
  GET_DADOSAPONTAMENTOPORRECURSO_REQUEST,
  GET_DADOSAPONTAMENTOPORRECURSO_SUCCESS,
  GET_RECURSOS_REQUEST,
  GET_RECURSOS_SUCCESS,
  APONTAMENTO_ERROR,
  VERIFICAR_USUARIO_REQUEST,
  VERIFICAR_USUARIO_SUCCESS,
  LIMPAR_TABELA,
  APONTAMENTO_VERIFICAR_PARADA_REQUEST,
  APONTAMENTO_VERIFICAR_PARADA_SUCCESS,
  APONTAMENTO_SET_MOTIVO_REQUEST,
  APONTAMENTO_SET_MOTIVO_SUCCESS,
  APONTAMENTO_PARAR_RECURSO_REQUEST,
  APONTAMENTO_PARAR_RECURSO_SUCCESS, APONTAMENTO_VALIDAR_OF_REQUEST, APONTAMENTO_VALIDAR_OF_SUCCESS
} from "../actionTypes";

//SERIAL
export function apontamentoValidarSerialRequest(serial, recurso, seriais, impressoraId) {
  return {
    type: APONTAMENTO_VALIDAR_SERIAL_REQUEST,
    serial,
    recurso,
    seriais,
    impressoraId,
  }
}

export function apontamentoValidarSerialSuccess(data, seriais) {
  return {
    type: APONTAMENTO_VALIDAR_SERIAL_SUCCESS,
    data,
    seriais
  }
}

//APONTAR OP
export function apontamentoValidarOFRequest(of, recurso, seriais, impressoraId) {
  return {
    type: APONTAMENTO_VALIDAR_OF_REQUEST,
    of,
    recurso,
    seriais,
    impressoraId,
  }
}

export function apontamentoValidarOFSuccess(data, seriais) {
  return {
    type: APONTAMENTO_VALIDAR_OF_SUCCESS,
    data,
    seriais
  }
}

//MOSTRAR MODAL
export function fecharModal(){
  return {
    type: FECHAR_MODAL,
  }
}

//GET RECURSOS
export function getRecursosRequest(){
  return {
    type: GET_RECURSOS_REQUEST,
  }
}
export function getRecursosSuccess( data ){
  return {
    type: GET_RECURSOS_SUCCESS,
    data
  }
}

//GET DEFEITOS
export function getDadosApontamentoPorRecursoRequest(recursoId){
  return {
    type: GET_DADOSAPONTAMENTOPORRECURSO_REQUEST,
    recursoId
  }
}
export function getDadosApontamentoPorRecursoSuccess( data ){
  return {
    type: GET_DADOSAPONTAMENTOPORRECURSO_SUCCESS,
    data
  }
}

//SALVAR
export function apontamentoSalvarRequest( data ){
  return {
    type: APONTAMENTO_SALVAR_REQUEST,
    data
  }
}

export function apontamentoSalvarSuccess(data){
   return {
     type: APONTAMENTO_SALVAR_SUCCESS,
     data
   }
 }

//VERIFICAR USUÁRIO
export function verificarUsuarioRequest( data ){
  return {
    type: VERIFICAR_USUARIO_REQUEST,
    data
  }
}

export function verificarUsuarioSuccess(data){
  return {
    type: VERIFICAR_USUARIO_SUCCESS,
    data
  }
}


export function apontamentoGerarEtiquetaRequest( data ){
  return {
    type: APONTAMENTO_GERAR_ETIQUETA_REQUEST,
    data
  }
}

export function apontamentoGerarEtiquetaSuccess( data ){
  return {
    type: APONTAMENTO_GERAR_ETIQUETA_SUCCESS,
    data
  }
}

export function verificarParadaRequest( recursoId ){
  return {
    type: APONTAMENTO_VERIFICAR_PARADA_REQUEST,
    recursoId
  }
}

export function verificarParadaSuccess( data ){
  return {
    type: APONTAMENTO_VERIFICAR_PARADA_SUCCESS,
    data
  }
}

export function setMotivoParadaRequest( paradaId, motivoId ){
  return {
    type: APONTAMENTO_SET_MOTIVO_REQUEST,
    paradaId, motivoId
  }
}

export function setMotivoParadaSuccess( data ){
  return {
    type: APONTAMENTO_SET_MOTIVO_SUCCESS,
    data
  }
}

export function pararRecursoRequest( recursoId, acaoDoUsuario ){
  return {
    type: APONTAMENTO_PARAR_RECURSO_REQUEST,
    recursoId,
    acaoDoUsuario
  }
}


export function pararRecursoSuccess( data ){
  return {
    type: APONTAMENTO_PARAR_RECURSO_SUCCESS,
    data
  }
}

export function limparSeriais() {
  return {
    type: LIMPAR_TABELA
  }
}

//ERROR
export function error(error) {
  return {
    type: APONTAMENTO_ERROR,
    error
  };
}
