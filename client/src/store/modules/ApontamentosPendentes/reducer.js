import {APONTAMENTOS_PENDENTES_LIST_SUCCESS} from "../actionTypes";

const initialState = {
  data: {}
}

export function apontamentosPendentesReducer(state=initialState, action){
  switch (action.type){
    case APONTAMENTOS_PENDENTES_LIST_SUCCESS:
      return {
        ...state,
        data: action.data
      }
    default:
      return state
  }
}
