import {
  SERIAL_LIST_REQUEST,
  SERIAL_LIST_SUCCESS,
  SERIAL_ERROR,
  SERIAL_GERAR_ETIQUETA_REQUEST,
  SERIAL_GERAR_ETIQUETA_SUCCESS,
  SERIAL_IMPRIMIR_REQUEST,
  SERIAL_IMPRIMIR_SUCCESS,
  SERIAL_ESTORNAR_APONTAMENTO_REQUEST,
  SERIAL_ESTORNAR_APONTAMENTO_SUCCESS,
  SERIAL_LIST_HISTORICO_REQUEST,
  SERIAL_LIST_HISTORICO_SUCCESS,
  SERIAL_EXPORTAR_REQUEST,
  SERIAL_EXPORTAR_SUCCESS,
  SERIAL_SUCATEAR_REQUEST,
  SERIAL_SUCATEAR_SUCCESS,
  SERIAL_FOLHA_IMPRESSAO_DATA_SUCCESS,
  SERIAL_FOLHA_IMPRESSAO_DATA_REQUEST, SERIAL_VALORES_INICIAIS_REQUEST, SERIAL_VALORES_INICIAIS_SUCCESS,
} from "../actionTypes"
import {baixarPdfEtiquetas, downloadRelatorio} from "../../../services/serviceUtils";

export function listSerialRequest(filtros) {
  return {
    type: SERIAL_LIST_REQUEST,
    filtros
  }
}

export function listSerialSuccess(data) {
  return {
    type: SERIAL_LIST_SUCCESS,
    data
  }
}

export function buscaValoresIniciaisRequest() {
  return {
    type: SERIAL_VALORES_INICIAIS_REQUEST
  }
}

export function buscaValoresIniciaisSuccess(data) {
  return {
    type: SERIAL_VALORES_INICIAIS_SUCCESS,
    data
  }
}


export function listSerialHistoricoRequest(serialId){
  return {
    type: SERIAL_LIST_HISTORICO_REQUEST,
    serialId
  }
}

export function listSerialHistoricoSuccess(data){
  return {
    type: SERIAL_LIST_HISTORICO_SUCCESS,
    data
  }
}

export function serialGerarEtiquetaRequest( data ){
  return {
    type: SERIAL_GERAR_ETIQUETA_REQUEST,
    data
  }
}

export function serialGerarEtiquetaSuccess( data ){
  baixarPdfEtiquetas(data.etiquetas)
  return {
    type: SERIAL_GERAR_ETIQUETA_SUCCESS,
    data,
  }
}

export function serialImprimirRequest(data){
  return {
    type: SERIAL_IMPRIMIR_REQUEST,
    data
  }
}

export function serialImprimirSuccess(data){
  baixarPdfEtiquetas(data.etiquetas)
  return {
    type: SERIAL_IMPRIMIR_SUCCESS,
    data
  }
}

export function serialEstornarApontamentoRequest(serial, justificativa, apontamento, filtros){
  return {
    type: SERIAL_ESTORNAR_APONTAMENTO_REQUEST,
    serial, justificativa, apontamento, filtros
  }
}

export function serialEstornarApontamentoSuccess(data){
  return {
    type: SERIAL_ESTORNAR_APONTAMENTO_SUCCESS,
    data
  }
}

export function serialExportarRequest(filtros){
  return {
    type: SERIAL_EXPORTAR_REQUEST,
    filtros
  }
}

export function serialExportarSuccess(data){
  downloadRelatorio(data, "serial.relatorio.nomeArquivo.label")
  return {
    type: SERIAL_EXPORTAR_SUCCESS,
    data
  }
}

export function serialSucatearRequest(id, filtros) {
  return {
    type: SERIAL_SUCATEAR_REQUEST,
    id,
    filtros
  }
}

export function serialSucatearSuccess(data) {
  return {
    type: SERIAL_SUCATEAR_SUCCESS,
    data
  }
}
export function folhaImpressaoDataRequest(entity) {
  return {
    type: SERIAL_FOLHA_IMPRESSAO_DATA_REQUEST,
    entity
  }
}

export function folhaImpressaoDataSuccess(data) {
  return {
    type: SERIAL_FOLHA_IMPRESSAO_DATA_SUCCESS,
    data
  }
}


// ERROR
export function error(error) {
  return {
    type: SERIAL_ERROR,
    error
  };
}

