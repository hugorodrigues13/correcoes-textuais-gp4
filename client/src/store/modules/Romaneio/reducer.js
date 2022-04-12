import {
  ROMANEIO_LIST_REQUEST,
  ROMANEIO_LIST_SUCCESS,
  ROMANEIO_MUDAR_VOLUME_SUCCESS,
  ROMANEIO_PREPARE_EDIT_REQUEST,
  ROMANEIO_PREPARE_EDIT_SUCCESS,
  ROMANEIO_EDITAR_LOTES_SUCCESS,
  ROMANEIO_LISTAR_LOTES_SUCCESS,
  ROMANEIO_HISTORICO_REQUEST,
  ROMANEIO_HISTORICO_SUCCESS,
  ROMANEIO_LISTAR_LOTES_REQUEST,
  ROMANEIO_EXPORTAR_REQUEST,
  ROMANEIO_EXPORTAR_SUCCESS,
  ROMANEIO_GERAR_NFF_REQUEST,
  ROMANEIO_GERAR_NFF_SUCCESS,
  ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_SUCCESS,
  ROMANEIO_EDITAR_NFS_REQUEST,
  ROMANEIO_EXPORTAR_XLSX_REQUEST,
  ROMANEIO_EXPORTAR_XLSX_SUCCESS
} from "../actionTypes";
import Alert from "react-s-alert";
import {getMessage} from "../../../components/messages";

const initialState = {
  data: null,
  loading: false,
  lotes: [],
  historico: [],
  loadingHistorico: false,
};

export function romaneioReducer(state = initialState, action) {
  switch(action.type) {
    case ROMANEIO_PREPARE_EDIT_REQUEST:
    case ROMANEIO_LIST_REQUEST:
      return {
        ...state,
        data: null,
        loading: true
      }
    case ROMANEIO_PREPARE_EDIT_SUCCESS:
    case ROMANEIO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false
      };
    case ROMANEIO_MUDAR_VOLUME_SUCCESS:
      const newData = {...state.data}
      newData.entity.volume = action.data
      return {
        ...state,
        data: newData
      }
    case ROMANEIO_LISTAR_LOTES_REQUEST:
      return {
        ...state,
        lotes: [],
        loading: true
      }
    case ROMANEIO_LISTAR_LOTES_SUCCESS:
      return {
        ...state,
        lotes: action.data,
        loading: false
      }
    case ROMANEIO_EDITAR_LOTES_SUCCESS:
      if (action.data.indisponiveis.length){
        const indisponiveis = action.data.indisponiveis.map(lote => lote.lote).join(", ")
        Alert.error(getMessage("romaneio.dados.lotes.modal.indisponiveis.label") + indisponiveis)
      }
      return {
        ...state,
        data: action.data,
        loading: false
      };
    case ROMANEIO_HISTORICO_REQUEST:
      return {
        ...state,
        loadingHistorico: true
      }
    case ROMANEIO_HISTORICO_SUCCESS:
      const {historico} = action.data
      return{
        ...state,
        historico: historico,
        loadingHistorico: false
      }
    case ROMANEIO_EDITAR_NFS_REQUEST:
    case ROMANEIO_EXPORTAR_REQUEST:
      return {
        ...state,
        loading: true
      }
    case ROMANEIO_EXPORTAR_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case ROMANEIO_GERAR_NFF_REQUEST:
      return {
        ...state,
        loading: true
      }
    case ROMANEIO_GERAR_NFF_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case ROMANEIO_EXPORTAR_XLSX_REQUEST:
      return {
        ...state,
        loading: true
      }
    case ROMANEIO_EXPORTAR_XLSX_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_SUCCESS:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
