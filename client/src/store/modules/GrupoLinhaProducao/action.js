import {
  GRUPO_LINHA_PRODUCAO_LIST_REQUEST,
  GRUPO_LINHA_PRODUCAO_LIST_SUCCESS,
  GRUPO_LINHA_PRODUCAO_SALVAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_SALVAR_SUCCESS,
  GRUPO_LINHA_PRODUCAO_EDITAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_EDITAR_SUCCESS,
  GRUPO_LINHA_PRODUCAO_DELETE_REQUEST,
  GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_SUCCESS,
  GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_REQUEST,
  GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_SUCCESS,
  GRUPO_LINHA_PRODUCAO_SET_ENTITY,
  GRUPO_LINHA_PRODUCAO_ERROR,
  RECURSO_ATIVAR_OU_DESATIVAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_EXPORTAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_EXPORTAR_SUCCESS,
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function listGrupoLinhaProducaoRequest( filtros ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_LIST_REQUEST,
    filtros
  }
}

export function listGrupoLinhaProducaoSuccess( data ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_LIST_SUCCESS,
    data
  }
}

export function salvarRequest( entity ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_SALVAR_REQUEST,
    entity
  }
}

export function salvarSuccess( data ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_SALVAR_SUCCESS,
    data
  }
}

export function editarRequest( entity ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_EDITAR_SUCCESS,
    data
  }
}

export function prepararEditarRequest( id ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess( data ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess( data ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function deleteRequest( id, filtros ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_DELETE_REQUEST,
    id, filtros
  }
}

export function grupoLinhaProducaoExportarRequest(filtros){
  return {
    type: GRUPO_LINHA_PRODUCAO_EXPORTAR_REQUEST,
    filtros
  }
}

export function grupoLinhaProducaoExportarSuccess(data){
  downloadRelatorio(data, "grupoLinhaProducao.relatorio.nomeArquivo.label")
  return {
    type: GRUPO_LINHA_PRODUCAO_EXPORTAR_SUCCESS,
    data
  }
}

export function GrupoLinhaProducaoSetEntity(entity) {
  return {
    type: GRUPO_LINHA_PRODUCAO_SET_ENTITY,
    entity
  }
}

export function ativarOuDesativarRequest(objeto, filtros) {
  return {
    type: GRUPO_LINHA_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
    objeto,
    filtros
  };
}

export function error( error ) {
  return {
    type: GRUPO_LINHA_PRODUCAO_ERROR,
    error
  }
}
