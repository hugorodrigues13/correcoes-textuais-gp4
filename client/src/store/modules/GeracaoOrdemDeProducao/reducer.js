import * as ACTIONS from "../actionTypes";
import {
  GERACAO_DE_ORDEM_DE_PRODUCAO_USER_FORNECEDORES_SUCCESS,
  GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_DATA_SUCCESS,
  GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_JUSTIFICATIVA_SUCCESS
} from "../actionTypes";

const initialState = {
  entityInstance: {},
  listProdutos: [],
  listFornecedores: [],
  listRoteiros: [],
  listListas: [],
  ordens: [],
  ordensSelecionadas: [],
  ordensSelecionadasIndexs: [],
  listFornecedoresListasRoteiros: [],
  loadingProdutos: false,
  errosGeracaoComOV: null,
  fornecedores: []
};

export function geracaoOrdemDeProducaoReducer(state = initialState, action) {
  switch(action.type) {
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_GERAR_REQUEST:
      return {
        ...state,
        errosGeracaoComOV: null
      }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_GERAR_SUCCESS:
      return {
        ...state,
        entityInstance: {},
        listProdutos: [],
        listFornecedores: [],
        listRoteiros: [],
        listListas: [],
        errosGeracaoComOV: action.data.errosGeracaoComOV
      }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_POR_OV_REQUEST:
      return {
        ...state,
        error: "",
        errosGeracaoComOV: null
      };
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_PRODUTOS_REQUEST:
      return {
        ...state,
        error: "",
        loadingProdutos: true
      };
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_ERROR:
      return {
        ...state,
        error: action.error
      };
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_PRODUTOS_SUCCESS:
      return {
        ...state,
        listProdutos: action.data.listProdutos,
        loadingProdutos: false
      }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_POR_OV_SUCCESS:
      return {
        ...state,
        ordens: action.data.ordens,
      }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_FORNECEDORES_LISTAS_ROTEIROS_SUCCESS:
      const produto = state.listProdutos.find(p => p.codigo === action.codigo)
      const {fornecedoresListasRoteiros} = produto
      return {
        ...state,
        listRoteiros: fornecedoresListasRoteiros.map(flr => flr.roteiro),
        listFornecedores: fornecedoresListasRoteiros.map(flr => ({vendorName: flr.nomeFornecedor, vendorId: flr.idFornecedor})),
        listListas: fornecedoresListasRoteiros.map(flr => flr.lista),
        listFornecedoresListasRoteiros: fornecedoresListasRoteiros,
      }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SET_ENTITY:
      return {
        ...state,
        entityInstance: action.entity
      }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_LIMPAR_PRODUTOS: {
      return {
        ...state,
        listProdutos: [],
        ordensSelecionadas: [],
        entityInstance: {},
        ordensSelecionadasIndexs: [],
        ordens: [],
        listFornecedoresListasRoteiros: []
      }
    }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_ORDENS_SUCCESS: {
      return {
        ...state,
        ordensSelecionadas: action.entities,
        ordensSelecionadasIndexs: action.rows,
      }
    }
    case ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_LISTA_ROTEIRO_SUCCESS:{
      const ordem = {...state.ordensSelecionadas.find(o => o.codigoProduto === action.entity.codigoProduto)}
      const ordemIndex = state.ordens.findIndex(o => o.codigoProduto === action.entity.codigoProduto)
      const newOrdens = [...state.ordens]
      const newOrdensSelecionadas = [...state.ordensSelecionadas.filter(o => o.codigoProduto !== ordem.codigoProduto)]

      const type = action.propriedade
      const otherType = type === 'lista' ? 'roteiro' : 'lista'
      const value = action.lista || action.roteiro
      const otherValue = ordem[otherType]

      const listaFiltrada = !value
        ? otherValue
          ? ordem.fornecedoresListasRoteiros.filter(flr => flr[otherType] === otherValue)
          : ordem.fornecedoresListasRoteiros
        : ordem.fornecedoresListasRoteiros.filter(flr => flr[type] === value)

      const newOrdem = {
        ...ordem,
        [type]: value,
        fornecedor: type === 'lista' ? action.fornecedor : ordem.fornecedor,
        fornecedoresListasRoteirosFiltrado: listaFiltrada,
      }

      newOrdens[ordemIndex].fornecedoresListasRoteirosFiltrado = listaFiltrada
      newOrdens[ordemIndex][type] = value

      if (value){
        const otherValues = [...new Set(listaFiltrada.map(flr => flr[otherType]))]
        if (otherValues.length === 1){
          newOrdem[otherType] = otherValues[0]
          newOrdens[ordemIndex][otherType] = otherValues[0]
          if (otherType === 'lista'){
            const {fornecedor} = listaFiltrada.find(flr => flr[otherType] === otherValues[0])
            newOrdem.fornecedor = fornecedor
            newOrdens[ordemIndex].fornecedor = fornecedor
          }
        }
      } else {
        newOrdem.fornecedoresListasRoteirosFiltrado = listaFiltrada
        newOrdens[ordemIndex].fornecedoresListasRoteirosFiltrado = listaFiltrada
      }
      newOrdensSelecionadas.push(newOrdem)
      return {
        ...state,
        ordensSelecionadas: newOrdensSelecionadas,
        ordens: newOrdens
      }
    }
    case GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_DATA_SUCCESS: {
      const ordemIndex = state.ordens.findIndex(o => o.codigoProduto === action.entity.codigoProduto)
      const ordemSelecionadaIndex = state.ordensSelecionadas.findIndex(o => o.codigoProduto === action.entity.codigoProduto)

      const newOrdensSelecionadas = [...state.ordensSelecionadas]
      const newOrdens = [...state.ordens]

      newOrdens[ordemIndex].dataFinalizacao = action.data
      newOrdensSelecionadas[ordemSelecionadaIndex].dataFinalizacao = action.data
      return {
        ...state,
        ordens: newOrdens,
        ordensSelecionadas: newOrdensSelecionadas,
      }
    }
    case GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_JUSTIFICATIVA_SUCCESS: {
      const ordemIndex = state.ordens.findIndex(o => o.codigoProduto === action.entity.codigoProduto)
      const ordemSelecionadaIndex = state.ordensSelecionadas.findIndex(o => o.codigoProduto === action.entity.codigoProduto)

      const newOrdensSelecionadas = [...state.ordensSelecionadas]
      const newOrdens = [...state.ordens]

      newOrdens[ordemIndex].justificativa = action.justificativa
      newOrdensSelecionadas[ordemSelecionadaIndex].justificativa = action.justificativa
      return {
        ...state,
        ordens: newOrdens,
        ordensSelecionadas: newOrdensSelecionadas,
      }
    }
    case GERACAO_DE_ORDEM_DE_PRODUCAO_USER_FORNECEDORES_SUCCESS: {
      return {
        ...state,
        fornecedores: action.data.fornecedores
      }
    }
    default:
      return state;
  }
}
