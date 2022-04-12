import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  listPerfilSuccess,
  perfilSalvarSucess,
  perfilEditarSucess,
  error,
  listPerfilRequest,
  prepararNovoSuccess,
  prepararEditarSuccess
} from "./action";
import {
  PERFIL_LIST_REQUEST,
  PERFIL_SALVAR_REQUEST,
  PERFIL_DELETE_REQUEST,
  PERFIL_EDITAR_REQUEST,
  PERFIL_PREPARAR_NOVO_REQUEST,
  PERFIL_PREPARAR_EDITAR_REQUEST
} from "../actionTypes";
import { ServicePerfil } from "../../../services/servicePerfil";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import history from "../../../services/history";
import { CLIENT_URL } from "../../../config";
import {startLoading, finishLoading} from "../RequestManager/action";

function* listLogOperacao(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServicePerfil.getTodos, action.filtros);
    //CHAMDA SUCESS
    yield put(listPerfilSuccess(list));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* salvar({ entity }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServicePerfil.salvar, { entity });
    //CHAMDA SUCESS
    yield put(perfilSalvarSucess(retorno));
    if (!entity.id) {
      history.push(CLIENT_URL + "/seg/perfil");
    }

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* deletar({ id, filtros }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServicePerfil.deletar, id);
    //CHAMDA SUCESS
    yield put(perfilSalvarSucess(retorno));
    // REFRESH
    yield put(listPerfilRequest(filtros));

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
    const retorno = yield call(ServicePerfil.editar, { entity });
    //CHAMDA SUCCESS
    yield put(perfilEditarSucess(retorno));

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
    const retorno = yield call(ServicePerfil.novo);
    //CHAMADA SUCCESS
    yield put(prepararNovoSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararEditar({id}) {
  // try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield  call(ServicePerfil.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess(retorno));

    yield put(finishLoading());
  /*} catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }*/
}

export default all([
  takeLatest(PERFIL_LIST_REQUEST, listLogOperacao),
  takeLatest(PERFIL_SALVAR_REQUEST, salvar),
  takeLatest(PERFIL_DELETE_REQUEST, deletar),
  takeLatest(PERFIL_EDITAR_REQUEST, editar),
  takeLatest(PERFIL_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(PERFIL_PREPARAR_EDITAR_REQUEST, prepararEditar)
]);
