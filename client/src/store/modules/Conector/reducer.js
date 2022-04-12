//IMPORT ACTION_TYPES
import {
  CONECTOR_LIST_REQUEST,
  CONECTOR_LIST_SUCCESS,
  CONECTOR_SALVAR_REQUEST,
  CONECTOR_SALVAR_SUCCESS,
  CONECTOR_DELETE_REQUEST,
  CONECTOR_DELETE_SUCCESS,
  CONECTOR_EDITAR_REQUEST,
  CONECTOR_EDITAR_SUCCESS,
  CONECTOR_PREPARAR_NOVO_REQUEST,
  CONECTOR_PREPARAR_NOVO_SUCCESS,
  CONECTOR_PREPARAR_EDITAR_REQUEST,
  CONECTOR_PREPARAR_EDITAR_SUCCESS,
  CONECTOR_ERROR,
  CONECTOR_SET_ENTITY,
} from "../actionTypes";

const initialState = {
  data: [],
  entityInstance: {}
};

export function conectorReducer(state = initialState, action) {
  switch(action.type){
    case CONECTOR_LIST_REQUEST:
        return {
          ...state,
          error: ""
        };
    case CONECTOR_SALVAR_REQUEST:
    return {...state}
    case CONECTOR_DELETE_REQUEST:
    case CONECTOR_EDITAR_REQUEST:
    case CONECTOR_PREPARAR_NOVO_REQUEST:
    case CONECTOR_PREPARAR_EDITAR_REQUEST:
    case CONECTOR_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case CONECTOR_SALVAR_SUCCESS:
      return{
        ...state,
        entityInstance: {},
      }
    case CONECTOR_DELETE_SUCCESS:
    case CONECTOR_EDITAR_SUCCESS:
      return{
        ...state,
      }
    case CONECTOR_PREPARAR_NOVO_SUCCESS:
      return {
        ...action.data,
        error: [],
      };
    case CONECTOR_PREPARAR_EDITAR_SUCCESS:
      return {
        ...action.data,
        entityInstance: action.data.entityInstance,
        error: [],
      };
    case CONECTOR_ERROR:
      return {
        ...state,
        error: action.error
      };
    case CONECTOR_SET_ENTITY:
      return {
        ...state,
        entityInstance: action.entityInstance
      }
    default:
      return state;
  }
}
