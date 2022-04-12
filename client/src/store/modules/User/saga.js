import { call, put, all, takeLatest } from "redux-saga/effects";
import { ServiceUser } from "../../../services/serviceUser";
import {
  error,
  getUserAllSuccess,
  deleteUSerSuccess,
  getUserAllRequest,
  salvarSuccess,
  alterarDadosUsuarioSuccess,
  currentSuccess,
  prepararNovoUserSuccess,
  prepararEditarPerfilSuccess,
  prepararEditarUserSuccess,
  editarSuccess,
  grupoRecursoSuccess,
  getRecursoPeloIdSuccess, setUsuarioColunasSuccess, getUsuarioColunasSuccess
} from "./action";
import {
  USER_LIST_ALL_REQUEST,
  USER_DELETE_REQUEST,
  USER_ATIVAR_OU_DESATIVAR_REQUEST,
  USER_SALVAR_REQUEST,
  USER_ALTERAR_REQUEST,
  USER_CURRENT_REQUEST,
  USER_PREPARAR_NOVO_REQUEST,
  USER_PREPARAR_EDITAR_REQUEST,
  USER_PREPARAR_EDITAR_PERFIL_REQUEST, USER_EDITAR_REQUEST,
  USER_GRUPO_RECURSO_REQUEST, USER_RECURSO_REQUEST, USER_SET_COLUNAS_REQUEST, USER_GET_COLUNAS_REQUEST
} from "../actionTypes";
import history from "../../../services/history";
import { CLIENT_URL } from "../../../config";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServiceGrupoRecurso} from "../../../services/serviceGrupoRecurso";

function* getUserAll(action) {
  try {
    if(action.type !== "@user/ATIVAR_DESATIVAR_REQUEST") {
      yield put(startLoading());
    }
    //CHAMADA API
    const userList = yield call(ServiceUser.getTodosUsuarios, action.filtros);
    //CHAMDA SUCESS
    yield put(getUserAllSuccess(userList));

    yield put(finishLoading());
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* deleteUser(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    yield call(ServiceUser.deleteUser, action.id);
    // DELETE
    yield put(deleteUSerSuccess());
    // REFRESH
    yield put(getUserAllRequest(action.filtros));

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* ativarOuDesativar(action) {
  try {
    //CHAMADA API
    yield call(ServiceUser.ativarDesativar, action.objeto.id);
    // CHAMADA SUCCESS
    yield call(getUserAll, action);
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
  }
}

function* salvar(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    yield call(ServiceUser.salvar, {
      entity: action.entity
    });
    // CHAMADA SUCCESS
    yield put(salvarSuccess());
    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* editar(action) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceUser.editar, action);
    //CHAMADA SUCCESS
    yield put(editarSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* alterarUsuario(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    yield call(ServiceUser.salvarDadosDoUsuario, {
      entity: action.entity
    });
    // CHAMADA SUCCESS
    yield put(alterarDadosUsuarioSuccess());

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararNovo() {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceUser.novo);
    //CHAMADA SUCCESS
    yield put(prepararNovoUserSuccess(retorno));

    yield put(finishLoading());
  } catch(e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararEditar({id}){
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceUser.preparaEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarUserSuccess(retorno));

    yield put(finishLoading());
  } catch(e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararEditarPerfil() {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceUser.getPerfil);
    //CHAMADA SUCCESS
    yield put(prepararEditarPerfilSuccess(retorno));

    yield put(finishLoading());
  } catch(e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* currentRequest() {
  try {
    yield put(startLoading());

    const user = yield call(ServiceUser.getPerfil);
    yield put(currentSuccess(user));

    yield put(finishLoading());
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* grupoRecurso() {
  try {
    yield put(startLoading());

    const grupoRecurso = yield call(ServiceGrupoRecurso.list);
    yield put(grupoRecursoSuccess(grupoRecurso));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* getRecursoPeloId({ id }) {
  try {
    yield put(startLoading());

    const response = yield call(ServiceUser.getRecursoPeloId, id);
    yield put(getRecursoPeloIdSuccess(response));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* setColunasRequest({ tipo, colunas }) {
  try {
    yield put(startLoading());

    const response = yield call(ServiceUser.setUsuarioColunas, tipo, colunas);
    yield put(setUsuarioColunasSuccess(response));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* getColunasRequest({ tipo }) {
  try {
    yield put(startLoading());

    const response = yield call(ServiceUser.getUsuarioColunas, tipo);
    yield put(getUsuarioColunasSuccess(response));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(USER_LIST_ALL_REQUEST, getUserAll),
  takeLatest(USER_DELETE_REQUEST, deleteUser),
  takeLatest(USER_ATIVAR_OU_DESATIVAR_REQUEST, ativarOuDesativar),
  takeLatest(USER_SALVAR_REQUEST, salvar),
  takeLatest(USER_ALTERAR_REQUEST, alterarUsuario),
  takeLatest(USER_CURRENT_REQUEST, currentRequest),
  takeLatest(USER_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(USER_PREPARAR_EDITAR_REQUEST, prepararEditar),
  takeLatest(USER_PREPARAR_EDITAR_PERFIL_REQUEST, prepararEditarPerfil),
  takeLatest(USER_EDITAR_REQUEST, editar),
  takeLatest(USER_GRUPO_RECURSO_REQUEST, grupoRecurso),
  takeLatest(USER_RECURSO_REQUEST, getRecursoPeloId),
  takeLatest(USER_SET_COLUNAS_REQUEST, setColunasRequest),
  takeLatest(USER_GET_COLUNAS_REQUEST, getColunasRequest),
]);
