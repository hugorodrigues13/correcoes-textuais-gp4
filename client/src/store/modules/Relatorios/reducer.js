import {
  RELATORIOS_GERAR_SERIAL_SUCCESS,
  RELATORIOS_GET_DADOS_INICIAIS_SUCCESS, RELATORIOS_PESQUISAR_DADOS_SUCCESS,
} from "../actionTypes";

const initialState = {
  data: {},
  statusOrdemFabricacao: [],
  linhasProducao: [],
  gruposLinhas: [],
  dadosSeriais: []
};

export function relatoriosReducer(state = initialState, action){
  switch (action.type){
    case RELATORIOS_GERAR_SERIAL_SUCCESS: {
      return {
        ...state,
        data: action.data
      }
    }
    case RELATORIOS_GET_DADOS_INICIAIS_SUCCESS: {
      return {
        ...state,
        statusOrdemFabricacao: action.data.statusOrdemFabricacao,
        linhasProducao: action.data.linhasProducao,
        gruposLinhas: action.data.gruposLinhas,
      }
    }
    case RELATORIOS_PESQUISAR_DADOS_SUCCESS: {
      return {
        ...state,
        dadosSeriais: {...action.dadosAntigos, ...action.data}
      }
    }
    default: {
      return state
    }
  }
}
