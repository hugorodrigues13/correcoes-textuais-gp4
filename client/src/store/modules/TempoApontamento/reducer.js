import {TEMPO_APONTAMENTO_LIST_SUCCESS} from "../actionTypes";

const initialState = {
  data: {}
}

export function tempoApontamentoReducer(state=initialState, action){
  switch (action.type){
    case TEMPO_APONTAMENTO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data
      }
    default:
      return state
  }
}
