import {
  PRODUTO_ETIQUETA_DELETE_REQUEST,
  PRODUTO_ETIQUETA_DELETE_SUCCEESS,
  PRODUTO_ETIQUETA_EDITAR_REQUEST,
  PRODUTO_ETIQUETA_EDITAR_SUCCESS,
  PRODUTO_ETIQUETA_LIST_REQUEST,
  PRODUTO_ETIQUETA_LIST_SUCCESS,
  PRODUTO_ETIQUETA_PREPARAR_EDITAR_REQUEST,
  PRODUTO_ETIQUETA_PREPARAR_EDITAR_SUCCESS,
  PRODUTO_ETIQUETA_PREPARAR_NOVO_REQUEST,
  PRODUTO_ETIQUETA_PREPARAR_NOVO_SUCCESS,
  PRODUTO_ETIQUETA_SALVAR_REQUEST,
  PRODUTO_ETIQUETA_SALVAR_SUCCESS,
  PRODUTO_ETIQUETA_GERAR_ETIQUETA_REQUEST,
  PRODUTO_ETIQUETA_GERAR_ETIQUETA_SUCCESS,
  PRODUTO_ETIQUETA_ERROR,
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function listProdutoEtiquetaRequest( filtros ) {
  return {
    type: PRODUTO_ETIQUETA_LIST_REQUEST,
    filtros
  }
}

export function listProdutoEtiquetaSuccess( data ) {
  return {
    type: PRODUTO_ETIQUETA_LIST_SUCCESS,
    data
  }
}

export function prepararEditarRequest( id ) {
  return {
    type: PRODUTO_ETIQUETA_PREPARAR_EDITAR_REQUEST,
    id
  }
}

export function prepararEditarSuccess( data ) {
  return {
    type: PRODUTO_ETIQUETA_PREPARAR_EDITAR_SUCCESS,
    data
  }
}

export function prepararNovoRequest() {
  return {
    type: PRODUTO_ETIQUETA_PREPARAR_NOVO_REQUEST
  }
}

export function prepararNovoSuccess( data ) {
  return {
    type: PRODUTO_ETIQUETA_PREPARAR_NOVO_SUCCESS,
    data
  }
}

export function salvarRequest( entity ) {
  return {
    type: PRODUTO_ETIQUETA_SALVAR_REQUEST,
    entity
  }
}

export function salvarSuccess( data ) {
  return {
    type: PRODUTO_ETIQUETA_SALVAR_SUCCESS,
    data
  }
}

export function editarRequest( entity ) {
  return {
    type: PRODUTO_ETIQUETA_EDITAR_REQUEST,
    entity
  }
}

export function editarSuccess( data ) {
  return {
    type: PRODUTO_ETIQUETA_EDITAR_SUCCESS
  }
}

export function deleteRequest( id, filtros ) {
  return {
    type: PRODUTO_ETIQUETA_DELETE_REQUEST,
    id, filtros
  }
}

export function gerarRelatorioEtiquetaRequest(filtros){
  return {
    type: PRODUTO_ETIQUETA_GERAR_ETIQUETA_REQUEST,
    filtros,
  }
}

export function gerarRelatorioEtiquetaSuccess(data){
  downloadRelatorio(data, "produtoEtiqueta.relatorio.nomeArquivo.label")
  return {
    type: PRODUTO_ETIQUETA_GERAR_ETIQUETA_SUCCESS,
    data,
  }
}


export function error(error) {
  return {
    type: PRODUTO_ETIQUETA_ERROR,
    error
  };
}
