import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  listLogOperacaoSuccess,
  error,
  getLogByIdSuccess
} from "./logOperacaoAction";
import {
  LOG_OPERACAO_LIST_REQUEST,
  LOG_OPERACAO_GET_ID_REQUEST
} from "../actionTypes";
import { ServiceLogOperacao } from "../../../services/serviceLogOperacao";
import {finishLoading, startLoading} from "../RequestManager/action";
import moment from 'moment';

function* listLogOperacao(action) {
  try {
    yield put(startLoading());
    if(action.filtros.dataInicial){
      action.filtros.dataInicial = moment(action.filtros.dataInicial).startOf('day').format("DD/MM/YYYY HH:mm")
    }
    if(action.filtros.dataFinal){
      action.filtros.dataFinal = moment(action.filtros.dataFinal).endOf('day').format("DD/MM/YYYY HH:mm")
    }
    //CHAMADA API
    const list = yield call(ServiceLogOperacao.getTodos, action.filtros);
    //CHAMDA SUCESS
    yield put(listLogOperacaoSuccess(list));
    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* getLogOperacaoById(action) {
  try {
    //CHAMADA API
    const entity = yield call(ServiceLogOperacao.getById, action.id);
    //CHAMADA SUCCESS
    yield put(getLogByIdSuccess(entity));
  } catch (e) {
    yield put(error(e.message));
  }
}

export default all([
  takeLatest(LOG_OPERACAO_LIST_REQUEST, listLogOperacao),
  takeLatest(LOG_OPERACAO_GET_ID_REQUEST, getLogOperacaoById)
]);
