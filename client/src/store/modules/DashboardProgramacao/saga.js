import {call, put, all, takeLatest, select} from "redux-saga/effects";
import {startLoading, finishLoading} from "../RequestManager/action";
import {DASH_PROGRAMACAO_LIST_REQUEST} from "../actionTypes";
import {listProgramacaoSuccess, error} from "./action";
import {ServiceDashProgramacao} from "../../../services/serviceDashProgramacao";

function* listProgramacao( {filtros} ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceDashProgramacao.listar, filtros );
    //CHAMADA SUCCESS
    yield put(listProgramacaoSuccess( list ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}


export default all([
  takeLatest(DASH_PROGRAMACAO_LIST_REQUEST, listProgramacao),
])
