import * as ACTION from "../actionTypes";

const initialState = {
  data: {},
  error: [],
  loading: false
};

export function paradaReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION.PARADA_DIVIDIR_REQUEST:
    case ACTION.PARADA_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case ACTION.PARADA_LIST_SUCCESS:
      return {
        ...state,
        ...action.data,
        loading: false,
      }
    case ACTION.PARADA_LIST_MOTIVO_PARADA_SUCCESS:
      return {
        ...state,
        listMotivo: action.data.motivos
      }
    case ACTION.PARADA_LIST_MOTIVO_PARADA_REQUEST:
    case ACTION.PARADA_LIST_UPDATE_MOTIVO_REQUEST:
    case ACTION.PARADA_LIST_UPDATE_MOTIVO_SUCCESS:
      return {
        ...state
      }
    case ACTION.PARADA_DIVIDIR_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case ACTION.PARADA_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
