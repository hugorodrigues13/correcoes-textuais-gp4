import {
  RELATORIOS_ERROR,
  RELATORIOS_GERAR_SERIAL_REQUEST,
  RELATORIOS_GERAR_SERIAL_SUCCESS,
  RELATORIOS_GET_DADOS_INICIAIS_REQUEST,
  RELATORIOS_GET_DADOS_INICIAIS_SUCCESS, RELATORIOS_PESQUISAR_DADOS_REQUEST, RELATORIOS_PESQUISAR_DADOS_SUCCESS,
} from "../actionTypes";
import {downloadRelatorio} from "../../../services/serviceUtils";

export function getDadosIniciaisRequest() {
  return {
    type: RELATORIOS_GET_DADOS_INICIAIS_REQUEST,
  }
}

export function getDadosIniciaisSuccess(data) {
  return {
    type: RELATORIOS_GET_DADOS_INICIAIS_SUCCESS,
    data
  }
}

export function gerarRelatorioSerialRequest(filtros){
  return {
    type: RELATORIOS_GERAR_SERIAL_REQUEST,
    filtros,
  }
}

export function gerarRelatorioSerialSuccess(data){
  downloadRelatorio(data, "relatorio.serial.relatorio.nomeArquivo.label")
  return {
    type: RELATORIOS_GERAR_SERIAL_SUCCESS,
    data,
  }
}

export function pesquisarDadosRequest(lote, codigoProduto, ordemFabricacao, ordemProducao, dadosAntigos){
  return {
    type: RELATORIOS_PESQUISAR_DADOS_REQUEST,
    lote, codigoProduto, ordemFabricacao, ordemProducao, dadosAntigos
  }
}

export function pesquisarDadosSuccess(data, dadosAntigos){
  return {
    type: RELATORIOS_PESQUISAR_DADOS_SUCCESS,
   data, dadosAntigos
  }
}

export function error(error){
  return {
    type: RELATORIOS_ERROR,
    error,
  }
}
