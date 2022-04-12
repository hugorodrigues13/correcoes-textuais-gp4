import {
  SERIAL_LIST_REQUEST,
  SERIAL_LIST_SUCCESS,
  SERIAL_ERROR,
  SERIAL_GERAR_ETIQUETA_SUCCESS,
  SERIAL_LIST_HISTORICO_SUCCESS,
  SERIAL_SUCATEAR_SUCCESS,
  SERIAL_FOLHA_IMPRESSAO_DATA_SUCCESS, SERIAL_VALORES_INICIAIS_REQUEST, SERIAL_VALORES_INICIAIS_SUCCESS,
} from "../actionTypes"

const initialState = {
  data: {},
  etiqueta: null,
  historico: [],
  sucateado: null,
  codigoGerado: null,
  dataSucateamento: null,
  podeDesfazerTodos: true,
  apontamentoOF: null,
  error: ""
};

export function serialReducer(state = initialState, action) {
  switch(action.type) {
    case SERIAL_FOLHA_IMPRESSAO_DATA_SUCCESS:
      console.log(action)
      return {
        ...state,
        folhaImpressao: action.data,
      }
    case SERIAL_LIST_REQUEST:
    case SERIAL_VALORES_INICIAIS_REQUEST:
      return {
        ...state,
        error: ""
      };
    case SERIAL_LIST_SUCCESS:
    case SERIAL_VALORES_INICIAIS_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case SERIAL_GERAR_ETIQUETA_SUCCESS:
      return {
        ...state,
        etiqueta: action.data.etiqueta,
      }
    case SERIAL_LIST_HISTORICO_SUCCESS:
      return {
        ...state,
        historico: action.data.historico,
        sucateado: action.data.sucateado,
        dataSucateamento: action.data.dataSucateamento,
        codigoGerado: action.data.codigoGerado,
        apontamentoOF: action.data.apontamentoOF,
        podeDesfazerTodos: action.data.podeDesfazerTodos,
      }
    case SERIAL_SUCATEAR_SUCCESS:
      return state
    case SERIAL_ERROR:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}
