import {
  APONTAMENTO_DE_MATERIAL_APONTAR_REQUEST,
  APONTAMENTO_DE_MATERIAL_APONTAR_SUCCESS,
  APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_SUCCESS,
  APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_SUCCESS,
  APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_SUCCESS,
  APONTAMENTO_DE_MATERIAL_ERROR,
  APONTAMENTO_DE_MATERIAL_IMPORTAR_ARQUIVO_REQUEST,
  APONTAMENTO_DE_MATERIAL_IMPORTAR_ARQUIVO_SUCCESS,
  APONTAMENTO_DE_MATERIAL_LIST_REQUEST,
  APONTAMENTO_DE_MATERIAL_LIST_SUCCESS,
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function listRequest(filtros) {
  return {
    type: APONTAMENTO_DE_MATERIAL_LIST_REQUEST,
    filtros
  };
}

export function listSuccess(data) {
  return {
    type: APONTAMENTO_DE_MATERIAL_LIST_SUCCESS,
    data
  };
}

export function buscarOrdensDeProducaoRequest(ordemDeProducao){
  return {
    type: APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_REQUEST,
    ordemDeProducao
  }
}

export function buscarOrdensDeProducaoSuccess(data){
  return {
    type: APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_SUCCESS,
    data
  }
}

export function buscarMateriaisRequest(ordemDeProducao){
  return {
    type: APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_REQUEST,
    ordemDeProducao
  }
}

export function buscarMateriaisSuccess(data){
  return {
    type: APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_SUCCESS,
    data
  }
}

export function buscarLotesDisponiveisRequest(material){
  return {
    type: APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_REQUEST,
    material
  }
}

export function buscarLotesDisponiveisSuccess(data){
  return {
    type: APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_SUCCESS,
    data
  }
}

export function apontarRequest(material){
  return {
    type: APONTAMENTO_DE_MATERIAL_APONTAR_REQUEST,
    material
  }
}

export function apontarSuccess(data){
  return {
    type: APONTAMENTO_DE_MATERIAL_APONTAR_SUCCESS,
    data
  }
}

export function importarArquivoRequest(formData){
  return {
    type: APONTAMENTO_DE_MATERIAL_IMPORTAR_ARQUIVO_REQUEST,
    formData
  }
}

export function importarArquivoSuccess(data){
  if (data.fileCorrigida){
    const byteArray = new Uint8Array(data.fileCorrigida.match(/.{2}/g).map(e => parseInt(e, 16)));
    const dataCorrigida =  new Blob([byteArray], {type: "application/octet-stream"})
    downloadRelatorio(dataCorrigida, "apontamentoDeMaterial.linhasCorrigidas.nomeArquivo.label", ".xls")
  }

  return {
    type: APONTAMENTO_DE_MATERIAL_IMPORTAR_ARQUIVO_SUCCESS,
    data
  }
}

export function error(error){
  return {
    type: APONTAMENTO_DE_MATERIAL_ERROR,
    error
  }
}
