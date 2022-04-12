import {
  PRODUTO_ETIQUETA_DELETE_REQUEST,
  PRODUTO_ETIQUETA_DELETE_SUCCEESS,
  PRODUTO_ETIQUETA_EDITAR_REQUEST,
  PRODUTO_ETIQUETA_EDITAR_SUCCESS,
  PRODUTO_ETIQUETA_LIST_REQUEST,
  PRODUTO_ETIQUETA_LIST_SUCCESS,
  PRODUTO_ETIQUETA_PREPARAR_EDITAR_REQUEST,
  PRODUTO_ETIQUETA_PREPARAR_EDITAR_SUCCESS,
  PRODUTO_ETIQUETA_PREPARAR_NOVO_REQUEST,
  PRODUTO_ETIQUETA_PREPARAR_NOVO_SUCCESS,
  PRODUTO_ETIQUETA_SALVAR_REQUEST,
  PRODUTO_ETIQUETA_SALVAR_SUCCESS,
  PRODUTO_ETIQUETA_ERROR,
} from "../actionTypes";

const initialState = {
  data: null
};

export function produtoEtiquetaReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUTO_ETIQUETA_EDITAR_REQUEST:
    case PRODUTO_ETIQUETA_PREPARAR_NOVO_REQUEST:
    case PRODUTO_ETIQUETA_LIST_REQUEST:
    case PRODUTO_ETIQUETA_SALVAR_REQUEST:
      return{
        ...state, error: ""
      };
    case PRODUTO_ETIQUETA_LIST_SUCCESS:
      return {
        ...state,
        data: action.data
      };
    case PRODUTO_ETIQUETA_SALVAR_SUCCESS:
      return {
        ...state,
        entityInstance: {}
      };
    case PRODUTO_ETIQUETA_PREPARAR_NOVO_SUCCESS:
    case PRODUTO_ETIQUETA_PREPARAR_EDITAR_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        listGrupoRecurso: action.data.listGrupoRecurso
      };
    case PRODUTO_ETIQUETA_ERROR:
      return {
        ...state,
        error: action.error
          };
    default:
      return state
  }
}

