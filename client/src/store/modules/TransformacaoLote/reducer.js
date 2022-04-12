import {
  TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_SUCCESS, TRANSFORMACAO_LOTE_DIVIDIR_SUCCESS,
  TRANSFORMACAO_LOTE_PESQUISAR_LOTES_SUCCESS,
  TRANSFORMACAO_LOTE_RESETAR
} from "../actionTypes";

const initialState = {
  data: {},
  caixas: [],
  lotesInfo: {},
}

export function transformacaoLoteReducer(state=initialState, action){
  switch(action.type){
    case TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_SUCCESS:
      return {
        ...state,
        caixas: action.data.caixas,
      }
    case TRANSFORMACAO_LOTE_PESQUISAR_LOTES_SUCCESS:
      return {
        ...state,
        lotesInfo: {...state.lotesInfo, ...action.data}
      }
    case TRANSFORMACAO_LOTE_RESETAR:
      return {
        ...state,
        caixas: [],
        lotesInfo: {},
      }
    default:
      return state
  }
}
