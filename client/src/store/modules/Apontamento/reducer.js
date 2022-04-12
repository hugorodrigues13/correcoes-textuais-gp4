//IMPORT ACTION_TYPES
import {
  APONTAMENTO_SALVAR_REQUEST,
  APONTAMENTO_SALVAR_SUCCESS,
  APONTAMENTO_GERAR_ETIQUETA_SUCCESS,
  APONTAMENTO_VALIDAR_SERIAL_REQUEST,
  APONTAMENTO_VALIDAR_SERIAL_SUCCESS,
  FECHAR_MODAL,
  GET_DADOSAPONTAMENTOPORRECURSO_REQUEST,
  GET_DADOSAPONTAMENTOPORRECURSO_SUCCESS,
  VERIFICAR_USUARIO_REQUEST,
  VERIFICAR_USUARIO_SUCCESS,
  GET_RECURSOS_REQUEST,
  GET_RECURSOS_SUCCESS,
  LIMPAR_TABELA,
  APONTAMENTO_VERIFICAR_PARADA_REQUEST,
  APONTAMENTO_VERIFICAR_PARADA_SUCCESS,
  APONTAMENTO_SET_MOTIVO_SUCCESS,
  APONTAMENTO_VALIDAR_OF_SUCCESS,
  APONTAMENTO_VALIDAR_OF_REQUEST,
} from "../actionTypes";

const initialState = {
  serial: [],
  entityInstance: {},
  recurso: "",
  showModal: false,
  defeitos: [],
  etiqueta: null,
  impressoras: [],
  seriais: JSON.parse(localStorage.getItem("seriais")) || [],
  parada: {},
  motivos: [],
  loading: false,
  tempoMaximoSemApontamento: 0,
  ultimoApontamento: 0,
  dadosSerial: {},
  totalSeriais: 0
};

export function apontamentoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_RECURSOS_REQUEST:
      return {
        ...state,
        etiqueta: null
      }
    case GET_RECURSOS_SUCCESS:
      return {
        ...state,
        recursos: action.data,
        seriais: state.seriais,
        parada: state.parada,
        motivos: state.motivos,
      }
    case GET_DADOSAPONTAMENTOPORRECURSO_REQUEST:
      return {
        ...state,
        recurso: action.recursoId,
        etiqueta: null
      }
    case GET_DADOSAPONTAMENTOPORRECURSO_SUCCESS:
      return {
        ...state,
        defeitos: action.data.defeitos,
        impressoras: action.data.impressoras,
        tempoMaximoSemApontamento: action.data.tempoMaximoSemApontamento,
        ultimoApontamento: action.data.ultimoApontamento
      }
    case APONTAMENTO_SET_MOTIVO_SUCCESS:
      return {
        ...state,
        ultimoApontamento: action.data.ultimoApontamento
      }
    case APONTAMENTO_VALIDAR_SERIAL_REQUEST:
    case APONTAMENTO_VALIDAR_OF_REQUEST:
    case FECHAR_MODAL:
      return {
        ...state,
        showModal: false,
        etiqueta: null,
        seriais: state.seriais,
        tempoMaximoSemApontamento: state.tempoMaximoSemApontamento,
        ultimoApontamento: state.ultimoApontamento,
      }
    case APONTAMENTO_VALIDAR_SERIAL_SUCCESS:
    case APONTAMENTO_VALIDAR_OF_SUCCESS:
      return {
        ...state,
        showModal: !action.data.messages?.length,
        seriais: action.seriais,
        serial: '',
        tempoMaximoSemApontamento: state.tempoMaximoSemApontamento,
        ultimoApontamento: state.ultimoApontamento,
        totalSeriais: action.data.totalSeriais,
        dadosSerial: {
          modelo: action.data.modelo,
          comprimento: action.data.comprimento,
          materiasPrimas: action.data.materiasPrimas,
          dataPrevisaoFinalizacao: action.data.dataPrevisaoFinalizacao,
          camposRastreaveis: action.data.camposRastreaveis,
        }
      }
    case APONTAMENTO_SALVAR_REQUEST:
    case APONTAMENTO_SALVAR_SUCCESS:
      return {
        ...state,
        entityInstance: {},
        etiqueta: null,
        seriais: action.data.seriais,
        ultimoApontamento: action.data.ultimoApontamento
      }
    case VERIFICAR_USUARIO_REQUEST:
      return {
        ...state
      }
    case VERIFICAR_USUARIO_SUCCESS: {
      return {
        ...state,
        seriais: action.data.seriais,
        entityInstance: {},
      }
    }
    case APONTAMENTO_GERAR_ETIQUETA_SUCCESS:
      return {
        ...state,
        etiqueta: action.data.etiqueta,
      }
    case LIMPAR_TABELA:
      return {
        ...state,
        seriais: []
      }
    case APONTAMENTO_VERIFICAR_PARADA_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case APONTAMENTO_VERIFICAR_PARADA_SUCCESS:
      return {
        ...state,
        parada: action.data.parada,
        motivos: action.data.motivos,
        loading: false,
      }
    default:
      return {
        ...state,
        etiqueta: null
      };
  }
}
