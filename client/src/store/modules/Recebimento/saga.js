import {call, all, put, takeLatest} from "redux-saga/effects";
import {RECEBIMENTO_CONCLUIR_MANUALMENTE_REQUEST, RECEBIMENTO_LIST_REQUEST} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {
  recebimentoConcluirManualmenteSuccess,
  recebimentoError,
  recebimentoListSuccess
} from "./action";
import {ServiceRecebimento} from "../../../services/serviceRecebimento";

function* list(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServiceRecebimento.list, action.filtros)
    //CHAMADA SUCCESS
    yield put(recebimentoListSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(recebimentoError(e))
    yield put(finishLoading())
  }
}

function* concluirManualmente({ action }) {
  try {
    yield put(startLoading())

    // CHAMADA API DO PATCH
    yield call(ServiceRecebimento.concluirManualmente, action.id)
    // CHAMADA API DOS DADOS
    const data = yield call(ServiceRecebimento.list, action.filtros)
    // CHAMADA SUCCESS DO PATCH
    yield put(recebimentoConcluirManualmenteSuccess())
    // CHAMADA SUCCESS DOS DADOS
    yield put(recebimentoListSuccess(data))
  } catch (e) {
    yield put(recebimentoError(e))
  } finally {
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(RECEBIMENTO_LIST_REQUEST, list),
  takeLatest(RECEBIMENTO_CONCLUIR_MANUALMENTE_REQUEST, concluirManualmente)
])
