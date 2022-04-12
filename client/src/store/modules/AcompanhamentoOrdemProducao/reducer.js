import {
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_SUCCESS,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_SUCCESS,
} from "../actionTypes";

const initialState = {
  data: {},
  entityInstance: {},
  listTipoStatusOracle: [],
  loadingOrdensAtrasadas: false,
  error: ""
}

export function acompanhamentoOrdemDeProducaoReducer(state = initialState, action) {
  switch(action.type){
    case ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_REQUEST:
    case ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_REQUEST:
      return {
        ...state,
        loadingOrdensAtrasadas: true,
      }
    case ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_SUCCESS:
      return {
        ...action.data,
        error: []
      }
    case ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_SUCCESS:
      return {
        ...state,
        opAtrasadas: action.data,
        loadingOrdensAtrasadas: false,
      }
    case ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        listTipoStatusOracle: action.data.listTipoStatusOracle,
      }
    default:
      return state;
  }
}

