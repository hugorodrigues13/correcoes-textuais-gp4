import {
  DEFEITO_PREPARAR_EDITAR_REQUEST,
  DEFEITO_SALVAR_REQUEST,
  DEFEITO_PREPARAR_NOVO_REQUEST,
  DEFEITO_LIST_REQUEST,
  DEFEITO_PREPARAR_EDITAR_SUCCESS,
  DEFEITO_PREPARAR_NOVO_SUCCESS,
  DEFEITO_LIST_SUCCESS,
  DEFEITO_SALVAR_SUCCESS, DEFEITO_ATIVAR_OU_DESATIVAR_REQUEST,
} from "../actionTypes";

const initialState = {
  data: null,
  statusLoading: []
};

export function defeitoReducer(state = initialState, action) {
  switch(action.type) {
    case DEFEITO_PREPARAR_EDITAR_REQUEST:
    case DEFEITO_PREPARAR_NOVO_REQUEST:
    case DEFEITO_LIST_REQUEST:
    case DEFEITO_SALVAR_REQUEST:
      return {
        ...state, error: "", statusLoading: []
      };
    case DEFEITO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        statusLoading: []
      };
    case DEFEITO_SALVAR_SUCCESS:
      return {
        ...state,
        entityInstance: {}
      };
    case DEFEITO_PREPARAR_NOVO_SUCCESS:
    case DEFEITO_PREPARAR_EDITAR_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        listGrupoRecurso: action.data.listGrupoRecurso
      };
    case DEFEITO_ATIVAR_OU_DESATIVAR_REQUEST:
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
