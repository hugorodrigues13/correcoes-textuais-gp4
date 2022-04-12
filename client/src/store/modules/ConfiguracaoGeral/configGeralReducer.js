import {
  CONF_GERAL_LIST_REQUEST,
  CONF_GERAL_LIST_SUCCESS,
  CONF_GERAL_UPDATE_VALOR_REQUEST,
  CONF_GERAL_UPDATE_VALOR_SUCCESS,
  CONF_GERAL_ERROR
} from "../actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: ""
};

export function confGeralReducer(state = initialState, action) {
  switch (action.type) {
    case CONF_GERAL_UPDATE_VALOR_REQUEST:
    case CONF_GERAL_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: ""
      };
    case CONF_GERAL_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false
      };
    case CONF_GERAL_UPDATE_VALOR_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          entities: state.data.entities.map(object => {
            if (object.id === action.data.id) {
              return { ...object, valor: action.data.valor };
            }
            return { ...object };
          })
        },
        loading: false
      };
    case CONF_GERAL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}
