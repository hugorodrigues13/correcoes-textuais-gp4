import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  listConfGeralSuccess,
  updateValorSuccess,
  error
} from "./configGeralAction";
import {
  CONF_GERAL_LIST_REQUEST,
  CONF_GERAL_UPDATE_VALOR_REQUEST
} from "../actionTypes";
import { ServiceConfGeral } from "../../../services/serviceConfiguracaoGeral";

function* listConfGeral(action) {
  try {
    //CHAMADA API
    const list = yield call(ServiceConfGeral.getTodos, action.filtros);
    //CHAMDA SUCESS
    yield put(listConfGeralSuccess(list));
  } catch (e) {
    yield put(error(e.message));
  }
}

function* atualizaValor(action) {
  try {
    yield call(ServiceConfGeral.setValor, action.entity);
    yield put(updateValorSuccess(action.entity));
  } catch (e) {
    yield put(error(e.message));
  }
}

export default all([
  takeLatest(CONF_GERAL_LIST_REQUEST, listConfGeral),
  takeLatest(CONF_GERAL_UPDATE_VALOR_REQUEST, atualizaValor)
]);
