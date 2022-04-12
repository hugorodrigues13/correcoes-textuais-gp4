import {
  PREFIXO_PRODUCAO_FORNECEDOR_LIST_SUCCESS,
  PREFIXO_PRODUCAO_FORNECEDOR_LIST_REQUEST,
  PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_REQUEST,
  PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_SUCCESS,
  PREFIXO_PRODUCAO_FORNECEDOR_ERROR,
  PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_REQUEST,
  PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_SUCCESS,
} from "../actionTypes"

const initialState = {
  entityInstance: {},
  data: {},
  listFornecedores: [],
  loading: false,
  desabilitarPrefixo: false,
  error:""
};

export function prefixoProducaoFornecedorReducer(state = initialState, action) {
  switch (action.type) {
    case PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_REQUEST:
    case PREFIXO_PRODUCAO_FORNECEDOR_LIST_REQUEST:
      return {
        ...state,
        entity: action.entity,
        loading: true,
      };
    case PREFIXO_PRODUCAO_FORNECEDOR_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    case PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_SUCCESS:
      const { messages } = action.data
      return {
        ...state,
        data: {
          ...state.data,
          entities: state.data.entities.map(object => {
            if (object.id === state.entity.id && messages[0].type === "SUCCESS_TYPE") {
              return { ...object, prefixoProducao: state.entity.prefixoProducao };
            }
            return { ...object };
          })
        },
        loading: false
      };
    case PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_REQUEST: {
      return {
        ...state,
        entityInstance: null,
        loading: true,
        error: ""
      }
    }
    case PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_SUCCESS: {
      let entity = {...action.data}
      return {
        ...state,
        entityInstance: entity,
        loading: true,
        desabilitarPrefixo: entity.desabilitarPrefixo,
        error: ""
      }
    }
    case PREFIXO_PRODUCAO_FORNECEDOR_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state
  }
}
