import {
  MOTIVO_DE_PARADA_ATIVAR_OU_DESATIVAR_REQUEST,
  MOTIVO_DE_PARADA_LIST_SUCCESS,
  MOTIVO_DE_PARADA_PREPARE_EDIT_SUCCESS, MOTIVO_DE_PARADA_PREPARE_NEW_SUCCESS
} from "../actionTypes";

const initialState = {
  entities: [],
  total: 0,
  tipos: [],
  listGrupoRecurso: [],
  entityInstance: {},
  statusLoading: []
}

export function motivoDeParadaReducer(state = initialState, action){
  switch (action.type){
    case MOTIVO_DE_PARADA_LIST_SUCCESS:
      return {
        ...state,
        entities: action.data.entities,
        total: action.data.total,
        tipos: action.data.tipos,
        statusLoading: []
      }
    case MOTIVO_DE_PARADA_PREPARE_EDIT_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        listGrupoRecurso: action.data.listGrupoRecurso,
        tipos: action.data.tipos,
      }
    case MOTIVO_DE_PARADA_PREPARE_NEW_SUCCESS:
      return {
        ...state,
        entityInstance: {},
        listGrupoRecurso: action.data.listGrupoRecurso,
        tipos: action.data.tipos,
      }
    case MOTIVO_DE_PARADA_ATIVAR_OU_DESATIVAR_REQUEST:
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
