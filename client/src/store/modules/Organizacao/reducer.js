import {
  ORGANIZACAO_LIST_REQUEST,
  ORGANIZACAO_LIST_SUCCESS,
  ORGANIZACAO_SET_SUCESS,
  ORGANIZACAO_SET,
  ORGANIZACAO_ERROR, ORGANIZACAO_SET_FORNECEDOR_SUCCESS, ORGANIZACAO_SET_FORNECEDOR_REQUEST
} from "../actionTypes";
import theme1 from "../../../themes/theme1";
import theme2 from "../../../themes/theme2";
import theme3 from "../../../themes/theme3";
import {CLIENT_URL} from "../../../config";

let org = localStorage.getItem("organizacao");

const initialState = {
  data: { list: [], fornecedores: [], organizacao: null, fornecedor: null },
  error: "",
  theme: org == 1 ? theme1 : org == 2 ? theme2 : theme3
};

export function organizacaoReducer(state = initialState, action) {
  switch (action.type) {
    case ORGANIZACAO_SET:
    case ORGANIZACAO_SET_FORNECEDOR_REQUEST:
    case ORGANIZACAO_LIST_REQUEST:
      return {
        ...state,
        error: ""
      };
    case ORGANIZACAO_LIST_SUCCESS:
      if(localStorage.getItem("organizacao") === null){
        const firstOrg = action.data.organizacaoId
        const firstForn = action.data.fornecedorId

        localStorage.setItem("organizacao", firstOrg);
        localStorage.setItem("fornecedor", firstForn);
      }
      return {
        ...state,
        data: { ...state.data,
          list: action.data.organizacoes,
          fornecedores: action.data.fornecedores,
          organizacao: localStorage.getItem("organizacao"),
          fornecedor: localStorage.getItem("fornecedor"),
        }
      };
    case ORGANIZACAO_SET_SUCESS: {
      localStorage.setItem("organizacao", action.organizacao);
      const fornecedores = action.fornecedores || []

      if(fornecedores && fornecedores.length) {
        const firstForn = fornecedores[0].id
        localStorage.setItem("fornecedor", firstForn);
      }

      if(state.data.organizacao !== null && state.data.organizacao != action.organizacao && !action.isLogin) {

        let indexForm = -1;
        if(window.location.pathname) indexForm = window.location.pathname.indexOf("/form");
        if(indexForm > -1){
          window.location.href = `${CLIENT_URL}${window.location.pathname.substring(0, indexForm)}`
        }else {
          window.location.reload()
        }

      }
      return {
        ...state,
        data: { ...state.data, organizacao: action.organizacao, fornecedores: fornecedores },
        theme:
          action.organizacao == 1
            ? theme1
            : action.organizacao == 2
            ? theme2
            : theme3
      };
    }

    case ORGANIZACAO_SET_FORNECEDOR_SUCCESS: {
      localStorage.setItem("fornecedor", action.fornecedor);
      if(state.data.fornecedor !== null && state.data.fornecedor != action.fornecedor && !action.isLogin) {

        let indexForm = -1;
        if(window.location.pathname) indexForm = window.location.pathname.indexOf("/form");
        if(indexForm > -1){
          window.location.href = `${window.location.pathname.substring(0, indexForm)}`
        }else {
          window.location.reload()
        }

      }
      return {
        ...state,
        data: { ...state.data, fornecedor: action.fornecedor }
      };
    }

    case ORGANIZACAO_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
