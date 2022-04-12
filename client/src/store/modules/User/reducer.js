import {
  USER_LIST_ALL_REQUEST,
  USER_LIST_ALL_SUCCESS,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_ATIVAR_OU_DESATIVAR_REQUEST,
  USER_SALVAR_REQUEST,
  USER_SALVAR_SUCCESS,
  USER_ALTERAR_REQUEST,
  USER_ALTERAR_SUCCESS,
  USER_CURRENT_REQUEST,
  USER_CURRENT_SUCCESS,
  USER_ERROR,
  USER_PREPARAR_NOVO_REQUEST, USER_PREPARAR_NOVO_SUCCESS,
  USER_PREPARAR_EDITAR_PERFIL_REQUEST, USER_PREPARAR_EDITAR_PERFIL_SUCCESS,
  USER_PREPARAR_EDITAR_REQUEST, USER_PREPARAR_EDITAR_SUCCESS,
  USER_EDITAR_REQUEST, USER_EDITAR_SUCCESS,
  USER_GRUPO_RECURSO_REQUEST, USER_GRUPO_RECURSO_SUCCESS,
  USER_RECURSO_REQUEST, USER_RECURSO_SUCCESS, USER_SET_USER_DATA, USER_SET_COLUNAS_SUCCESS, USER_GET_COLUNAS_SUCCESS
} from "../actionTypes";

const initialState = {
  data: null,
  error: "",
  entityInstance: {},
  perfis: [],
  acessos: [],
  planejadores: [],
  statusLoading: [],
  loading: false,
  colunas: []
};

export function usersReducer(state = initialState, action) {
  switch (action.type) {
    case USER_GET_COLUNAS_SUCCESS:
      return {
        ...state,
        colunas: action.data
      }
    case USER_LIST_ALL_REQUEST:
      return {
        ...state,
        entityInstance: {},
        statusLoading: [],
        data: null,
        error: "",
        loading: true
      };
    case USER_PREPARAR_EDITAR_REQUEST:
    case USER_PREPARAR_NOVO_REQUEST:
    case USER_PREPARAR_EDITAR_PERFIL_REQUEST:
    case USER_CURRENT_REQUEST:
    case USER_SALVAR_REQUEST:
    case USER_DELETE_REQUEST:
    case USER_GRUPO_RECURSO_REQUEST:
      return {
        ...state,
        entityInstance: {},
        statusLoading: [],
        data: null,
        error: ""
      };
    case USER_ATIVAR_OU_DESATIVAR_REQUEST:
      let novoLoading = state.statusLoading;
      novoLoading.push(action.objeto.id);
      return{
        ...state,
        statusLoading: novoLoading,
        error: ""
      };
    case USER_ALTERAR_REQUEST:
    case USER_EDITAR_REQUEST:
      return{
        ...state,
        entityInstance: action.entity,
        alteraSenha:false,
        error: ""
      };
    case USER_PREPARAR_NOVO_SUCCESS:
      return {
        ...action.data,
        organizacoes: action.data.organizacoes,
        perfis: action.data.perfis,
        entityInstance: action.data.entityInstance,
        acessos: action.data.acessos,
        planejadores: action.data.planejadores,
      };
    case USER_PREPARAR_EDITAR_PERFIL_SUCCESS:
      return{
        ...action.data,
        perfis: action.data.perfis,
        acessos: action.data.acessos,
        planejadores: action.data.planejadores,
        entityInstance: action.data.entityInstance,
      };
    case USER_PREPARAR_EDITAR_SUCCESS:

      return{
        ...action.data,
        organizacoes: action.data.organizacoes,
        perfis: action.data.perfis,
        acessos: action.data.acessos,
        planejadores: action.data.planejadores,
        entityInstance: action.data.entityInstance,
      };
    case USER_CURRENT_SUCCESS:
    case USER_LIST_ALL_SUCCESS:
      return {
        ...state,
        data: action.data,
        statusLoading: [],
        loading: false
      };
    case USER_DELETE_SUCCESS:
      return {
        ...state,
      };
    case USER_SALVAR_SUCCESS:
      return {
        ...state,
        errors: [],
        entityInstance: {}
      };
    case USER_EDITAR_SUCCESS:
    case USER_ALTERAR_SUCCESS:
      return {
        ...state,
      };
    case USER_GRUPO_RECURSO_SUCCESS:
      return{
          ...state,
        grupoRecursoList: action.data.entities,
      };
    case USER_RECURSO_SUCCESS:
      return {
        ...state,
        recursoList: action.data.recursos,
        defeitos: action.data.defeitos
      };
    case USER_SET_USER_DATA:
      return{
        ...state,
        data: {...state.data, recursoSelecionado: action.data}
      };
    case USER_ERROR:
      return {
        ...state,
        error: action.error,
        statusLoading: []
      };
    default:
      return state;
  }
}
