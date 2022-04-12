import {
  LINHA_DE_PRODUCAO_SALVAR_REQUEST,
  LINHA_DE_PRODUCAO_SALVAR_SUCCESS,
  LINHA_DE_PRODUCAO_LIST_REQUEST,
  LINHA_DE_PRODUCAO_LIST_SUCCESS,
  LINHA_DE_PRODUCAO_DELETE_REQUEST,
  LINHA_DE_PRODUCAO_DELETE_SUCCESS,
  LINHA_DE_PRODUCAO_EDITAR_REQUEST,
  LINHA_DE_PRODUCAO_EDITAR_SUCCESS,
  LINHA_DE_PRODUCAO_PREPARAR_NOVO_REQUEST,
  LINHA_DE_PRODUCAO_PREPARAR_NOVO_SUCCESS,
  LINHA_DE_PRODUCAO_PREPARAR_EDITAR_REQUEST,
  LINHA_DE_PRODUCAO_PREPARAR_EDITAR_SUCCESS,
  LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_REQUEST,
  LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_SUCCESS,
  LINHA_DE_PRODUCAO_ERROR,
  LINHA_DE_PRODUCAO_RESTAURAR_SUCCESS,
  LINHA_DE_PRODUCAO_RESTAURAR_REQUEST,
  LINHA_DE_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
  LINHA_DE_PRODUCAO_ATIVAR_OU_DESATIVAR_SUCCESS,
} from "../actionTypes";

export function linhaProducaoListarRequest(filtros){
  return {
    type: LINHA_DE_PRODUCAO_LIST_REQUEST,
    filtros
  }
}

export function linhaProducaoListarSuccess(data){
  return{
    type: LINHA_DE_PRODUCAO_LIST_SUCCESS,
    data
  }
}

export function linhaProducaoSalvarRequest(entity, diagrama){
  return {
    type: LINHA_DE_PRODUCAO_SALVAR_REQUEST,
    entity,
    diagrama,
  }
}

export function linhaProducaoSalvarSuccess(data){
  return{
    type: LINHA_DE_PRODUCAO_SALVAR_SUCCESS,
    data
  }
}

export function linhaProducaoDeletarRequest(id, filtros){
  return {
    type: LINHA_DE_PRODUCAO_DELETE_REQUEST,
    id,
    filtros,
  }
}

export function linhaProducaoDeletarSuccess(){
  return {
    type: LINHA_DE_PRODUCAO_DELETE_SUCCESS,
  }
}

export function linhaProducaoEditarRequest(entity, diagrama) {
  return{
    type: LINHA_DE_PRODUCAO_EDITAR_REQUEST,
    entity,
    diagrama,
  }
}

export function linhaProducaoEditarSuccess(data) {
  return {
    type: LINHA_DE_PRODUCAO_EDITAR_SUCCESS,
    data
  }
}

export function linhaProducaoPrepararNovoRequest(){
  return {
   type: LINHA_DE_PRODUCAO_PREPARAR_NOVO_REQUEST,
 };
}

export function linhaProducaoPrepararNovoSuccess(data){
  return {
   type: LINHA_DE_PRODUCAO_PREPARAR_NOVO_SUCCESS,
   data
 };
}

export function linhaProducaoPrepararEditarRequest(id){
  return {
    type: LINHA_DE_PRODUCAO_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function linhaProducaoPrepararEditarSuccess(data){
  return {
    type: LINHA_DE_PRODUCAO_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function buscarLinhaProducaoPorNomeRequest(nome){
  return {
    type: LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_REQUEST,
    nome
  }
}

export function buscarLinhaProducaoPorNomeSuccess(data){
  return {
    type: LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_SUCCESS,
    data
  }
}

export function restaurarLinhaProducaoRequest(entity){
  return {
    type: LINHA_DE_PRODUCAO_RESTAURAR_REQUEST,
    entity
  }
}

export function restaurarLinhaProducaoSuccess(data){
  return {
    type: LINHA_DE_PRODUCAO_RESTAURAR_SUCCESS,
    data
  }
}

export function ativarOuDesativarRequest(objeto, filtros) {
  return {
    type: LINHA_DE_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
    objeto,
    filtros
  };
}

export function error( error ) {
  return {
    type: LINHA_DE_PRODUCAO_ERROR,
    error
  }
}
