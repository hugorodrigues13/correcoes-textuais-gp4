import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  listAuditoriaSuccess,
  error,
  getAuditoriaByIdSuccess
} from "./auditoriaAction";
import {
  AUDITORIA_LIST_REQUEST,
  AUDITORIA_GET_ID_REQUEST
} from "../actionTypes";
import { ServiceAuditoria } from "../../../services/serviceAuditoria";
import {finishLoading, startLoading} from "../RequestManager/action";
import moment from 'moment';

function* listAuditoria(action) {
  try {
    //CHAMADA API
    yield put(startLoading());
    if (action.filtros.periodoCriacao){
      action.filtros.periodoCriacaoInicial = moment(action.filtros.periodoCriacao[0]).startOf('day').format("DD/MM/YYYY HH:mm:ss")
      action.filtros.periodoCriacaoFinal = moment(action.filtros.periodoCriacao[1]).endOf('day').format("DD/MM/YYYY HH:mm:ss")
      action.filtros.periodoCriacao = undefined
    }
    if (action.filtros.periodoAtualizacao){
      action.filtros.periodoAtualizaoInicial = moment(action.filtros.periodoAtualizacao[0]).startOf('day').format("DD/MM/YYYY HH:mm:ss")
      action.filtros.periodoAtualizaoFinal = moment(action.filtros.periodoAtualizacao[1]).endOf('day').format("DD/MM/YYYY HH:mm:ss")
      action.filtros.periodoAtualizacao = undefined
    }
    const auditoriaList = yield call(ServiceAuditoria.getTodos, action.filtros);
    //CHAMDA SUCESS
    yield put(listAuditoriaSuccess(auditoriaList));
    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* getAuditoriaById({ id }) {
  try {
    //CHAMADA API
    const auditoria = yield call(ServiceAuditoria.getById, id);
    //CHAMDA SUCESS
    yield put(getAuditoriaByIdSuccess(auditoria));
  } catch (e) {
    yield put(error(e.message));
  }
}

export default all([
  takeLatest(AUDITORIA_LIST_REQUEST, listAuditoria),
  takeLatest(AUDITORIA_GET_ID_REQUEST, getAuditoriaById)
]);
