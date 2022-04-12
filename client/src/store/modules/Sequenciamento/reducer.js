import {
  SEQUENCIAMENTO_SALVAR_REQUEST,
  SEQUENCIAMENTO_BUSCAR_GRUPOS_REQUEST,
  SEQUENCIAMENTO_BUSCAR_GRUPOS_SUCCESS,
  SEQUENCIAMENTO_ERROR,
  SEQUENCIAMENTO_SET_PRODUTO_SELECIONADO,
  SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_REQUEST,
  SEQUENCIAMENTO_SET_GRUPO_SELECIONADO,
  SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_SUCCESS,
  SEQUENCIAMENTO_SET_ORDEM_POS_ANTERIOR,
  SEQUENCIAMENTO_CANCELA_DROP,
  SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_SUCCESS,
  SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_REQUEST,
  SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_SUCCESS,
  SEQUENCIAMENTO_HIDE_MODAL_CATALOGO,
  SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
  SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS,
  SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
  SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS,
  SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_REQUEST,
  SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_SUCCESS,
  SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_REQUEST,
  SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_SUCCESS,
} from "../actionTypes"

const initialState = {
  pedidosGrupo: {pedidosSemGrupo: [], pedidosGrupo: []},
  data: null,
  produtoSelecionado: {},
  grupoSelecionado: null,
  codigo: null,
  listaGrupos: [],
  loadingPedidos: false,
  loadingOrdens: false,
  linhasGrupo: [],
  codigoOrdemAnterior: "",
  ordensGrupo: [],
  error: "",
  codigoProdutoCatalogo: "",
  descricaoProdutoCatalogo: "",
  showModalCatalogo: false,
  qtdeOrdensSemGrupo: {},
  loadingQtdeOrdensSemGrupo: false,
  ordensSemGrupo: [],
  LoadingOrdensSemGrupo: false,
  ordensComGrupo: [],
  LoadingOrdensComGrupo: false,
  materiaPrima: '',
  loadingMateriaPrima: false,
  materiaPrimaTotal: 0,
  usuarioLogado: {},
  listStatusOrdemFabricacao: [],
};

export function sequenciamentoReducer(state = initialState, action) {
  switch (action.type) {
    case SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_REQUEST:
      return {
        ...state,
        codigoProdutoCatalogo: action.item,
        descricaoProdutoCatalogo: action.descricao
      }
    case SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_REQUEST:
      return {
        ...state,
        loadingOrdens: true
      }
    case SEQUENCIAMENTO_BUSCAR_GRUPOS_REQUEST:
      return {
        ...state,
        error: ""
      }
    case SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_SUCCESS:
      return {
        ...state,
        listItens: action.itens,
        showModalCatalogo: true
      }
    case SEQUENCIAMENTO_BUSCAR_GRUPOS_SUCCESS: {
      return {
        ...state,
        listaGrupos: action.data.listaGrupos,
        usuarioLogado: action.data.usuarioLogado,
      }
    }
    case SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_SUCCESS:
      return {
        ...state,
        linhasGrupo: action.data.linhas
      }
    case SEQUENCIAMENTO_SALVAR_REQUEST:
      return {
        ...state,
        codigo: null,
      }
    case SEQUENCIAMENTO_ERROR:
      return {
        ...state,
        error: action.error,
      }
    case SEQUENCIAMENTO_SET_PRODUTO_SELECIONADO:
      return {
        ...state,
        produtoSelecionado: action.produto
      }
    case SEQUENCIAMENTO_SET_ORDEM_POS_ANTERIOR:
      return {
        ...state,
        codigoOrdemAnterior: action.codigoOrdemAnterior
      }
    case SEQUENCIAMENTO_CANCELA_DROP:
      return {
        ...state,
        codigoOrdemAnterior: "",
        produtoSelecionado: {}
      }
    case SEQUENCIAMENTO_HIDE_MODAL_CATALOGO:
      return {
        ...state,
        showModalCatalogo: false,
        codigoProdutoCatalogo: "",
        descricaoProdutoCatalogo: "",
        listItens: []
      }
    case SEQUENCIAMENTO_SET_GRUPO_SELECIONADO:
      return {
        ...state,
        grupoSelecionado: action.grupo
      }
    case SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_SUCCESS:
      return {
        ...state,
        ordensGrupo: action.data.ordensDoGrupo,
        loadingOrdens: false,
        listStatusOrdemFabricacao: action.data.listStatusOrdemFabricacao
      }
    case SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST:
      return {
        ...state,
        loadingQtdeOrdensSemGrupo: true
      }
    case SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS:
      return {
        ...state,
        qtdeOrdensSemGrupo: action.data.totalOrdensDeProducaoProdutosSemGrupoAssociado,
        loadingQtdeOrdensSemGrupo: false
      }
    case SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST:
      return {
        ...state,
        LoadingOrdensSemGrupo: true
      }
    case SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS:
      return {
        ...state,
        ordensSemGrupo: action.data.ordensDeProducaoProdutosSemGrupoAssociado,
        totalOrdensSemGrupoFiltradas: action.data.totalOrdensDeProducaoProdutosSemGrupoAssociado,
        LoadingOrdensSemGrupo: false
      }
    case SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_REQUEST:
      return {
        ...state,
        LoadingOrdensComGrupo: true
      }
    case SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_SUCCESS:
      if(action.hasOwnProperty("data") && action.data.ordensDeProducaoProdutosAssociadosAoGrupo !== undefined) {
        return {
          ...state,
            ordensComGrupo: action.data.ordensDeProducaoProdutosAssociadosAoGrupo,
          LoadingOrdensComGrupo: false
        }
      } else {
        return {
          ...state,
        }
      }
    case SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_REQUEST:
      return {
        ...state,
        loadingMateriaPrima: true
      }
    case SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_SUCCESS:
      return {
        ...state,
        materiaPrima: action.data.materiaPrima,
        materiaPrimaTotal: action.data.total,
        loadingMateriaPrima: false
      }
    default:
      return state;
  }
}
