import {
  GRUPO_RECURSO_LIST_REQUEST,
  GRUPO_RECURSO_LIST_SUCCESS,
  GRUPO_RECURSO_SALVAR_REQUEST,
  GRUPO_RECURSO_SALVAR_SUCCESS,
  GRUPO_RECURSO_EDITAR_REQUEST,
  GRUPO_RECURSO_EDITAR_SUCCESS,
  GRUPO_RECURSO_DELETAR_REQUEST,
  GRUPO_RECURSO_DELETAR_SUCCESS,
  GRUPO_RECURSO_PREPARAR_NOVO_REQUEST,
  GRUPO_RECURSO_PREPARAR_NOVO_SUCCESS,
  GRUPO_RECURSO_PREPARAR_EDITAR_REQUEST,
  GRUPO_RECURSO_PREPARAR_EDITAR_SUCCESS,
  GRUPO_RECURSO_ERROR, GRUPO_RECURSO_ATIVAR_OU_DESATIVAR_REQUEST
} from "../actionTypes";

const initialState = {
  data: {},
  entityInstance: {},
  recursos: [],
  defeitos: [],
  listMotivosParadas: [],
  listTiposRegras: [],
  statusLoading: [],
  error: ""
}

export function grupoRecursoReducer(state = initialState, action) {
  switch (action.type) {
    case GRUPO_RECURSO_LIST_REQUEST:
      return {
        ...state,
        error: ""
      }
    case GRUPO_RECURSO_SALVAR_REQUEST:
    case GRUPO_RECURSO_EDITAR_REQUEST:
      return {
        ...state
      }
    case GRUPO_RECURSO_DELETAR_REQUEST:
    case GRUPO_RECURSO_PREPARAR_NOVO_REQUEST:
    case GRUPO_RECURSO_PREPARAR_EDITAR_REQUEST:
    case GRUPO_RECURSO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        entityInstance: {},
        statusLoading: []
      };
    case GRUPO_RECURSO_SALVAR_SUCCESS:
      return {
        ...state,
        entityInstance: {}
      };
    case GRUPO_RECURSO_EDITAR_SUCCESS:
      return {
        ...state,
      }
    case GRUPO_RECURSO_DELETAR_SUCCESS:
    case GRUPO_RECURSO_PREPARAR_NOVO_SUCCESS:
      return {
        ...action.data,
        recursos: action.data.recursos,
        defeitos: action.data.defeitos,
        listMotivosParadas: action.data.listMotivosParadas,
        listTiposRegras: action.data.listTiposRegras,
        error: [],
      }
    case GRUPO_RECURSO_PREPARAR_EDITAR_SUCCESS:
      return {
        ...action.data,
        entityInstance: action.data.entityInstance,
        recursos: action.data.recursos,
        defeitos: action.data.defeitos,
        listMotivosParadas: action.data.listMotivosParadas,
        listTiposRegras: action.data.listTiposRegras,
        error: []
      }
    case GRUPO_RECURSO_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case GRUPO_RECURSO_ATIVAR_OU_DESATIVAR_REQUEST:
      let novoLoading = state.statusLoading;
      novoLoading.push(action.objeto.id);
      return{
        ...state,
        statusLoading: novoLoading,
        error: ""
      };
    default:
      return state;
  }
}
