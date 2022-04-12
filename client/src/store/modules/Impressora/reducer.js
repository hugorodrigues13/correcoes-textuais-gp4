import {
  IMPRESSORA_PREPARAR_NOVO_SUCCESS,
  IMPRESSORA_PREPARAR_NOVO_REQUEST,
  IMPRESSORA_LIST_SUCCESS,
  IMPRESSORA_LIST_REQUEST,
  IMPRESSORA_PREPARAR_EDITAR_SUCCESS,
  IMPRESSORA_PREPARAR_EDITAR_REQUEST,
  IMPRESSORA_SALVAR_REQUEST,
  IMPRESSORA_SALVAR_SUCCESS,
  IMPRESSORA_EDITAR_REQUEST,
  IMPRESSORA_EDITAR_SUCCESS,
  IMPRESSORA_ERROR
} from "../actionTypes"

const initialState = {
  entityInstance: {},
  data: {},
  tipoImpressaoList: [],
  impressorasList: [],
  error: ""
};

export function impressoraReducer(state = initialState, action) {
  switch (action.type) {
    case IMPRESSORA_PREPARAR_EDITAR_REQUEST:
    case IMPRESSORA_PREPARAR_NOVO_REQUEST:
    case IMPRESSORA_LIST_REQUEST:
    case IMPRESSORA_SALVAR_REQUEST:
      return {
        ...state,
        error: ""
      };
    case IMPRESSORA_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case IMPRESSORA_SALVAR_SUCCESS:
      return {
        ...state,
        entityInstance: {}
      };
    case IMPRESSORA_EDITAR_REQUEST:
    case IMPRESSORA_EDITAR_SUCCESS:
      return {...state};
    case IMPRESSORA_PREPARAR_NOVO_SUCCESS:
      state = { ...state, data: action.data };
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        tipoImpressaoList: action.data.tipoImpressaoList,
        display: false,
        impressorasList: action.data.impressorasList,
        error: []
      };
    case IMPRESSORA_PREPARAR_EDITAR_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        tipoImpressaoList: action.data.tipoImpressaoList,
        impressorasList: action.data.impressorasList,
        error: []
      };
    case IMPRESSORA_ERROR:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}
