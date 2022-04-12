import {
  ASAICHI_ERROR,
  ASAICHI_GRAFICO_DEFEITOS_REQUEST,
  ASAICHI_GRAFICO_DEFEITOS_SUCCESS,
  ASAICHI_LIST_REQUEST,
  ASAICHI_LIST_SUCCESS,
  ASAICHI_PRODUCAO_DIARIA_REQUEST,
  ASAICHI_PRODUCAO_DIARIA_SUCCESS,
  ASAICHI_PRODUCAO_MENSAL_REQUEST,
  ASAICHI_PRODUCAO_MENSAL_SUCCESS,
  ASAICHI_PRODUCAO_SEMANAL_REQUEST,
  ASAICHI_PRODUCAO_SEMANAL_SUCCESS,
  ASAICHI_TABELA_DEFEITOS_REQUEST,
  ASAICHI_TABELA_DEFEITOS_SUCCESS,
  ASAICHI_TABELA_PRODUCAO_REQUEST,
  ASAICHI_TABELA_PRODUCAO_SUCCESS,
  ASAICHI_TABELA_PRODUTIVIDADE_REQUEST,
  ASAICHI_TABELA_PRODUTIVIDADE_SUCCESS
} from "../actionTypes";

export function asaichiListRequest(filtros){
  return {
    type: ASAICHI_LIST_REQUEST,
    filtros
  }
}

export function asaichiListSuccess(data){
  return {
    type: ASAICHI_LIST_SUCCESS,
    data
  }
}

export function asaichiTabelaProducaoRequest(filtros){
  return {
    type: ASAICHI_TABELA_PRODUCAO_REQUEST,
    filtros
  }
}

export function asaichiTabelaProducaoSuccess(data){
  return {
    type: ASAICHI_TABELA_PRODUCAO_SUCCESS,
    data
  }
}

export function asaichiTabelaDefeitosRequest(filtros){
  return {
    type: ASAICHI_TABELA_DEFEITOS_REQUEST,
    filtros
  }
}

export function asaichiTabelaDefeitosSuccess(data){
  return {
    type: ASAICHI_TABELA_DEFEITOS_SUCCESS,
    data
  }
}

export function asaichiTabelaProdutividadeRequest(filtros){
  return {
    type: ASAICHI_TABELA_PRODUTIVIDADE_REQUEST,
    filtros
  }
}

export function asaichiTabelaProdutividadeSuccess(data){
  return {
    type: ASAICHI_TABELA_PRODUTIVIDADE_SUCCESS,
    data
  }
}

export function asaichiProducaoDiariaRequest(filtros){
  return {
    type: ASAICHI_PRODUCAO_DIARIA_REQUEST,
    filtros
  }
}

export function asaichiProducaoDiariaSuccess(data){
  return {
    type: ASAICHI_PRODUCAO_DIARIA_SUCCESS,
    data
  }
}

export function asaichiProducaoSemanalRequest(filtros){
  return {
    type: ASAICHI_PRODUCAO_SEMANAL_REQUEST,
    filtros
  }
}

export function asaichiProducaoSemanalSuccess(data){
  return {
    type: ASAICHI_PRODUCAO_SEMANAL_SUCCESS,
    data
  }
}

export function asaichiProducaoMensalRequest(filtros){
  return {
    type: ASAICHI_PRODUCAO_MENSAL_REQUEST,
    filtros
  }
}

export function asaichiProducaoMensalSuccess(data){
  return {
    type: ASAICHI_PRODUCAO_MENSAL_SUCCESS,
    data
  }
}

export function asaichiGraficoDefeitosRequest(filtros){
  return {
    type: ASAICHI_GRAFICO_DEFEITOS_REQUEST,
    filtros
  }
}

export function asaichiGraficoDefeitosSuccess(data){
  return {
    type: ASAICHI_GRAFICO_DEFEITOS_SUCCESS,
    data
  }
}

export function asaichiError(error){
  return {
    type: ASAICHI_ERROR,
    error
  }
}
