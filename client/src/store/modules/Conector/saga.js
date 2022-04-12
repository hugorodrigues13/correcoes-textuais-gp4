import { call, put, all, takeLatest } from "redux-saga/effects";
import { ServiceConector } from "../../../services/serviceConector";
import {
  listConectorSuccess,
  conectorSalvarSuccess,
  listConectorRequest,
  conectorEditarSuccess,
  conectorPrepararNovoSuccess,
  conectorPrepararEditarSuccess,
  error
} from "./action";
import {
  CONECTOR_LIST_REQUEST,
  CONECTOR_SALVAR_REQUEST,
  CONECTOR_DELETE_REQUEST,
  CONECTOR_EDITAR_REQUEST,
  CONECTOR_PREPARAR_NOVO_REQUEST,
  CONECTOR_PREPARAR_EDITAR_REQUEST,
} from "../actionTypes";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import {startLoading, finishLoading} from "../RequestManager/action";

function* listConector(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceConector.getTodos, action.filtros);
    //CHAMDA SUCESS
    const success = yield put(listConectorSuccess(list));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* salvar({data}) {
  try{
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceConector.salvar, {data});

    //CHAMADA SUCCESS
    const success = yield put(conectorSalvarSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* deletar({ id, filtros }) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceConector.deletar, id);
    //CHAMDA SUCESS
    const success = yield put(conectorSalvarSuccess(retorno));
    // REFRESH
    yield put(listConectorRequest(filtros));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* editar({ entity }) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceConector.editar, { entity });

    //CHAMDA SUCCESS
    const success = yield put(conectorEditarSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararNovo() {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceConector.novo);
    //CHAMADA SUCCESS
    yield put(conectorPrepararNovoSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararEditar({id}) {
   try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceConector.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(conectorPrepararEditarSuccess(retorno));

    yield put(finishLoading());

  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(CONECTOR_SALVAR_REQUEST, salvar),
  takeLatest(CONECTOR_LIST_REQUEST, listConector),
  takeLatest(CONECTOR_DELETE_REQUEST, deletar),
  takeLatest(CONECTOR_EDITAR_REQUEST, editar),
  takeLatest(CONECTOR_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(CONECTOR_PREPARAR_EDITAR_REQUEST, prepararEditar),
])
