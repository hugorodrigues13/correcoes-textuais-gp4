import {
  ASAICHI_GRAFICO_DEFEITOS_REQUEST, ASAICHI_GRAFICO_DEFEITOS_SUCCESS, ASAICHI_LIST_REQUEST,
  ASAICHI_LIST_SUCCESS,
  ASAICHI_PRODUCAO_DIARIA_REQUEST,
  ASAICHI_PRODUCAO_DIARIA_SUCCESS, ASAICHI_PRODUCAO_MENSAL_REQUEST, ASAICHI_PRODUCAO_MENSAL_SUCCESS,
  ASAICHI_PRODUCAO_SEMANAL_REQUEST, ASAICHI_PRODUCAO_SEMANAL_SUCCESS,
  ASAICHI_TABELA_DEFEITOS_REQUEST,
  ASAICHI_TABELA_DEFEITOS_SUCCESS,
  ASAICHI_TABELA_PRODUCAO_REQUEST,
  ASAICHI_TABELA_PRODUCAO_SUCCESS,
  ASAICHI_TABELA_PRODUTIVIDADE_REQUEST,
  ASAICHI_TABELA_PRODUTIVIDADE_SUCCESS
} from "../actionTypes";

const initialState = {
  data: {},
  loadingFiltros: false,
  tabelaProducao: null,
  loadingTabelaProducao: false,
  tabelaDefeitos: null,
  loadingTabelaDefeitos: false,
  tabelaProdutividade: null,
  loadingTabelaProdutividade: false,
  producaoDiaria: null,
  loadingProducaoDiaria: false,
  producaoSemanal: null,
  loadingProducaoSemanal: false,
  producaoMensal: null,
  loadingProducaoMensal: false,
  graficoDefeitos: null,
  loadingGraficoDefeitos: false
}

export function asaichiReducer(state=initialState, action){
  switch(action.type){
    case ASAICHI_LIST_REQUEST:
      return {
        ...state,
        loadingFiltros: true
      }
    case ASAICHI_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        loadingFiltros: false
      }
    case ASAICHI_TABELA_PRODUCAO_REQUEST:
      return {
        ...state,
        loadingTabelaProducao: true
      }
    case ASAICHI_TABELA_PRODUCAO_SUCCESS:
      return {
        ...state,
        loadingTabelaProducao: false,
        tabelaProducao: action.data.tabelaProducao
      }
    case ASAICHI_TABELA_DEFEITOS_REQUEST:
      return {
        ...state,
        loadingTabelaDefeitos: true
      }
    case ASAICHI_TABELA_DEFEITOS_SUCCESS:
      return {
        ...state,
        loadingTabelaDefeitos: false,
        tabelaDefeitos: action.data.tabelaDefeitos
      }
    case ASAICHI_TABELA_PRODUTIVIDADE_REQUEST:
      return {
        ...state,
        loadingTabelaProdutividade: true
      }
    case ASAICHI_TABELA_PRODUTIVIDADE_SUCCESS:
      return {
        ...state,
        loadingTabelaProdutividade: false,
        tabelaProdutividade: action.data.tabelaProdutividade
      }
    case ASAICHI_PRODUCAO_DIARIA_REQUEST:
      return {
        ...state,
        loadingProducaoDiaria: true
      }
    case ASAICHI_PRODUCAO_DIARIA_SUCCESS:
      return {
        ...state,
        loadingProducaoDiaria: false,
        producaoDiaria: action.data.producaoDiaria
    }
    case ASAICHI_PRODUCAO_SEMANAL_REQUEST:
      return {
        ...state,
        loadingProducaoSemanal: true
      }
    case ASAICHI_PRODUCAO_SEMANAL_SUCCESS:
      return {
        ...state,
        loadingProducaoSemanal: false,
        producaoSemanal: action.data.producaoSemanal
      }
    case ASAICHI_PRODUCAO_MENSAL_REQUEST:
      return {
        ...state,
        loadingProducaoMensal: true
      }
    case ASAICHI_PRODUCAO_MENSAL_SUCCESS:
      return {
        ...state,
        loadingProducaoMensal: false,
        producaoMensal: action.data.producaoMensal
      }
    case ASAICHI_GRAFICO_DEFEITOS_REQUEST:
      return {
        ...state,
        loadingGraficoDefeitos: true
      }
    case ASAICHI_GRAFICO_DEFEITOS_SUCCESS:
      return {
        ...state,
        loadingGraficoDefeitos: false,
        graficoDefeitos: action.data.graficoDefeitos
      }
    default:
      return state
  }
}
