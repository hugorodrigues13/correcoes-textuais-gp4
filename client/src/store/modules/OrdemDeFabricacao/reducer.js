import {
  ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_SUCCESS,
  ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_SUCCESS,
  ORDEM_FABRICACAO_LIST_SUCCESS,
  ORDEM_FABRICACAO_MATERIAS_PRIMAS_SUCCESS
} from "../actionTypes";

const initialState = {
  data: {},
  materiasPrimas: [],
  historicoImpressaoOF: [],
};

export function ordemFabricacaoReducer(state = initialState, action){
  switch (action.type){
    case ORDEM_FABRICACAO_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
      }
    case ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_SUCCESS:
      return {
        ...state,
        folhaImpressao: action.data,
      }
    case ORDEM_FABRICACAO_MATERIAS_PRIMAS_SUCCESS:
      return {
        ...state,
        materiasPrimas: action.data.materiaPrima.map((obj, index) => ({...obj, key: index+1})),
      }
    case ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_SUCCESS:
      return {
        ...state,
        historicoImpressaoOF: action.data.historicoImpressaoOF,
      }
    default:
      return state
  }
}
