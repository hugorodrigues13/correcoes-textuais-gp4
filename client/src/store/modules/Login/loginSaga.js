import Alert from "react-s-alert";
import { call, put, all, takeLatest } from "redux-saga/effects";

import { ServiceLogin } from "../../../services/serviceLogin";
import { ServicePerfil } from "../../../services/servicePerfil";
import {
  loginSucess,
  setSessaoSate,
  loginClean,
  getPermissaoSuccess
  // getPermissaoRequest
} from "./loginAction";
import {
  LOGIN_REQUEST,
  LOGIN_ERROR,
  LOGOUT,
  LOGIN_PERMISSAO_REQUEST
} from "../actionTypes";
import api from "../../../services/api";
import {finishLoading, startLoading} from "../RequestManager/action";
import history from "../../../services/history";
import {CLIENT_URL} from "../../../config";
import {ServiceUser} from "../../../services/serviceUser";

function* login(action) {
  try {
    yield put(startLoading());
    const user = yield call(ServiceLogin.login, action.user);
    const { linguagem } = yield call(ServiceUser.getLinguagemPadrao);
    user.linguagem = linguagem;

    yield put(
      setSessaoSate({
        isExpirada: false,
        isUsuarioLogado: true,
        rotaAtual: "login",
        isExibirModalLogin: false
      })
    );
    yield put(loginSucess(user));
    yield call(history.push, CLIENT_URL);
    yield put(finishLoading());
  } catch (e) {
    yield put({ type: LOGIN_ERROR, error: e.message });
    Alert.error(e.message);
    yield put(finishLoading());
  }
}

function* logout() {
  try {
    yield call(api.unsetAuth);
    yield put(loginClean());
    localStorage.removeItem("seriais")
  } catch (e) {
    yield put({ type: LOGIN_ERROR, error: e.message });
  }
}

function* getPermissoes() {
  try {
    const { permissoes } = yield call(ServicePerfil.getPermissoesUsuarioLogado);
    const user = JSON.parse(localStorage.getItem("user") || {});
    user.permissoes = permissoes;
    localStorage.setItem("user", JSON.stringify(user));
    yield put(getPermissaoSuccess(permissoes));
  } catch (e) {
    yield put({ type: LOGIN_ERROR, error: e.message });
  }
}

export default all([
  takeLatest(LOGIN_REQUEST, login),
  takeLatest(LOGOUT, logout),
  takeLatest(LOGIN_PERMISSAO_REQUEST, getPermissoes)
]);
