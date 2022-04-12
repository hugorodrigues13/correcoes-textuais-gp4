import {
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ATUALIZAR_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ATUALIZAR_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ERROR,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_EXPORTAR_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_EXPORTAR_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_REEXPORTAR_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_REEXPORTAR_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_EDIT_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_EDIT_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ALTERAR_EM_MASSA_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ALTERAR_EM_MASSA_REQUEST,
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";
import * as ACTIONS from "../actionTypes";

export function acompanhamentoOrdemProducaoListarRequest(filtros) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_REQUEST,
    filtros
  }
}

export function acompanhamentoOrdemProducaoListarSuccess(data) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_SUCCESS,
    data
  }
}

export function reexportarRequest(id) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_REEXPORTAR_REQUEST,
    id
  }
}

export function reexportarSuccess(data) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_REEXPORTAR_SUCCESS,
    data
  }
}

export function alterarOPEmMassaRequest(formData) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ALTERAR_EM_MASSA_REQUEST,
    formData
  }
}

export function alterarOPEmMassaSuccess(data) {
  if (data.fileCorrigida){
    const byteArray = new Uint8Array(data.fileCorrigida.match(/.{2}/g).map(e => parseInt(e, 16)));
    const dataCorrigida =  new Blob([byteArray], {type: "application/octet-stream"})
    downloadRelatorio(dataCorrigida, "geracaoOrdemDeProducao.linhasCorrigidas.nomeArquivo.label", ".xls")
  }
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ALTERAR_EM_MASSA_SUCCESS,
    data
  }
}

export function atualizarRequest(filtros){
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ATUALIZAR_REQUEST,
    filtros
  }
}

export function atualizarSuccess(data){
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ATUALIZAR_SUCCESS,
    data,
  }
}

export function exportarRequest(filtros){
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_EXPORTAR_REQUEST,
    filtros
  }
}

export function exportarSuccess(data){
  downloadRelatorio(data, "acompanhamentoOrdemProducao.relatorio.nomeArquivo.label")
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_EXPORTAR_SUCCESS,
    data
  }
}

export function ordensAtrasadasRequest(filtros) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_REQUEST,
    filtros
  }
}

export function ordensAtrasadasSuccess(data) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_SUCCESS,
    data
  }
}

export function acompanhamentoOPPrepareEditRequest(id){
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_REQUEST,
    id
  }
}

export function acompanhamentoOPPrepareEditSuccess(data){
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_SUCCESS,
    data
  }
}

export function acompanhamentoOPEditRequest(values){
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_EDIT_REQUEST,
    values
  }
}

export function acompanhamentoOPEditSuccess(data){
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_EDIT_SUCCESS,
    data
  }
}

export function error(error) {
  return {
    type: ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ERROR,
    error
  }
}


