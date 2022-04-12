import { all, call, put, takeLatest } from "redux-saga/effects";
import { finishLoading, startLoading } from "../RequestManager/action";
import {
  METAS_DELETE_REQUEST,
  METAS_EDIT_REQUEST,
  METAS_LIST_REQUEST, METAS_NEW_REQUEST,
  METAS_PREPARE_EDIT_REQUEST,
  METAS_PREPARE_NEW_REQUEST
} from "../actionTypes";
import {
  metaDeleteSuccess,
  metaEditSuccess, metaError, metasListRequest,
  metasListSuccess, metaNewSuccess,
  metaPrepareEditSuccess,
  metaPrepareNewSuccess
} from "./action";
import { ServiceMetas } from "../../../services/serviceMetas";

function* listMetasRequest( action ) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceMetas.list, action.filtros);
    yield console.log('A LISTA: ')
    yield console.log(list);
    //CHAMADA SUCCESS
    yield put(metasListSuccess(list));
  } catch (e) {
    yield put(metaError(e.message));
  } finally {
    yield put(finishLoading());
  }
}

function* prepareEditRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMetas.prepareEdit, action.id);
    //CHAMADA SUCCESS
    yield put(metaPrepareEditSuccess(list));
  } catch (e) {
    yield put(metaError(e.message));
  } finally {
    yield put(finishLoading());
  }
}

function* prepareNewRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMetas.prepareNew);
    //CHAMADA SUCCESS
    yield put(metaPrepareNewSuccess(list));
  } catch (e) {
    yield put(metaError(e.message));
  } finally {
    yield put(finishLoading())
  }
}

function* editRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMetas.edit, action.values);
    //CHAMADA SUCCESS
    yield put(metaEditSuccess(list));
  } catch (e) {
    yield put(metaError(e.message));
  } finally {
    yield put(finishLoading())
  }
}

function* newRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMetas.novo, action.values);
    //CHAMADA SUCCESS
    yield put(metaNewSuccess(list));
  } catch (e) {
    yield put(metaError(e.message));
  } finally {
    yield put(finishLoading())
  }
}

function* deleteRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMetas.deletar, action.id);
    //CHAMADA SUCCESS
    yield put(metaDeleteSuccess(list));
    yield put(metasListRequest(action.filtros));
  } catch (e) {
    yield put(metaError(e.message));
  } finally {
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(METAS_LIST_REQUEST, listMetasRequest),
  takeLatest(METAS_PREPARE_EDIT_REQUEST, prepareEditRequest),
  takeLatest(METAS_PREPARE_NEW_REQUEST, prepareNewRequest),
  takeLatest(METAS_EDIT_REQUEST, editRequest),
  takeLatest(METAS_NEW_REQUEST, newRequest),
  takeLatest(METAS_DELETE_REQUEST, deleteRequest)
])
