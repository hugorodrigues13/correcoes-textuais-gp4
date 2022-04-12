import {
  APOIO_BUSCAR_SERIAL_REQUEST,
  APOIO_BUSCAR_SERIAL_SUCCESS,
  APOIO_BUSCAR_GRUPOS_LINHAS_REQUEST,
  APOIO_BUSCAR_GRUPOS_LINHAS_SUCCESS,
  APOIO_BUSCAR_GRUPO_LINHAS_REQUEST, APOIO_BUSCAR_GRUPO_LINHAS_SUCCESS,
} from "../actionTypes"


const initialState = {

  gruposLinhasDeProducao: [],
  loadingGrupos: false,

  grupoLinhaSelecionada: {},
  loadingGrupo: false,

  seriaisDefeituosos: [],

  serialSelecionado: {},
  loadingSerial: false,
};


export function apoioReducer(state = initialState, action) {
  switch (action.type) {


    case APOIO_BUSCAR_GRUPOS_LINHAS_REQUEST:
      return {
        ...state,
        loadingGrupos: true
      };

    case APOIO_BUSCAR_GRUPO_LINHAS_REQUEST:
      return {
        ...state,
        loadingGrupo: true
      };

    case APOIO_BUSCAR_GRUPOS_LINHAS_SUCCESS:
      return {
        ...state,
        loadingGrupos: false,
        gruposLinhasDeProducao: action.data.entities,
      };

    case APOIO_BUSCAR_GRUPO_LINHAS_SUCCESS:
      return {
        ...state,
        loadingGrupo: false,
        grupoLinhaSelecionada: action.data.entity,
        seriaisDefeituosos: action.data.serials,
        serialSelecionado: {},
      };

    case APOIO_BUSCAR_SERIAL_REQUEST:
      return {
        ...state,
        loadingSerial: true,
      };

    case APOIO_BUSCAR_SERIAL_SUCCESS:
      return {
        ...state,
        loadingSerial: false,
        serialSelecionado: action.data,
      };

    default:
      return state
  }
}
