import { call, put, all, takeLatest } from "redux-saga/effects"
import {
  listDefeitoSuccess,
  listDefeitoRequest,
  prepararNovoSuccess,
  prepararEditarSuccess,
  salvarSuccess,
  editarSuccess,
  error
} from "./Action";
import {
  DEFEITO_LIST_REQUEST,
  DEFEITO_PREPARAR_EDITAR_REQUEST,
  DEFEITO_PREPARAR_NOVO_REQUEST,
  DEFEITO_SALVAR_REQUEST,
  DEFEITO_EDITAR_REQUEST,
  DEFEITO_DELETE_REQUEST, DEFEITO_ATIVAR_OU_DESATIVAR_REQUEST
} from "../actionTypes";
import { ServiceDefeito } from "../../../services/ServiceDefeito"
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServiceUser} from "../../../services/serviceUser";

function* listDefeito( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceDefeito.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listDefeitoSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* salvar({ entity }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceDefeito.salvar, {entity});
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
    const retorno = yield call(ServiceDefeito.editar, {entity});
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
    const retorno = yield call(ServiceDefeito.novo);
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
    const retorno = yield call(ServiceDefeito.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess( retorno ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* deletar({ id, filtros }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceDefeito.deletar, id);
    //CHAMADA SUCCESS
    yield put(listDefeitoRequest(filtros));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* ativarOuDesativar(action) {
  try {
    //CHAMADA API
    yield call(ServiceDefeito.ativarDesativar, action.objeto.id);
    // CHAMADA SUCCESS
    yield call(listDefeito, action);
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
  }
}

export default all( [
  takeLatest(DEFEITO_LIST_REQUEST, listDefeito),
  takeLatest(DEFEITO_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(DEFEITO_SALVAR_REQUEST, salvar),
  takeLatest(DEFEITO_PREPARAR_EDITAR_REQUEST, prepararEditar),
  takeLatest(DEFEITO_EDITAR_REQUEST, editar),
  takeLatest(DEFEITO_DELETE_REQUEST, deletar),
  takeLatest(DEFEITO_ATIVAR_OU_DESATIVAR_REQUEST, ativarOuDesativar)
])
