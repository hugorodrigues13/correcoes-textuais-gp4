import { call, put, all, takeLatest } from "redux-saga/effects";
import {listSuccess,
        listSelectMotivoParadaSuccess,
        updateMotivoSuccess,
        dividirParadasSuccess,
        error
        } from "./action";
import * as ACTION from "../actionTypes";
import { ServiceParada } from "../../../services/serviceParada";
import {startLoading, finishLoading} from "../RequestManager/action";

function* list({filtros}) {
  try {
    yield put(startLoading())

    if (!filtros.ultimas24horas) {
      if (filtros.dataInicioParada && filtros.dataInicioParada.length === 2) {
        filtros.dataInicioParadaInicial = filtros.dataInicioParada[0].startOf("day").format("DD/MM/YYYY HH:mm:ss")
        filtros.dataInicioParadaFinal = filtros.dataInicioParada[1].endOf("day").format("DD/MM/YYYY HH:mm:ss")
        filtros.dataInicioParada = ""
      }
      if (filtros.dataFimParada && filtros.dataFimParada.length === 2) {
        filtros.dataFimParadaInicial = filtros.dataFimParada[0].startOf("day").format("DD/MM/YYYY HH:mm:ss")
        filtros.dataFimParadaFinal = filtros.dataFimParada[1].endOf("day").format("DD/MM/YYYY HH:mm:ss")
        filtros.dataFimParada = ""
      }
    }

    //CHAMADA API
    const list = yield call(
      ServiceParada.getTodos, filtros
    );

    //CHAMDA SUCCESS
    yield put(listSuccess(list));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* listMotivosParada() {
  try {
    yield put(startLoading())

    //CHAMADA API
    const list = yield call(
      ServiceParada.listSelectMotivoParada
    );

    //CHAMDA SUCCESS
    yield put(listSelectMotivoParadaSuccess(list));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* updateMotivo({ data }) {
  try {
    yield put(startLoading())

    //CHAMADA API
    const list = yield call(
      ServiceParada.updateMotivoRequest, data
    );

    //CHAMDA SUCCESS
    yield put(updateMotivoSuccess());

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* dividirParada({ data }) {
  try {
    yield put(startLoading())

    //CHAMADA API
    yield call( ServiceParada.dividirParadaRequest, data);

    //CHAMDA SUCCESS
    yield put(dividirParadasSuccess());

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(ACTION.PARADA_LIST_REQUEST, list),
  takeLatest(ACTION.PARADA_DIVIDIR_REQUEST, dividirParada),
  takeLatest(ACTION.PARADA_LIST_MOTIVO_PARADA_REQUEST, listMotivosParada),
  takeLatest(ACTION.PARADA_LIST_UPDATE_MOTIVO_REQUEST, updateMotivo),
]);
