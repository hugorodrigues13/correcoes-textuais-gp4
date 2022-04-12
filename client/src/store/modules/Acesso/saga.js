import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  listAcessoSuccess,
  salvarSuccess,
  editarSuccess,
  error,
  listAcessoRequest,
  prepararNovoSuccess,
  prepararEditarSuccess
} from "./action";
import {
  ACESSO_LIST_REQUEST,
  ACESSO_SALVAR_REQUEST,
  ACESSO_EDITAR_REQUEST,
  ACESSO_PREPARAR_NOVO_REQUEST,
  ACESSO_PREPARAR_EDITAR_REQUEST, ACESSO_DELETE_REQUEST
} from "../actionTypes";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import history from "../../../services/history";
import { CLIENT_URL } from "../../../config";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServiceAcesso} from "../../../services/serviceAcesso";

function* listAcesso( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceAcesso.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listAcessoSuccess( list ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* salvar({ entity }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceAcesso.salvar, { entity });
    //CHAMADA SUCCESS
    yield put(salvarSuccess(retorno));

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
    const retorno = yield call(ServiceAcesso.deletar, id);
    //CHAMADA SUCCESS
    yield put(listAcessoRequest(filtros));

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
    const retorno = yield call(ServiceAcesso.editar, { entity });
    //CHAMADA SUCCESS
    yield put(editarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* prepararNovo() {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceAcesso.novo);
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

    //CHAMADA API
    const retorno = yield call(ServiceAcesso.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(ACESSO_LIST_REQUEST, listAcesso),
  takeLatest(ACESSO_SALVAR_REQUEST, salvar),
  takeLatest(ACESSO_DELETE_REQUEST, deletar),
  takeLatest(ACESSO_EDITAR_REQUEST, editar),
  takeLatest(ACESSO_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(ACESSO_PREPARAR_EDITAR_REQUEST, prepararEditar)
])
