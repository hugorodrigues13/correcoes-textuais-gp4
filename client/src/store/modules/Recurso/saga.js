import { call, put, all, takeLatest } from "redux-saga/effects"
import {
  listRecursoSuccess,
  prepararNovoSuccess,
  prepararEditarSuccess,
  salvarSuccess,
  editarSuccess,
  listRecursoRequest, error, prepararClonarSuccess
} from "./action"
import {
  RECURSO_LIST_REQUEST,
  RECURSO_PREPARAR_NOVO_REQUEST,
  RECURSO_PREPARAR_EDITAR_REQUEST,
  RECURSO_SALVAR_REQUEST,
  RECURSO_EDITAR_REQUEST,
  RECURSO_DELETE_REQUEST, RECURSO_ATIVAR_OU_DESATIVAR_REQUEST
} from "../actionTypes"
import { ServiceRecurso } from "../../../services/serviceRecurso"
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import { startLoading, finishLoading } from "../RequestManager/action";

function* listRecurso( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceRecurso.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listRecursoSuccess(list));

    yield put (finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* salvar( { entity } ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceRecurso.salvar, {entity});
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
    const retorno = yield call(ServiceRecurso.editar, {entity});
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
    const retorno = yield call(ServiceRecurso.novo);
    //CHAMADA SUCCESS
    yield put(prepararNovoSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* prepararEditar({id}) {
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServiceRecurso.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess( retorno ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* prepararClonar({ id }) {
  try {
    yield put(startLoading());
    const retorno = yield call(ServiceRecurso.prepararClonar, id);
    yield put(prepararClonarSuccess(retorno));
  } catch(e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
  } finally {
    yield put(finishLoading());
  }
}

function* deletar({ id, filtros }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceRecurso.deletar, id);
    //CHAMADA SUCCESS
    yield put(listRecursoRequest(filtros));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}


function* ativarOuDesativar(action) {
  try {
    //CHAMADA API
    yield call(ServiceRecurso.ativarDesativar, action.objeto.id);
    // CHAMADA SUCCESS
    yield call(listRecurso, action);
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
  }
}

export default all( [
  takeLatest(RECURSO_LIST_REQUEST, listRecurso),
  takeLatest(RECURSO_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(RECURSO_SALVAR_REQUEST, salvar),
  takeLatest(RECURSO_PREPARAR_EDITAR_REQUEST, prepararEditar),
  takeLatest(RECURSO_EDITAR_REQUEST, editar),
  takeLatest(RECURSO_DELETE_REQUEST, deletar),
  takeLatest(RECURSO_ATIVAR_OU_DESATIVAR_REQUEST, ativarOuDesativar)
])
