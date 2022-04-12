import {
    PRODUCAO_GERAR_RELATORIO_SUCCESS,
    PRODUCAO_GET_DADOS_INICIAIS_SUCCESS,
    PRODUCAO_PESQUISAR_DADOS_SUCCESS
} from '../actionTypes'

const initialState = {
    data: {},
    gruposLinhas: [],
  };
  
  export function producaoReducer(state = initialState, action){
    switch (action.type){
      case PRODUCAO_GERAR_RELATORIO_SUCCESS: {
        return {
          ...state,
          data: action.data
        }
      }
      case PRODUCAO_GET_DADOS_INICIAIS_SUCCESS: {
        return {
          ...state,
          gruposLinhas: action.data.gruposLinhas,
        }
      }
      default: {
        return state
      }
    }
  }
  