
import {
    PRODUCAO_ERROR,
    PRODUCAO_GERAR_RELATORIO_REQUEST,
    PRODUCAO_GERAR_RELATORIO_SUCCESS,
    PRODUCAO_GET_DADOS_INICIAIS_REQUEST,
    PRODUCAO_GET_DADOS_INICIAIS_SUCCESS,
  } from "../actionTypes";

import {downloadRelatorio} from "../../../services/serviceUtils";


export function getDadosIniciaisRequest(data) {
    return {
      type: PRODUCAO_GET_DADOS_INICIAIS_REQUEST
    }
}
export function getDadosIniciaisSuccess(data) {
    return {
      type: PRODUCAO_GET_DADOS_INICIAIS_SUCCESS,
      data
    }
}

export function gerarRelatorioRequest(filtros){
    return {
      type: PRODUCAO_GERAR_RELATORIO_REQUEST,
      filtros,
    }
  }
  
  export function gerarRelatorioSuccess(data){
    downloadRelatorio(data, "relatorio.producao.relatorio.nomeArquivo.label")
    return {
      type: PRODUCAO_GERAR_RELATORIO_SUCCESS,
      data,
    }
  }