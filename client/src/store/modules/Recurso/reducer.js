import {
  RECURSO_PREPARAR_NOVO_SUCCESS,
  RECURSO_PREPARAR_NOVO_REQUEST,
  RECURSO_LIST_SUCCESS,
  RECURSO_LIST_REQUEST,
  RECURSO_PREPARAR_EDITAR_SUCCESS,
  RECURSO_PREPARAR_EDITAR_REQUEST,
  RECURSO_PREPARAR_CLONAR_SUCCESS,
  RECURSO_SALVAR_REQUEST,
  RECURSO_SALVAR_SUCCESS, RECURSO_ERROR, RECURSO_ATIVAR_OU_DESATIVAR_REQUEST
} from "../actionTypes"

const initialState = {
  data: null,
  listConectores: [],
  tiposTeste: [],
  error: "",
  statusLoading: []
};

export function recursoReducer(state = initialState, action) {
  switch(action.type) {
    case RECURSO_PREPARAR_EDITAR_REQUEST:
    case RECURSO_PREPARAR_NOVO_REQUEST:
    case RECURSO_LIST_REQUEST:
    case RECURSO_SALVAR_REQUEST:
      return {
        ...state, error: ""
      };
    case RECURSO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        statusLoading: []
      };
    case RECURSO_SALVAR_SUCCESS:
      return{
        ...state,
        entityInstance: {}
      };
    case RECURSO_PREPARAR_NOVO_SUCCESS:
    case RECURSO_PREPARAR_EDITAR_SUCCESS:
      return {
        ...action.data,
        entityInstance: action.data.entityInstance,
        listConectores: action.data.listConectores,
        tiposTeste: action.data.tiposTeste,
        error: []
      };
    case RECURSO_PREPARAR_CLONAR_SUCCESS:
      delete entityInstance.id;
      return {
        ...action.data,
        entityInstance: action.data.entityInstance,
        listConectores: action.data.listConectores,
        tiposTeste: action.data.tiposTeste,
        error: []
      };
    case RECURSO_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case RECURSO_ATIVAR_OU_DESATIVAR_REQUEST:
      let novoLoading = state.statusLoading;
      novoLoading.push(action.objeto.id);
      return{
        ...state,
        statusLoading: novoLoading,
        error: ""
      };
    default:
      return state
  }
}
