import {
  CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_SUCCESS,
  CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_REQUEST,
  CLASSE_POR_PLANEJADOR_LIST_SUCCESS,
  CLASSE_POR_PLANEJADOR_LIST_REQUEST,
  CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_SUCCESS,
  CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_REQUEST,
  CLASSE_POR_PLANEJADOR_SALVAR_REQUEST,
  CLASSE_POR_PLANEJADOR_SALVAR_SUCCESS, CLASSE_POR_PLANEJADOR_ERROR
} from "../actionTypes"

const initialState = {
  entityInstance: {},
  data: {},
  listFornecedores: [],
  error: ""
};

export function classePorPlanejadorReducer(state = initialState, action) {
  switch (action.type) {
    case CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_REQUEST:
    case CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_REQUEST:
    case CLASSE_POR_PLANEJADOR_LIST_REQUEST:
    case CLASSE_POR_PLANEJADOR_SALVAR_REQUEST:
      return {
        ...state,
        error: ""
      };
    case CLASSE_POR_PLANEJADOR_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case CLASSE_POR_PLANEJADOR_SALVAR_SUCCESS:
      return {
        ...state,
        entityInstance: {}
      };
    case CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_SUCCESS:
      state = { ...state, data: action.data };
      return {
        ...action.data,
        entityInstance: action.data.entityInstance,
        listFornecedores: action.data.listFornecedores,
        error: []
      };
    case CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_SUCCESS:
      return {
        ...action.data,
        entityInstance: action.data.entityInstance,
        listFornecedores: action.data.listFornecedores,
        error: []
      };
    case CLASSE_POR_PLANEJADOR_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state
  }
}
