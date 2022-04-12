import {TURNOS_LISTAR_SUCCESS, TURNOS_PREPARE_EDIT_SUCCESS, TURNOS_PREPARE_NEW_SUCCESS} from "../actionTypes";

const initialState = {
  data: {},
  entityInstance: {},
  dias: [],
}

export function turnosReducer(state=initialState, action){
  switch (action.type){
    case TURNOS_LISTAR_SUCCESS:
      return {
        ...state,
        data: action.data,
      }
    case TURNOS_PREPARE_EDIT_SUCCESS:
    case TURNOS_PREPARE_NEW_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        dias: action.data.dias,
      }
    default:
      return state
  }
}
