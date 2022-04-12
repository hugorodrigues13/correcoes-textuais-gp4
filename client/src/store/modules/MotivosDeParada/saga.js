import {all, call, put, takeLatest} from "redux-saga/effects";
import {finishLoading, startLoading} from "../RequestManager/action";
import {
  MOTIVO_DE_PARADA_ATIVAR_OU_DESATIVAR_REQUEST,
  MOTIVO_DE_PARADA_DELETE_REQUEST,
  MOTIVO_DE_PARADA_EDIT_REQUEST,
  MOTIVO_DE_PARADA_LIST_REQUEST, MOTIVO_DE_PARADA_NEW_REQUEST,
  MOTIVO_DE_PARADA_PREPARE_EDIT_REQUEST,
  MOTIVO_DE_PARADA_PREPARE_NEW_REQUEST
} from "../actionTypes";
import {
  motivoParadaDeleteSuccess,
  motivoParadaEditSuccess, motivoParadaError, motivoParadaListRequest,
  motivoParadaListSuccess, motivoParadaNewSuccess,
  motivoParadaPrepareEditSuccess,
  motivoParadaPrepareNewSuccess
} from "./action";
import {ServiceMotivoParada} from "../../../services/serviceMotivoParada";
import {error} from "../Defeito/Action";
import {formataMensagemErrorRequisicao} from "../../../utils/formatador";

function* listMotivoParadaRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMotivoParada.list, action.filtros);
    //CHAMADA SUCCESS
    yield put(motivoParadaListSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(motivoParadaError(e.message));
    yield put(finishLoading())
  }
}

function* prepareEditRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMotivoParada.prepareEdit, action.id);
    //CHAMADA SUCCESS
    yield put(motivoParadaPrepareEditSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(motivoParadaError(e.message));
    yield put(finishLoading())
  }
}

function* prepareNewRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMotivoParada.prepareNew);
    //CHAMADA SUCCESS
    yield put(motivoParadaPrepareNewSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(motivoParadaError(e.message));
    yield put(finishLoading())
  }
}

function* editRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMotivoParada.edit, action.values);
    //CHAMADA SUCCESS
    yield put(motivoParadaEditSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(motivoParadaError(e.message));
    yield put(finishLoading())
  }
}

function* newRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMotivoParada.novo, action.values);
    //CHAMADA SUCCESS
    yield put(motivoParadaNewSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(motivoParadaError(e.message));
    yield put(finishLoading())
  }
}

function* deleteRequest( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceMotivoParada.deletar, action.id);
    //CHAMADA SUCCESS
    yield put(motivoParadaDeleteSuccess(list));
    yield put(motivoParadaListRequest(action.filtros))
    yield put(finishLoading())
  } catch (e) {
    yield put(motivoParadaError(e.message));
    yield put(finishLoading())
  }
}

function* ativarOuDesativar(action) {
  try {
    //CHAMADA API
    yield call(ServiceMotivoParada.ativarDesativar, action.objeto.id);
    // CHAMADA SUCCESS
    yield call(listMotivoParadaRequest, action);
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
  }
}

export default all( [
  takeLatest(MOTIVO_DE_PARADA_LIST_REQUEST, listMotivoParadaRequest),
  takeLatest(MOTIVO_DE_PARADA_PREPARE_EDIT_REQUEST, prepareEditRequest),
  takeLatest(MOTIVO_DE_PARADA_PREPARE_NEW_REQUEST, prepareNewRequest),
  takeLatest(MOTIVO_DE_PARADA_EDIT_REQUEST, editRequest),
  takeLatest(MOTIVO_DE_PARADA_NEW_REQUEST, newRequest),
  takeLatest(MOTIVO_DE_PARADA_DELETE_REQUEST, deleteRequest),
  takeLatest(MOTIVO_DE_PARADA_ATIVAR_OU_DESATIVAR_REQUEST, ativarOuDesativar)
])
