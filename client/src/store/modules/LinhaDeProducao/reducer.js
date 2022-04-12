import {
  LINHA_DE_PRODUCAO_SALVAR_REQUEST, LINHA_DE_PRODUCAO_SALVAR_SUCCESS,
  LINHA_DE_PRODUCAO_LIST_REQUEST, LINHA_DE_PRODUCAO_LIST_SUCCESS,
  LINHA_DE_PRODUCAO_DELETE_REQUEST, LINHA_DE_PRODUCAO_DELETE_SUCCESS,
  LINHA_DE_PRODUCAO_EDITAR_REQUEST, LINHA_DE_PRODUCAO_EDITAR_SUCCESS,
  LINHA_DE_PRODUCAO_PREPARAR_NOVO_REQUEST, LINHA_DE_PRODUCAO_PREPARAR_NOVO_SUCCESS,
  LINHA_DE_PRODUCAO_PREPARAR_EDITAR_REQUEST, LINHA_DE_PRODUCAO_PREPARAR_EDITAR_SUCCESS,
  LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_REQUEST, LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_SUCCESS,
  LINHA_DE_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
  LINHA_DE_PRODUCAO_ERROR,
} from "../actionTypes";

const initialState = {
  data: {},
  entityInstance: {},
  versoes: null,
  retornoEditar: false,
  statusLoading: [],
  error: "",
}

export function linhaDeProducaoReducer(state = initialState, action) {
  switch(action.type){
    case LINHA_DE_PRODUCAO_LIST_REQUEST:
    case LINHA_DE_PRODUCAO_LIST_SUCCESS:
      return {
        ...action.data,
        statusLoading: [],
        error: [],
      };
    case LINHA_DE_PRODUCAO_SALVAR_REQUEST:
    case LINHA_DE_PRODUCAO_SALVAR_SUCCESS:
      return{
        ...state,
        entityInstance: {isUltimaVersao: true},
        error: action.data
      }
    case LINHA_DE_PRODUCAO_DELETE_REQUEST:
    case LINHA_DE_PRODUCAO_DELETE_SUCCESS:
    case LINHA_DE_PRODUCAO_EDITAR_REQUEST:
    case LINHA_DE_PRODUCAO_PREPARAR_NOVO_REQUEST:
    case LINHA_DE_PRODUCAO_EDITAR_SUCCESS:
      return {
        ...state,
        retornoEditar: true,
        entityInstance: action.data,
        error: [],
      }
    case LINHA_DE_PRODUCAO_PREPARAR_EDITAR_REQUEST:
      return {
        ...state,
        error: []
      }
    case LINHA_DE_PRODUCAO_PREPARAR_NOVO_SUCCESS:
    case LINHA_DE_PRODUCAO_PREPARAR_EDITAR_SUCCESS:
      return {
        ...state,
        entityInstance: {...action.data.entityInstance, isUltimaVersao: action.data.isUltimaVersao},
        listGrupoRecurso: action.data.listGrupoRecurso,
        retornoEditar: false,
        error: [],
      };
    case LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_REQUEST:
      return {
        ...state,
        versoes: null
      }
    case LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_SUCCESS:
      const {linhasProducao} = action.data;
      return {
        ...state,
        versoes: linhasProducao
      }
    case LINHA_DE_PRODUCAO_ERROR:
      return {
        ...state,
        error: action.error
      }
    case LINHA_DE_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST:
      let novoLoading = state.statusLoading;
      novoLoading.push(action.objeto.id);
      return{
        ...state,
        statusLoading: novoLoading,
        error: ""
      };
    default:
      return state;
  }
}
