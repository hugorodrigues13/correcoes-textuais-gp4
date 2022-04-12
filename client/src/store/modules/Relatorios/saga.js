import {all, call, put, select, takeLatest} from "redux-saga/effects";
import {
  RELATORIOS_GERAR_SERIAL_REQUEST,
  RELATORIOS_GET_DADOS_INICIAIS_REQUEST, RELATORIOS_PESQUISAR_DADOS_REQUEST,
} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {ServiceRelatorios} from "../../../services/serviceRelatorios";
import {
  gerarRelatorioSerialSuccess,
  getDadosIniciaisSuccess,
  error, getDadosSuccess, pesquisarDadosSuccess,
} from "./action";

function* getDadosIniciaisRequest() {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRelatorios.getDadosIniciais);

    //CHAMADA SUCCESS
    yield put(getDadosIniciaisSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* gerarSerial({filtros}){
  try {
    yield put(startLoading());
    if (Array.isArray(filtros.ordemProducao)){
      filtros.ordemProducao = filtros.ordemProducao.join(";")
    }
    if (Array.isArray(filtros.codigoProduto)){
      filtros.codigoProduto = filtros.codigoProduto.join(";")
    }
    if (Array.isArray(filtros.linha)){
      filtros.linhaProducao = filtros.linha.join(";")
      filtros.linha = null
    }
    if (Array.isArray(filtros.lote)){
      filtros.lote = filtros.lote.join(";")
    }
    if (Array.isArray(filtros.ordemFabricacao)){
      filtros.ordemFabricacao = filtros.ordemFabricacao.join(";")
    }
    if (Array.isArray(filtros.statusOrdemFabricacao)){
      filtros.statusOrdemFabricacao = filtros.statusOrdemFabricacao.join(";")
    }
    if (filtros.periodo) {
      filtros.dataFinalizacaoInicial = filtros.periodo.split(";")[0]
      filtros.dataFinalizacaoFinal = filtros.periodo.split(";")[1]
      filtros.periodo = null
    }
    if(filtros.grupo) {
      filtros.grupoLinhaProducao = filtros.grupo
    }

    //CHAMADA API
    const data = yield call(ServiceRelatorios.gerarRelatorioSerial, {
      ...filtros,
    });
    //CHAMADA SUCCESS
    yield put(gerarRelatorioSerialSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* pesquisarDados({lote, codigoProduto, ordemFabricacao, ordemProducao, dadosAntigos}){
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRelatorios.pesquisarDados, lote, codigoProduto, ordemFabricacao, ordemProducao);
    //CHAMADA SUCCESS
    yield put(pesquisarDadosSuccess( data, dadosAntigos ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(RELATORIOS_GERAR_SERIAL_REQUEST, gerarSerial),
  takeLatest(RELATORIOS_GET_DADOS_INICIAIS_REQUEST, getDadosIniciaisRequest),
  takeLatest(RELATORIOS_PESQUISAR_DADOS_REQUEST, pesquisarDados),
])
