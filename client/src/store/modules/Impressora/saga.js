import { call, put, all, takeLatest } from "redux-saga/effects"
import {
  listImpressoraRequest,
  listImpressoraSuccess,
  prepararEditarSuccess,
  prepararNovoSuccess,
  salvarSuccess,
  editarSuccess, error,
} from "./action"
import {
  IMPRESSORA_LIST_REQUEST,
  IMPRESSORA_PREPARAR_EDITAR_REQUEST,
  IMPRESSORA_PREPARAR_NOVO_REQUEST,
  IMPRESSORA_SALVAR_REQUEST,
  IMPRESSORA_EDITAR_REQUEST,
  IMPRESSORA_DELETE_REQUEST,
} from "../actionTypes"
import { ServiceImpressora } from "../../../services/serviceImpressora"
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import history from "../../../services/history";
import { CLIENT_URL } from "../../../config";
import { startLoading, finishLoading } from "../RequestManager/action";

function* listImpressora(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceImpressora.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listImpressoraSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* salvar({ entity }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceImpressora.salvar, { entity });
    //CHAMADA SUCCESS
    yield put(salvarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* editar({ entity }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceImpressora.editar, { entity });
    //CHAMADA SUCCESS
    yield put(editarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* prepararNovo() {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceImpressora.novo);
    //CHAMADA SUCCESS
    yield put(prepararNovoSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* prepararEditar({ id }) {
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServiceImpressora.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* deletar({ id, filtros }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceImpressora.deletar, id);
    //CHAMADA SUCCESS
    yield put(listImpressoraRequest(filtros));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

export default all([takeLatest(IMPRESSORA_LIST_REQUEST, listImpressora),
    takeLatest(IMPRESSORA_PREPARAR_NOVO_REQUEST, prepararNovo),
    takeLatest(IMPRESSORA_SALVAR_REQUEST, salvar),
    takeLatest(IMPRESSORA_PREPARAR_EDITAR_REQUEST, prepararEditar),
    takeLatest(IMPRESSORA_EDITAR_REQUEST, editar),
    takeLatest(IMPRESSORA_DELETE_REQUEST, deletar)
])

