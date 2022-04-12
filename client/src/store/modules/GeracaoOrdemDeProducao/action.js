import * as ACTIONS from "../actionTypes";
import {ALMOXARIFADO_ERROR} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

//BUSCAR PRODUTOS REQUEST
export function buscarProdutosRequest(codigo, descricao) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_PRODUTOS_REQUEST,
    codigo,
    descricao
  }
}

//BUSCAR PRODUTOS SUCCESS
export function buscarProdutosSuccess(data){
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_PRODUTOS_SUCCESS,
    data
  }
}

//BUSCAR PRODUTOS REQUEST
export function buscarFornecedoresListasRoteirosRequest(codigo) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_FORNECEDORES_LISTAS_ROTEIROS_REQUEST,
    codigo
  }
}

//BUSCAR PRODUTOS SUCCESS
export function buscarFornecedoresListasRoteirosSuccess(codigo){
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_FORNECEDORES_LISTAS_ROTEIROS_SUCCESS,
    codigo
  }
}

//BUSCAR POR OV
export function buscarPorOrdemDeVendaRequest(ordemDeVenda, codigoProduto) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_POR_OV_REQUEST,
    ordemDeVenda,
    codigoProduto
  }
}

//BUSCAR POR OV
export function buscarPorOrdemDeVendaSuccess(data){
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_POR_OV_SUCCESS,
    data
  }
}


//BUSCAR POR OV
export function gerarOrdemDeProducaoRequest(entity) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_GERAR_REQUEST,
    entity
  }
}

//BUSCAR POR OV
export function gerarOrdemDeProducaoSuccess(data){
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_GERAR_SUCCESS,
    data
  }
}


export function gerarOrdemDeProducaoSetEntity(entity) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SET_ENTITY,
    entity
  }
}

export function limparProdutos() {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_LIMPAR_PRODUTOS
  }
}

export function selecionarOrdensRequest(entities, rows) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_ORDENS_REQUEST,
    entities, rows
  }
}

export function selecionarOrdensSuccess(entities, rows) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_ORDENS_SUCCESS,
    entities, rows
  }
}

export function selecionarListaRoteiroRequest(entity, lista, roteiro, fornecedor, propriedade) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_LISTA_ROTEIRO_REQUEST,
    entity, lista, roteiro, fornecedor, propriedade
  }
}

export function selecionarListaRoteiroSuccess(entity, lista, roteiro, fornecedor, propriedade) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_LISTA_ROTEIRO_SUCCESS,
    entity, lista, roteiro, fornecedor, propriedade
  }
}

export function selecionarDataRequest(entity, data) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_DATA_REQUEST,
    entity, data
  }
}

export function selecionarDataSuccess(entity, data) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_DATA_SUCCESS,
    entity, data
  }
}

export function selecionarJustificativaRequest(entity, justificativa) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_JUSTIFICATIVA_REQUEST,
    entity, justificativa
  }
}

export function selecionarJustificativaSuccess(entity, justificativa) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_JUSTIFICATIVA_SUCCESS,
    entity, justificativa
  }
}

export function importarOrdensRequest(formData){
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_IMPORTAR_ORDENS_REQUEST,
    formData
  }
}

export function importarOrdensSuccess(data){
  if (data.fileCorrigida){
    const byteArray = new Uint8Array(data.fileCorrigida.match(/.{2}/g).map(e => parseInt(e, 16)));
    const dataCorrigida =  new Blob([byteArray], {type: "application/octet-stream"})
    downloadRelatorio(dataCorrigida, "geracaoOrdemDeProducao.linhasCorrigidas.nomeArquivo.label", ".xls")
  }
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_IMPORTAR_ORDENS_SUCCESS,
    data
  }
}

export function getUsuariosFornecedoresRequest(){
  return {
    type: ACTIONS.GERACAO_DE_ORDEM_DE_PRODUCAO_USER_FORNECEDORES_REQUEST,
  }
}

export function getUsuariosFornecedoresSuccess(data){
  return {
    type: ACTIONS.GERACAO_DE_ORDEM_DE_PRODUCAO_USER_FORNECEDORES_SUCCESS,
    data
  }
}

export function error( error ) {
  return {
    type: ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_ERROR,
    error
  }
}
