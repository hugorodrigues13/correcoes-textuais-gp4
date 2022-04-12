import {
  DASH_PROGRAMACAO_LIST_REQUEST, DASH_PROGRAMACAO_LIST_SUCCESS
} from "../actionTypes";

const initialState = {
  data: {
    ordensProgramadas: {
      opProgramadasParaHoje: {quantidadeProduzida: 0, quantidadePendente: 0},
      opProgramadasParaAProximaSemana: {quantidadeProduzida: 0, quantidadePendente: 0},
      opProgramadasParaOProximoMes: {quantidadeProduzida: 0, quantidadePendente: 0}
    }},
  loading: false,
  error: ""
};

export function dashboardProgramacaoReducer(state = initialState, action) {
  switch (action.type) {
    case DASH_PROGRAMACAO_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: ""
      };
    case DASH_PROGRAMACAO_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    default:
      return state
  }
}
