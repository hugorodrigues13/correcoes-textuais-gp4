import {
  ACESSO_LIST_REQUEST,
  ACESSO_LIST_SUCCESS,
  ACESSO_SALVAR_REQUEST,
  ACESSO_SALVAR_SUCCESS,
  ACESSO_DELETE_REQUEST,
  ACESSO_DELETE_SUCCESS,
  ACESSO_EDITAR_REQUEST,
  ACESSO_EDITAR_SUCCESS,
  ACESSO_PREPARAR_EDITAR_REQUEST,
  ACESSO_PREPARAR_EDITAR_SUCCESS,
  ACESSO_PREPARAR_NOVO_REQUEST,
  ACESSO_PREPARAR_NOVO_SUCCESS,
  ACESSO_FILTRAR_FORNECEDOR
} from "../actionTypes";

const initialState = {
  data: {},
  filter: {},
  error: "",
  loading: false
};

export function acessoReducer(state = initialState, action) {
  switch (action.type) {
    case ACESSO_LIST_REQUEST:
      return {
        ...state,
        error: "",
        loading: true
      }
    case ACESSO_EDITAR_REQUEST:
    case ACESSO_PREPARAR_NOVO_REQUEST:
    case ACESSO_PREPARAR_EDITAR_REQUEST:
    case ACESSO_SALVAR_REQUEST:
    case ACESSO_DELETE_REQUEST:
      return {
        ...state,
        error: ""
      };
    case ACESSO_LIST_SUCCESS:
      if( state.filter !== {} && state.filter !== undefined &&
          state.filter.hasOwnProperty("organizacao") && state.filter.organizacao !== undefined ) {
        action.data.listFornecedorFiltrada = state.data.listFornecedor.filter(f => f.organizationID.toString() === state.filter.organizacao)
      }
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    case ACESSO_PREPARAR_NOVO_SUCCESS:
      state = {...state, data: action.data};
      return {
        ...action.data,
      };
    case ACESSO_PREPARAR_EDITAR_SUCCESS:
      state = {...state, data: action.data};
      return {
        ...action.data
      };
    case ACESSO_DELETE_SUCCESS:
    case ACESSO_SALVAR_SUCCESS:
      return {
        ...state,
        entityInstance: {}
      };
    case ACESSO_FILTRAR_FORNECEDOR:
      const listaFiltrada = state.data.listFornecedor.filter(f => f.organizationID == action.organizationID)
      return{
        ...state,
        filter: {organizacao: action.organizationID},
        data: {...state.data, listFornecedorFiltrada: listaFiltrada}
      };
    default:
      return state
  }
}
