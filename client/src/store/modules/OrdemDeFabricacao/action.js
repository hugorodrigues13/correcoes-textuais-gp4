import {
  ORDEM_FABRICACAO_ERROR,
  ORDEM_FABRICACAO_FOLHA_IMPRESSAO_REQUEST,
  ORDEM_FABRICACAO_FOLHA_IMPRESSAO_SUCCESS,
  ORDEM_FABRICACAO_IMPRIMIR_ETIQUETA_REQUEST,
  ORDEM_FABRICACAO_IMPRIMIR_ETIQUETA_SUCCESS,
  ORDEM_FABRICACAO_LIST_REQUEST,
  ORDEM_FABRICACAO_LIST_SUCCESS,
  ORDEM_FABRICACAO_EXPORTAR_REQUEST,
  ORDEM_FABRICACAO_EXPORTAR_SUCCESS,
  ORDEM_FABRICACAO_MATERIAS_PRIMAS_REQUEST,
  ORDEM_FABRICACAO_MATERIAS_PRIMAS_SUCCESS,
  ORDEM_FABRICACAO_ENVIAR_SEPARACAO_REQUEST,
  ORDEM_FABRICACAO_ENVIAR_SEPARACAO_SUCCESS,
  ORDEM_FABRICACAO_ALTERAR_QUANTIDADE_REQUEST,
  ORDEM_FABRICACAO_ALTERAR_QUANTIDADE_SUCCESS,
  ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_REQUEST,
  ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_SUCCESS,
  ORDEM_FABRICACAO_CANCELAR_REQUEST,
  ORDEM_FABRICACAO_CANCELAR_SUCCESS,
  ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_REQUEST,
  ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_SUCCESS
} from "../actionTypes";
import Alert from "react-s-alert";
import {getMessage} from "../../../components/messages";
import {base64ToURL, downloadRelatorio} from "../../../services/serviceUtils";

export function listOrdemFabricacaoRequest(filtros){
  return {
    type: ORDEM_FABRICACAO_LIST_REQUEST,
    filtros
  }
}

export function listOrdemFabricacaoSuccess(data){
  return {
    type: ORDEM_FABRICACAO_LIST_SUCCESS,
    data
  }
}

export function imprimirEtiquetaRequest(entity, filtros){
  return {
    type: ORDEM_FABRICACAO_IMPRIMIR_ETIQUETA_REQUEST,
    entity, filtros
  }
}

export function imprimirEtiquetaSuccess(data){
  if(data.etiquetas && !data.impressora?.id){
    baixarPdfEtiquetas(data.etiquetas)
  }
  return {
    type: ORDEM_FABRICACAO_IMPRIMIR_ETIQUETA_SUCCESS,
    data
  }
}

export function folhaImpressaoRequest(data){
  return {
    type: ORDEM_FABRICACAO_FOLHA_IMPRESSAO_REQUEST,
    data
  }
}

export function folhaImpressaoSuccess(data){
  baixarPdfEtiquetas(data.etiquetas)
  return {
    type: ORDEM_FABRICACAO_FOLHA_IMPRESSAO_SUCCESS,
    data
  }
}

export function folhaImpressaoDataRequest(entity) {
  return {
    type: ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_REQUEST,
    entity
  }
}

export function folhaImpressaoDataSuccess(data) {
  return {
    type: ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_SUCCESS,
    data
  }
}

export function exportarRequest(filtros){
  return {
    type: ORDEM_FABRICACAO_EXPORTAR_REQUEST,
    filtros
  }
}

export function exportarSuccess(data){
  downloadRelatorio(data, "ordemFabricacao.relatorio.nomeArquivo.label")
  return {
    type: ORDEM_FABRICACAO_EXPORTAR_SUCCESS,
    data
  }
}

export function alterarQuantidadeOFRequest(id, quantidade, filtros){
  return {
    type: ORDEM_FABRICACAO_ALTERAR_QUANTIDADE_REQUEST,
    id, quantidade, filtros
  }
}

export function alterarQuantidadeOFSuccess(data){
  return {
    type: ORDEM_FABRICACAO_ALTERAR_QUANTIDADE_SUCCESS,
    data
  }
}

export function materiasPrimasDaOFRequest(ordemProducao){
  return {
    type: ORDEM_FABRICACAO_MATERIAS_PRIMAS_REQUEST,
    ordemProducao,
  }
}

export function materiasPrimasDaOFSuccess(data){
  return {
    type: ORDEM_FABRICACAO_MATERIAS_PRIMAS_SUCCESS,
    data
  }
}

export function enviarSeparacaoOFRequest(values, filtros){
  return {
    type: ORDEM_FABRICACAO_ENVIAR_SEPARACAO_REQUEST,
    values, filtros,
  }
}

export function enviarSeparacaoOFSuccess(data){
  return {
    type: ORDEM_FABRICACAO_ENVIAR_SEPARACAO_SUCCESS,
    data,
  }
}

export function cancelarOFsRequest(ids, filtros){
  return {
    type: ORDEM_FABRICACAO_CANCELAR_REQUEST,
    ids, filtros
  }
}

export function cancelarOFsSuccess(data){
  return {
    type: ORDEM_FABRICACAO_CANCELAR_SUCCESS,
    data,
  }
}

export function listaHistoricoImpressaoRequest(id){
  return {
    type: ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_REQUEST,
    id
  }
}

export function listaHistoricoImpressaoSuccess(data){
  return {
    type: ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_SUCCESS,
    data,
  }
}

export function error(error){
  return {
    type: ORDEM_FABRICACAO_ERROR,
    error,
  }
}

const baixarPdfEtiquetas = (etiquetas) => {
  if(etiquetas.some(e => e.success)) {
    etiquetas.forEach(etiqueta => {
      if (etiqueta.success) {
        const url = base64ToURL(etiqueta.base64Etiqueta, "application/pdf");
        window.open(url);
      }
    });
  } else {
    Alert.warning(getMessage("ordemDeFabricacao.semImpressoes.message"), {});
  }
}

