import {
  FATURAMENTO_LIST_REQUEST,
  FATURAMENTO_LIST_SUCCESS,
  FATURAMENTO_ENVIO_LOTE_ROMANEIO_REQUEST,
  FATURAMENTO_ENVIO_LOTE_ROMANEIO_SUCCESS,
  FATURAMENTO_FECHAR_LOTE_INCOMPLETO_REQUEST,
  FATURAMENTO_FECHAR_LOTE_INCOMPLETO_SUCCESS,
  FATURAMENTO_ERROR,
  FATURAMENTO_CHECAR_LOTE_ROMANEIO_SUCCESS,
  FATURAMENTO_LIST_IMPRESSORAS_SUCCESS,
  FATURAMENTO_GET_CAIXAS_SUCCESS,
  FATURAMENTO_CONCLUIR_OP_REQUEST,
  FATURAMENTO_CONCLUIR_OP_SUCCESS,
} from "../actionTypes";

const initialState = {
  data: {},
  entityInstance: {},
  error: "",
  checagem: [],
  impressoras: [],
  caixas: {},
}

export function faturamentoReducer(state = initialState, action) {
  switch (action.type) {
    case FATURAMENTO_LIST_REQUEST:
    case FATURAMENTO_LIST_SUCCESS:
    case FATURAMENTO_CONCLUIR_OP_REQUEST:
    case FATURAMENTO_CONCLUIR_OP_SUCCESS:
    case FATURAMENTO_ENVIO_LOTE_ROMANEIO_REQUEST:
    case FATURAMENTO_ENVIO_LOTE_ROMANEIO_SUCCESS:
    case FATURAMENTO_FECHAR_LOTE_INCOMPLETO_REQUEST:
    case FATURAMENTO_FECHAR_LOTE_INCOMPLETO_SUCCESS:
      return {
        ...action.data,
        error: []
      }
    case FATURAMENTO_GET_CAIXAS_SUCCESS:
      return {
        ...state,
        caixas: {caixas: action.data.caixas, caixasNaoCriadas: action.data.caixasNaoCriadas},
      }
    case FATURAMENTO_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case FATURAMENTO_CHECAR_LOTE_ROMANEIO_SUCCESS:
      return {
        ...state,
        checagem: action.data.entities
      }
    case FATURAMENTO_LIST_IMPRESSORAS_SUCCESS:
      return {
        ...state,
        impressoras: action.data.impressoras,
      }
    default:
      return state;
  }
}

