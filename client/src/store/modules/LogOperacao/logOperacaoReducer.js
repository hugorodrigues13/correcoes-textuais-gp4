import {
  LOG_OPERACAO_LIST_REQUEST,
  LOG_OPERACAO_LIST_SUCCESS,
  LOG_OPERACAO_GET_ID_REQUEST,
  LOG_OPERACAO_GET_ID_SUCCESS,
  LOG_OPERACAO_ERROR
} from "../actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: ""
};

export function logOperacaoReducer(state = initialState, action) {
  switch (action.type) {
    case LOG_OPERACAO_GET_ID_REQUEST:
    case LOG_OPERACAO_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: ""
      };
    case LOG_OPERACAO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false
      };
    case LOG_OPERACAO_GET_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        data: { ...state.data, entity: action.entity }
      };
    case LOG_OPERACAO_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
