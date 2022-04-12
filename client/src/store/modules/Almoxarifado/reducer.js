import {
  ALMOXARIFADO_CHANGE_PAGINATION_SUCCESS, ALMOXARIFADO_LIST_MATERIAIS_SUCCESS,
  ALMOXARIFADO_LIST_REQUEST,
  ALMOXARIFADO_LIST_SUCCESS,
} from "../actionTypes";

const initialState = {
  data: [],
  filtros: {},
  page: 1,
  pageSize: 12,
  error: "",
  materiais: {}
};

export function almoxarifadoReducer(state = initialState, action) {
  switch (action.type) {
    case ALMOXARIFADO_LIST_REQUEST:
      return {
        ...state,
        filtros: action.filtros,
        error: ""
      };
    case ALMOXARIFADO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case ALMOXARIFADO_CHANGE_PAGINATION_SUCCESS:
      return {
        ...state,
        page: action.page,
        pageSize: action.pageSize
      }
    case ALMOXARIFADO_LIST_MATERIAIS_SUCCESS:
      return {
        ...state,
        materiais: action.data
      }
    default:
      return state
  }
}
