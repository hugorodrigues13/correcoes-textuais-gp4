import {call, all, put, takeLatest} from "redux-saga/effects";
import {TEMPO_APONTAMENTO_EDIT_REQUEST, TEMPO_APONTAMENTO_LIST_REQUEST} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {
  tempoApontamentoEditSuccess,
  tempoApontamentoError,
  tempoApontamentoListRequest,
  tempoApontamentoListSuccess
} from "./action";
import {ServiceTempoApontamento} from "../../../services/serviceTempoApontamento";
import {corrigeDataParaEnvio} from "../../../utils/utils";

function* list(action){
  try {
    yield put(startLoading())
    corrigeDataParaEnvio(action.filtros, 'vigencia', 'DD/MM/YYYY HH:mm')
    // CHAMADA API
    const data = yield call(ServiceTempoApontamento.list, action.filtros)
    //CHAMADA SUCCESS
    yield put(tempoApontamentoListSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(tempoApontamentoError(e))
    yield put(finishLoading())
  }
}

function* edit(action){
  try {
    yield put(startLoading())

    // CHAMADA API
    const data = yield call(ServiceTempoApontamento.edit, action.id, action.tempo, action.todos)
    //CHAMADA SUCCESS
    yield put(tempoApontamentoEditSuccess(data))
    yield put(tempoApontamentoListRequest(action.filtros))
    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(tempoApontamentoError(e))
    yield put(tempoApontamentoListRequest(action.filtros))
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(TEMPO_APONTAMENTO_LIST_REQUEST, list),
  takeLatest(TEMPO_APONTAMENTO_EDIT_REQUEST, edit),
])
