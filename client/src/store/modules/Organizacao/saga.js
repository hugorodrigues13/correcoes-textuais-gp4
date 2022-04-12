import { call, put, all, takeLatest } from "redux-saga/effects";
import {listSuccess, setOrganizacaoSuccess, error, setFornecedorSuccess} from "./action";
import {ORGANIZACAO_LIST_REQUEST, ORGANIZACAO_SET, ORGANIZACAO_SET_FORNECEDOR_REQUEST} from "../actionTypes";
import { ServiceUser } from "../../../services/serviceUser";
import {startLoading, finishLoading} from "../RequestManager/action";

function* list() {
  try {
    yield put(startLoading())

    //CHAMADA API
    const list = yield call(
      ServiceUser.getAcessosDoUsuario
    );
    //CHAMDA SUCCESS
    yield put(listSuccess(list));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* changeOrganizacao({ organizacao, isLogin }) {
  try {
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceUser.changeOrganizacao, { organizacaoId: organizacao });
    //CHAMADA SUCCESS
    yield put(setOrganizacaoSuccess(organizacao, isLogin, retorno.fornecedores));

    localStorage.removeItem("seriais")

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* changeFornecedor({ fornecedor, isLogin }) {
  try {
    yield put(startLoading())

    //CHAMADA API
    yield call(ServiceUser.changeFornecedor, { fornecedorId: fornecedor });
    //CHAMADA SUCCESS
    yield put(setFornecedorSuccess(fornecedor, isLogin));

    localStorage.removeItem("seriais")

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(ORGANIZACAO_LIST_REQUEST, list),
  takeLatest(ORGANIZACAO_SET, changeOrganizacao),
  takeLatest(ORGANIZACAO_SET_FORNECEDOR_REQUEST, changeFornecedor)
]);
