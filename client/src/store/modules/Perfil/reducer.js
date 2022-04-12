
import {
  PERFIL_LIST_REQUEST,
  PERFIL_LIST_SUCCESS,
  PERFIL_SALVAR_REQUEST,
  PERFIL_SALVAR_SUCCESS,
  PERFIL_DELETE_REQUEST,
  PERFIL_DELETE_SUCCESS,
  PERFIL_EDITAR_REQUEST,
  PERFIL_EDITAR_SUCCESS,
  PERFIL_ERROR,
  PERFIL_PREPARAR_EDITAR_REQUEST,
  PERFIL_PREPARAR_EDITAR_SUCCESS,
  PERFIL_PREPARAR_NOVO_REQUEST,
  PERFIL_PREPARAR_NOVO_SUCCESS
} from "../actionTypes";

const initialState = {
  data: null,
  error: "",
  loading: false
};

export function perfilReducer(state = initialState, action) {
  switch (action.type) {
    case PERFIL_LIST_REQUEST:
      return {
        ...state,
        error: "",
        loading: true,
      }
    case PERFIL_EDITAR_REQUEST:
    case PERFIL_PREPARAR_NOVO_REQUEST:
    case PERFIL_PREPARAR_EDITAR_REQUEST:
    case PERFIL_DELETE_REQUEST:
    case PERFIL_SALVAR_REQUEST:
      return {
        ...state,
        error: ""
      };
    case PERFIL_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        permissoes: undefined,
        entityInstance: undefined,
        loading: false,
      };
    case PERFIL_PREPARAR_NOVO_SUCCESS:
      return {
        ...action.data,
        permissoes: action.data.permissoes,
        error: [],

      };
    case PERFIL_PREPARAR_EDITAR_SUCCESS:
      return {
        ...action.data,
        permissoes: action.data.permissoes,
        entityInstance: action.data.entityInstance,
        error: [],
      };
    case PERFIL_EDITAR_SUCCESS:
    case PERFIL_DELETE_SUCCESS:
    case PERFIL_SALVAR_SUCCESS:
      return {
        ...state,
        permissoes: undefined,
        entityInstance: undefined
      };
    case PERFIL_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
