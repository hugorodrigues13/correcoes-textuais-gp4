import {
  APONTAMENTO_DE_MATERIAL_APONTAR_SUCCESS,
  APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_SUCCESS,
  APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_SUCCESS,
  APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_SUCCESS,
  APONTAMENTO_DE_MATERIAL_LIST_SUCCESS,
} from "../actionTypes";

const initialState = {
  data: {},
  ordensDeProducao: [],
  materiais: [],
  lotesDisponiveis: []
}

export function apontamentoDeMaterialReducer(state=initialState, action){
  switch (action.type){
    case APONTAMENTO_DE_MATERIAL_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_REQUEST:
      return {
        ...state,
        ordensDeProducao: []
      }
    case APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_SUCCESS:
      return {
        ...state,
        ordensDeProducao: action.data.ordensDeProducao
      }
    case APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_REQUEST:
      return {
        ...state,
        materiais: []
      }
    case APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_SUCCESS:
      return {
        ...state,
        materiais: action.data.materiais
      }
    case APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_REQUEST:
      return {
        ...state,
        lotesDisponiveis: []
      }
    case APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_SUCCESS:
      return {
        ...state,
        lotesDisponiveis: action.data.lotes
      }
    case APONTAMENTO_DE_MATERIAL_APONTAR_SUCCESS:
      return {
        ...state,
        ordensDeProducao: [],
        materiais: [],
        lotesDisponiveis: []
      }
    default:
      return {
        ...state,
      }
  }
}
