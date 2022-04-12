import { call, put, all, takeLatest } from "redux-saga/effects"
import {
  listDashboardProducaoSuccess,
  error, indicadoresSuccess, statusSeriaisSuccess, seriaisDiaSuccess,
} from "./action"
import {
  DASHBOARD_PRODUCAO_INDICADORES_REQUEST,
  DASHBOARD_PRODUCAO_LIST_REQUEST, DASHBOARD_PRODUCAO_SERIAIS_DIA_REQUEST, DASHBOARD_PRODUCAO_STATUS_SERIAIS_REQUEST,
} from "../actionTypes"

import { ServiceDashboardProducao } from "../../../services/serviceDashboardProducao"
import { startLoading, finishLoading } from "../RequestManager/action";
import moment from "moment";

function* listDashboardProducao() {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceDashboardProducao.dadosProducao);
    //CHAMADA SUCCESS
    yield put(listDashboardProducaoSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* indicadores() {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceDashboardProducao.indicadores);
    //CHAMADA SUCCESS
    yield put(indicadoresSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* statusSeriais({filtros}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    if (filtros.periodo){
      filtros.periodoInicial = filtros.periodo[0].format("DD/MM/YYYY HH:mm")
      filtros.periodoFinal = filtros.periodo[1].format("DD/MM/YYYY HH:mm")
      filtros.periodo = undefined
    }
    const list = yield call(ServiceDashboardProducao.statusSeriais, filtros);
    //CHAMADA SUCCESS
    yield put(statusSeriaisSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* seriaisDoDia({filtros}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    if (filtros.periodo){
      filtros.periodoInicial = filtros.periodo[0].format("DD/MM/YYYY HH:mm")
      filtros.periodoFinal = filtros.periodo[1].format("DD/MM/YYYY HH:mm")
      filtros.periodo = undefined
    }
    const list = yield call(ServiceDashboardProducao.seriaisDoDia, filtros);
    //CHAMADA SUCCESS
    yield put(seriaisDiaSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(DASHBOARD_PRODUCAO_LIST_REQUEST, listDashboardProducao),
  takeLatest(DASHBOARD_PRODUCAO_INDICADORES_REQUEST, indicadores),
  takeLatest(DASHBOARD_PRODUCAO_STATUS_SERIAIS_REQUEST, statusSeriais),
  takeLatest(DASHBOARD_PRODUCAO_SERIAIS_DIA_REQUEST, seriaisDoDia),
])

