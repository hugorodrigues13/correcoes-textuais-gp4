import {
  AUDITORIA_LIST_REQUEST,
  AUDITORIA_LIST_SUCCESS,
  AUDITORIA_GET_ID_REQUEST,
  AUDITORIA_GET_ID_SUCCESS,
  AUDITORIA_ERROR
} from "../actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: ""
};

export function auditoriaReducer(state = initialState, action) {
  switch (action.type) {
    case AUDITORIA_GET_ID_REQUEST:
    case AUDITORIA_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: ""
      };
    case AUDITORIA_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false
      };
    case AUDITORIA_GET_ID_SUCCESS:
      return {
        ...state,
        data: { ...state.data, auditoriaEntity: action.data }
      };
    case AUDITORIA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
