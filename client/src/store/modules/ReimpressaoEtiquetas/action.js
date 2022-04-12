import {
  REIMPRESSAO_ETIQUETAS_ERROR,
  REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_REQUEST,
  REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_SUCCESS,
  REIMPRESSAO_ETIQUETAS_REIMPRIMIR_REQUEST,
  REIMPRESSAO_ETIQUETAS_REIMPRIMIR_SUCCESS,
  REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_REQUEST,
  REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_SUCCESS,
} from "../actionTypes";
import {baixarPdfEtiquetas} from "../../../services/serviceUtils";

export function reimpressaoEtiquetasGetImpressorasRequest(){
  return {
    type: REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_REQUEST
  }
}

export function reimpressaoEtiquetasGetImpressorasSucess(data){
  return {
    type: REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_SUCCESS,
    data
  }
}

export function reimpressaoEtiquetasReimprimirRequest(values){
  return {
    type: REIMPRESSAO_ETIQUETAS_REIMPRIMIR_REQUEST,
    values
  }
}

export function reimpressaoEtiquetasReimprimirSuccess(data){
  if(data.etiquetas && !data.impressora?.id) {
    baixarPdfEtiquetas(data.etiquetas)
  }

  return {
    type: REIMPRESSAO_ETIQUETAS_REIMPRIMIR_SUCCESS,
    data
  }
}

export function reimpressaoEtiquetasPesquisarDadosRequest(lote){
  return {
    type: REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_REQUEST,
    lote
  }
}

export function reimpressaoEtiquetasPesquisarDadosSuccess(data) {
  return {
    type: REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_SUCCESS,
   data
  }
}


export function reimpressaoEtiquetasError(error){
  return {
    type: REIMPRESSAO_ETIQUETAS_ERROR,
    error
  }
}
