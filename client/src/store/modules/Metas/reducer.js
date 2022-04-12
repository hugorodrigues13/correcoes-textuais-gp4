import {
  METAS_LIST_SUCCESS,
  METAS_PREPARE_NEW_SUCCESS,
  METAS_PREPARE_EDIT_SUCCESS, METAS_LIST_REQUEST,
} from "../actionTypes";

const initialState = {
  entities: [],
  total: 0,
  data: {linhasDeProducao: [], entities: []},
  linhasDeProducao: [],
  entityInstance: {},
}

export function metasReducer(state = initialState, action){
  switch (action.type){
    case METAS_LIST_REQUEST: {
      return {
        ...state,
        linhasDeProducao: []
      }
    }
    case METAS_LIST_SUCCESS:
      return {
        ...state,
        data: action.data
      }
    case METAS_PREPARE_EDIT_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        linhasDeProducao: action.data.linhasDeProducao,
      }
    case METAS_PREPARE_NEW_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        linhasDeProducao: action.data.linhasDeProducao,
      }
    default:
      return state
  }
}
