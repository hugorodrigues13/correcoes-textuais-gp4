import {
  GRUPO_LINHA_PRODUCAO_LIST_REQUEST,
  GRUPO_LINHA_PRODUCAO_LIST_SUCCESS,
  GRUPO_LINHA_PRODUCAO_SALVAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_SALVAR_SUCCESS,
  GRUPO_LINHA_PRODUCAO_DELETE_REQUEST,
  GRUPO_LINHA_PRODUCAO_DELETE_SUCCESS,
  GRUPO_LINHA_PRODUCAO_EDITAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_EDITAR_SUCCESS,
  GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_SUCCESS,
  GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_REQUEST,
  GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_SUCCESS,
  GRUPO_LINHA_PRODUCAO_SET_ENTITY, GRUPO_LINHA_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
} from "../actionTypes";

const initialState = {
  data: [],
  entityInstance: {},
  listLinhaProducao: [],
  error: "",
  statusLoading: []
};

export function grupoLinhaProducaoReducer(state = initialState, action) {
  switch (action.type) {
    case GRUPO_LINHA_PRODUCAO_EDITAR_REQUEST:
    case GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_REQUEST:
    case GRUPO_LINHA_PRODUCAO_SALVAR_REQUEST:
    case GRUPO_LINHA_PRODUCAO_LIST_REQUEST:
    case GRUPO_LINHA_PRODUCAO_DELETE_REQUEST:
      return {
        ...state
      };
    case GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_REQUEST:
      return {
        ...state,
      }
    case GRUPO_LINHA_PRODUCAO_LIST_SUCCESS:
      return {
        ...state, data: action.data, statusLoading: []
      }
    case GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_SUCCESS:
    case GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_SUCCESS:
      return {
        ...state,
        entityInstance: action.data.entityInstance,
        listLinhaProducao: action.data.listGrupoLinhaProducao,
      };
    case GRUPO_LINHA_PRODUCAO_DELETE_SUCCESS:
    case GRUPO_LINHA_PRODUCAO_SALVAR_SUCCESS:
      let entityInstance = state.entityInstance
      if (action.data.messages[0].type !== 'ERROR_TYPE') {
        entityInstance = {}
      }

      return {
        ...state,
        entityInstance: entityInstance
      };
    case GRUPO_LINHA_PRODUCAO_EDITAR_SUCCESS:
      if (action.data.messages[0].type === 'ERROR_TYPE') {
        const linhasDeProducaoUnion = [
          ...new Set([
            ...state.entityInstance.linhasDeProducao.map(l => l.id),
            ...state.entityInstance.linhasDeProducaoInicial.map(l => l.id)
          ])
        ]

        return {
          ...state,
          entityInstance: {
            ...state.entityInstance,
            linhasDeProducao: linhasDeProducaoUnion.map(x => ({['id']: x}))
          }
        };
      } else {
        return state;
      }
    case GRUPO_LINHA_PRODUCAO_SET_ENTITY:
      return {
        ...state,
        entityInstance: action.entity
      };
    case GRUPO_LINHA_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST:
      let novoLoading = state.statusLoading;
      novoLoading.push(action.objeto.id);
      return{
        ...state,
        statusLoading: novoLoading,
        error: ""
      };
    default:
      return state
  }
}
