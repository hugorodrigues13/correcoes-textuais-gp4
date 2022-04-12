import {
  RECEBIMENTO_CONCLUIR_MANUALMENTE_REQUEST, RECEBIMENTO_CONCLUIR_MANUALMENTE_SUCCESS,
  RECEBIMENTO_LIST_REQUEST,
  RECEBIMENTO_LIST_SUCCESS
} from "../actionTypes";

const initialState = {
  data: {},
  loading: false
}

export function recebimentoReducer(state=initialState, action){
  switch (action.type){
    case RECEBIMENTO_LIST_REQUEST:
    case RECEBIMENTO_CONCLUIR_MANUALMENTE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case RECEBIMENTO_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data
      }
    case RECEBIMENTO_CONCLUIR_MANUALMENTE_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}
