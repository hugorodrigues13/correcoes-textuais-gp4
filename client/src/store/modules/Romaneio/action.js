import {
  ROMANEIO_ABRIR_STATUS_REQUEST,
  ROMANEIO_ABRIR_STATUS_SUCCESS,
  ROMANEIO_EDITAR_LOTES_REQUEST,
  ROMANEIO_EDITAR_LOTES_SUCCESS,
  ROMANEIO_ERROR,
  ROMANEIO_FECHAR_STATUS_REQUEST,
  ROMANEIO_FECHAR_STATUS_SUCCESS,
  ROMANEIO_LIST_REQUEST,
  ROMANEIO_LIST_SUCCESS,
  ROMANEIO_LISTAR_LOTES_REQUEST,
  ROMANEIO_LISTAR_LOTES_SUCCESS,
  ROMANEIO_MUDAR_VOLUME_REQUEST,
  ROMANEIO_MUDAR_VOLUME_SUCCESS,
  ROMANEIO_PREPARE_EDIT_REQUEST,
  ROMANEIO_PREPARE_EDIT_SUCCESS,
  ROMANEIO_HISTORICO_REQUEST,
  ROMANEIO_HISTORICO_SUCCESS,
  ROMANEIO_EXPORTAR_REQUEST,
  ROMANEIO_EXPORTAR_SUCCESS,
  ROMANEIO_GERAR_NFF_REQUEST,
  ROMANEIO_GERAR_NFF_SUCCESS,
  ROMANEIO_EXPORTAR_LISTAGEM_REQUEST,
  ROMANEIO_EXPORTAR_LISTAGEM_SUCCESS,
  ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_REQUEST,
  ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_SUCCESS,
  ROMANEIO_EDITAR_NFS_REQUEST,
  ROMANEIO_EDITAR_NFS_SUCCESS,
  ROMANEIO_EXPORTAR_XLSX_REQUEST,
  ROMANEIO_EXPORTAR_XLSX_SUCCESS,
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function listRomaneioRequest(filtros) {
  return {
    type: ROMANEIO_LIST_REQUEST,
    filtros
  }
}

export function listRomaneioSuccess(data) {
  return {
    type: ROMANEIO_LIST_SUCCESS,
    data
  }
}

export function exportarRomaneioListagemRequest(filtros){
  return {
    type: ROMANEIO_EXPORTAR_LISTAGEM_REQUEST,
    filtros
  }
}

export function exportarRomaneioListagemSuccess(data){
  downloadRelatorio(data, "romaneio.relatorio.nomeArquivo.label")
  return {
    type: ROMANEIO_EXPORTAR_LISTAGEM_SUCCESS,
    data
  }
}

export function prepareRomaneioEditRequest(id) {
  return {
    type: ROMANEIO_PREPARE_EDIT_REQUEST,
    id
  }
}

export function prepareRomaneioEditSuccess(data) {
  return {
    type: ROMANEIO_PREPARE_EDIT_SUCCESS,
    data
  }
}

export function abrirRomaneioStatusRequest(entity) {
  return {
    type: ROMANEIO_ABRIR_STATUS_REQUEST,
    entity
  }
}

export function abrirRomaneioStatusSuccess(data) {
  return {
    type: ROMANEIO_ABRIR_STATUS_SUCCESS,
    data
  }
}

export function cancelarRomaneioStatusRequest(entity) {
  return {
    type: ROMANEIO_FECHAR_STATUS_REQUEST,
    entity
  }
}

export function cancelarRomaneioStatusSuccess(data) {
  return {
    type: ROMANEIO_FECHAR_STATUS_SUCCESS,
    data
  }
}

export function mudarRomaneioVolumeRequest(entity, volume) {
  return {
    type: ROMANEIO_MUDAR_VOLUME_REQUEST,
    entity, volume
  }
}

export function mudarRomaneioVolumeSuccess(data) {
  return {
    type: ROMANEIO_MUDAR_VOLUME_SUCCESS,
    data,
  }
}

export function historicoRomaneioRequest(entity) {
  return {
    type: ROMANEIO_HISTORICO_REQUEST,
    entity
  }
}

export function historicoRomaneioSuccess(data) {
  return {
    type: ROMANEIO_HISTORICO_SUCCESS,
    data,
  }
}

export function listarLotesRequest(filtros, inclusos) {
  return {
    type: ROMANEIO_LISTAR_LOTES_REQUEST,
    filtros, inclusos
  }
}

export function listarLotesSuccess(data) {
  return {
    type: ROMANEIO_LISTAR_LOTES_SUCCESS,
    data,
  }
}

export function editarLotesRequest(id, selecionados){
  return {
    type: ROMANEIO_EDITAR_LOTES_REQUEST,
    id, selecionados,
  }
}

export function editarLotesSuccess(data){
  return {
    type: ROMANEIO_EDITAR_LOTES_SUCCESS,
    data,
  }
}

export function exportarRomaneioRequest(id){
  return {
    type: ROMANEIO_EXPORTAR_REQUEST,
    id,
  }
}

export function exportarRomaneioSuccess(data){
  const url = base64ToURL(data, "application/pdf")
  window.open(url)
  return {
    type: ROMANEIO_EXPORTAR_SUCCESS,
    data,
  }
}

export function exportarRomaneioXlsxRequest(id) {
  return {
    type: ROMANEIO_EXPORTAR_XLSX_REQUEST,
    id
  }
}


export function exportarRomaneioXlsxSuccess(data) {
  console.log(data)
  console.log('chegou aqui')
  downloadRelatorio(data, "romaneio.relatorio.nomeArquivo.label")
  console.log('teoricamente baixou o relatório')
  return {
    type: ROMANEIO_EXPORTAR_XLSX_SUCCESS,
    data
  }
}

export function gerarNffRequest(id){
  return {
    type: ROMANEIO_GERAR_NFF_REQUEST,
    id,
  }
}

export function gerarNffSuccess(data){
  return {
    type: ROMANEIO_GERAR_NFF_SUCCESS,
    data,
  }
}

export function verificarStatusIntegracaoRequest(romaneio){
  return {
    type: ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_REQUEST,
    romaneio,
  }
}

export function verificarStatusIntegracaoSuccess(data){
  return {
    type: ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_SUCCESS,
    data,
  }
}

export function editarNfsRomaneioRequest(id, nfEncomenda, nfRetorno){
  return {
    type: ROMANEIO_EDITAR_NFS_REQUEST,
    id, nfEncomenda, nfRetorno
  }
}

export function editarNfsRomaneioSuccess(data){
  return {
    type: ROMANEIO_EDITAR_NFS_SUCCESS,
    data
  }
}

export function error(error) {
  return {
    type: ROMANEIO_ERROR,
    error
  }
}

const base64ToURL = (base64, type) => {
  const decodedContent = atob(base64);
  const byteArray = new Uint8Array(decodedContent.length);
  for (let i = 0; i < decodedContent.length; i++) {
    byteArray[i] = decodedContent.charCodeAt(i);
  }
  const blob = new Blob([byteArray.buffer], {type: type});
  let url = URL.createObjectURL(blob);
  return url
}


