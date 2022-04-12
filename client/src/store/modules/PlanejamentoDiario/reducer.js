import {
  PLANEJAMENTO_DIARIO_LISTAR_SUCCESS,
  PLANEJAMENTO_DIARIO_PREPARE_EDIT_SUCCESS,
  PLANEJAMENTO_DIARIO_PREPARE_NEW_SUCCESS
} from "../actionTypes";

const initialState = {
  data: {},
  entityInstance: {},
  linhasProducao: [],
  turnos: [],
  gruposLinhaProducao: [],
  dias: [],
}

export function planejamentoDiarioReducer(state=initialState, action){
  switch (action.type){
    case PLANEJAMENTO_DIARIO_LISTAR_SUCCESS:
      return {
        ...state,
        data: action.data,
      }
    case PLANEJAMENTO_DIARIO_PREPARE_EDIT_SUCCESS:
    case PLANEJAMENTO_DIARIO_PREPARE_NEW_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        linhasProducao: action.data.linhasProducao,
        gruposLinhaProducao: action.data.gruposLinhaProducao,
        turnos: action.data.turnos,
        dias: action.data.dias,
      }
    default:
      return state
  }
}
