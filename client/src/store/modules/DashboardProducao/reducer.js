import {
  DASHBOARD_PRODUCAO_LIST_SUCCESS,
  DASHBOARD_PRODUCAO_LIST_REQUEST,
  DASHBOARD_PRODUCAO_ERROR,
  DASHBOARD_PRODUCAO_INDICADORES_REQUEST,
  DASHBOARD_PRODUCAO_SERIAIS_DIA_REQUEST,
  DASHBOARD_PRODUCAO_STATUS_SERIAIS_REQUEST,
  DASHBOARD_PRODUCAO_INDICADORES_SUCCESS,
  DASHBOARD_PRODUCAO_SERIAIS_DIA_SUCCESS, DASHBOARD_PRODUCAO_STATUS_SERIAIS_SUCCESS
} from "../actionTypes"

const initialState = {
  entityInstance: {},
  seriaisApontadosNasUltimas24Horas: [],
  statusSeriais: [],
  data: {},
  loadingUltimas24Horas: false,
  loadingIndicadores: false,
  loadingStatusSeriais: false,
  gruposLinhas: [],
  linhasProducao: [],
  recursos: [],
  gruposRecursos: [],
  turnos: [],
  error: ""
};

export function dashboardProducaoReducer(state = initialState, action) {
  switch (action.type) {
    case DASHBOARD_PRODUCAO_LIST_REQUEST:
      return {
        ...state,
        error: ""
      };
    case DASHBOARD_PRODUCAO_INDICADORES_REQUEST:
      return {
        ...state,
        loadingIndicadores: true,
      };
    case DASHBOARD_PRODUCAO_SERIAIS_DIA_REQUEST:
      return {
        ...state,
        loadingUltimas24Horas: true,
      }
    case DASHBOARD_PRODUCAO_STATUS_SERIAIS_REQUEST:
      return {
        ...state,
        loadingStatusSeriais: true,
      }
    case DASHBOARD_PRODUCAO_LIST_SUCCESS:
      return {
        ...state,
        gruposLinhas: action.data.gruposLinhas,
        linhasProducao: action.data.linhasProducao,
        recursos: action.data.recursos,
        gruposRecursos: action.data.gruposRecursos,
        turnos: action.data.turnos,
      };
    case DASHBOARD_PRODUCAO_INDICADORES_SUCCESS:
      return {
        ...state,
        loadingIndicadores: false,
        lotesAbertos: action.data.lotesAbertos,
        lotesFechados: action.data.lotesFechados,
      };
    case DASHBOARD_PRODUCAO_SERIAIS_DIA_SUCCESS:
      return {
        ...state,
        loadingUltimas24Horas: false,
        seriaisApontadosNasUltimas24Horas: action.data.dadosPorHora,
      };
    case DASHBOARD_PRODUCAO_STATUS_SERIAIS_SUCCESS:
      return {
        ...state,
        loadingStatusSeriais: false,
        statusSeriais: action.data.statusSeriais,
      };
    case DASHBOARD_PRODUCAO_ERROR:
      return {
        ...state,
        error: action.error,
      }
    default:
      return state
  }
}
