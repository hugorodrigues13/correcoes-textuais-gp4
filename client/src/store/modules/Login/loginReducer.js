import {
  CHANGE_SESSION_STATE,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_PERMISSAO_REQUEST,
  LOGIN_PERMISSAO_SUCCESS,
  LOGIN_CLEAN, LOGIN_SET_LANGUAGE
} from "../actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: "",
  permissoes: [],
  language: "pt-BR"
};

export function sessaoReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SESSION_STATE:
      return {
        ...state,
        sessao: action.sessao
      };
    case LOGIN_PERMISSAO_REQUEST:
    case LOGIN_REQUEST: {

      return {
        ...state,
        loading: true,
        error: ""
      };
    }
    case LOGIN_SUCCESS:
      return {
        ...state,
        data: action.user,
        language: action.user.linguagem,
        loading: false
      };
    case LOGIN_CLEAN:
      return {
        ...initialState,
        language: state.language
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case LOGIN_PERMISSAO_SUCCESS: {
      return {
        ...state,
        loading: false,
        permissoes: action.permissoes
      };
    }
    case LOGIN_SET_LANGUAGE:
      return {
        ...state,
        language: action.language
      };
    default:
      return state;
  }
}
