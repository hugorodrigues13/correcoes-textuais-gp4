import {
  REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_SUCCESS,
  REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_SUCCESS
} from "../actionTypes";

const initialState = {
  impressoras: [],
  dadosLotes: []
}

export function reimpressaoEtiquetasReducer(state=initialState, action){
  switch (action.type){
    case REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_SUCCESS:
      return {
        ...state,
        impressoras: action.data.impressoras
      }
    case REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_SUCCESS:
      return {
        ...state,
        dadosLotes: action.data.lotes
      }
    default:
      return {
        ...state,
      }
  }
}
