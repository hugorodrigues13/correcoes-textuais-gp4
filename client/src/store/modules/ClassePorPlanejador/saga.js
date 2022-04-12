import { call, put, all, takeLatest } from "redux-saga/effects"
import {
  listClassePorPlanejadorRequest,
  listClassePorPlanejadorSuccess,
  prepararEditarSuccess,
  prepararNovoSuccess,
  salvarSuccess,
  editarSuccess,
  error
} from "./action"
import {
  CLASSE_POR_PLANEJADOR_LIST_REQUEST,
  CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_REQUEST,
  CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_REQUEST,
  CLASSE_POR_PLANEJADOR_SALVAR_REQUEST,
  CLASSE_POR_PLANEJADOR_EDITAR_REQUEST,
  CLASSE_POR_PLANEJADOR_DELETE_REQUEST,
} from "../actionTypes"
import { ServiceClassePorPlanejador } from "../../../services/serviceClassePorPlanejador"
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import history from "../../../services/history";
import { CLIENT_URL } from "../../../config";
import { startLoading, finishLoading } from "../RequestManager/action";

function* listClassePorPlanejador(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceClassePorPlanejador.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listClassePorPlanejadorSuccess(list));

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
    const retorno = yield call(ServiceClassePorPlanejador.salvar, { entity });
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
    const retorno = yield call(ServiceClassePorPlanejador.editar, { entity });
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
    const retorno = yield call(ServiceClassePorPlanejador.novo);
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
    const retorno = yield call(ServiceClassePorPlanejador.prepararEditar, id);
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
    const retorno = yield call(ServiceClassePorPlanejador.deletar, id);
    //CHAMADA SUCCESS
    yield put(listClassePorPlanejadorRequest(filtros));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

export default all([takeLatest(CLASSE_POR_PLANEJADOR_LIST_REQUEST, listClassePorPlanejador),
    takeLatest(CLASSE_POR_PLANEJADOR_PREPARAR_NOVO_REQUEST, prepararNovo),
    takeLatest(CLASSE_POR_PLANEJADOR_SALVAR_REQUEST, salvar),
    takeLatest(CLASSE_POR_PLANEJADOR_PREPARAR_EDITAR_REQUEST, prepararEditar),
    takeLatest(CLASSE_POR_PLANEJADOR_EDITAR_REQUEST, editar),
    takeLatest(CLASSE_POR_PLANEJADOR_DELETE_REQUEST, deletar)
])

