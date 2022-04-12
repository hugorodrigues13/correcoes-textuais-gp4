import {all, call, put, takeLatest} from "redux-saga/effects";
import {
  ASAICHI_GRAFICO_DEFEITOS_REQUEST,
  ASAICHI_LIST_REQUEST,
  ASAICHI_PRODUCAO_DIARIA_REQUEST,
  ASAICHI_PRODUCAO_MENSAL_REQUEST,
  ASAICHI_PRODUCAO_SEMANAL_REQUEST,
  ASAICHI_TABELA_DEFEITOS_REQUEST,
  ASAICHI_TABELA_PRODUCAO_REQUEST,
  ASAICHI_TABELA_PRODUTIVIDADE_REQUEST
} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {
  asaichiError, asaichiGraficoDefeitosSuccess,
  asaichiListSuccess, asaichiProducaoDiariaSuccess, asaichiProducaoMensalSuccess, asaichiProducaoSemanalSuccess,
  asaichiTabelaDefeitosSuccess,
  asaichiTabelaProducaoSuccess,
  asaichiTabelaProdutividadeSuccess
} from "./action";
import {ServiceAsaichi} from "../../../services/serviceAsaichi";

function* list({filtros}){
  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.list, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiListSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

function* tabelaProducao({filtros}){

  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.tabelaProducao, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiTabelaProducaoSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

function* tabelaDefeitos({filtros}){
  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.tabelaDefeitos, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiTabelaDefeitosSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

function* tabelaProdutividade({filtros}){
  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.tabelaProdutividade, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiTabelaProdutividadeSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

function* producaoDiaria({filtros}){
  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.producaoDiaria, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiProducaoDiariaSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

function* producaoSemanal({filtros}){
  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.producaoSemanal, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiProducaoSemanalSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

function* producaoMensal({filtros}){
  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.producaoMensal, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiProducaoMensalSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

function* graficoDefeitos({filtros}){
  try {
    yield put(startLoading());
    if (filtros.data && !(typeof filtros.data === 'string')){
      filtros.data = filtros.data.format("DD/MM/YYYY")
    }
    //CHAMADA API
    const list = yield call(ServiceAsaichi.graficoDefeitos, filtros);
    //CHAMADA SUCCESS
    yield put(asaichiGraficoDefeitosSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(asaichiError(e.message));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(ASAICHI_LIST_REQUEST, list),
  takeLatest(ASAICHI_TABELA_PRODUCAO_REQUEST, tabelaProducao),
  takeLatest(ASAICHI_TABELA_DEFEITOS_REQUEST, tabelaDefeitos),
  takeLatest(ASAICHI_TABELA_PRODUTIVIDADE_REQUEST, tabelaProdutividade),
  takeLatest(ASAICHI_PRODUCAO_DIARIA_REQUEST, producaoDiaria),
  takeLatest(ASAICHI_PRODUCAO_SEMANAL_REQUEST, producaoSemanal),
  takeLatest(ASAICHI_PRODUCAO_MENSAL_REQUEST, producaoMensal),
  takeLatest(ASAICHI_GRAFICO_DEFEITOS_REQUEST, graficoDefeitos),
])
