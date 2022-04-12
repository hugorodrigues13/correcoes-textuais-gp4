import {call, put, all, takeLatest} from "redux-saga/effects";
import {
  grupoRecursoListSuccess,
  grupoRecursoListRequest,
  grupoRecursoSalvarSuccess,
  grupoRecursoEditarSuccess,
  grupoRecursoPrepararNovoSuccess,
  grupoRecursoPrepararEditarSuccess, error
} from "./action";
import {
  GRUPO_RECURSO_LIST_REQUEST,
  GRUPO_RECURSO_SALVAR_REQUEST,
  GRUPO_RECURSO_EDITAR_REQUEST,
  GRUPO_RECURSO_DELETAR_REQUEST,
  GRUPO_RECURSO_PREPARAR_NOVO_REQUEST,
  GRUPO_RECURSO_PREPARAR_EDITAR_REQUEST, GRUPO_RECURSO_ATIVAR_OU_DESATIVAR_REQUEST,
} from "../actionTypes";
import {startLoading, finishLoading} from "../RequestManager/action";
import {formataMensagemErrorRequisicao} from "../../../utils/formatador";
import {ServiceGrupoRecurso} from "../../../services/serviceGrupoRecurso";

function* list(action) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceGrupoRecurso.list, action.filtros);

    //CHAMADA SUCCESS
    yield put(grupoRecursoListSuccess(retorno))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(formataMensagemErrorRequisicao(e));
    yield put(finishLoading());
  }
}

function* salvar({entity}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceGrupoRecurso.salvar, {entity})

    //CHAMADA SUCCESS
    yield put(grupoRecursoSalvarSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* editar({entity}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceGrupoRecurso.editar, {entity})

    //CHAMADA SUCCESS
    yield put(grupoRecursoEditarSuccess(retorno))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* deletar({id, filtros}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceGrupoRecurso.deletar, id)
    //CHAMADA SUCCESS
    yield put(grupoRecursoSalvarSuccess(retorno))
    //REFRESH
    yield put(grupoRecursoListRequest(filtros))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* prepararNovo() {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceGrupoRecurso.novo)
    //CHAMADA SUCCESS
    yield put(grupoRecursoPrepararNovoSuccess(retorno))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* prepararEditar({id}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceGrupoRecurso.prepararEditar, id)

    //CHAMADA SUCCESS
    yield put(grupoRecursoPrepararEditarSuccess(retorno))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* ativarOuDesativar(action) {
  try {
    //CHAMADA API
    yield call(ServiceGrupoRecurso.ativarDesativar, action.objeto.id);
    // CHAMADA SUCCESS
    yield call(list, action);
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
  }
}

export default all([
  takeLatest(GRUPO_RECURSO_LIST_REQUEST, list),
  takeLatest(GRUPO_RECURSO_SALVAR_REQUEST, salvar),
  takeLatest(GRUPO_RECURSO_EDITAR_REQUEST, editar),
  takeLatest(GRUPO_RECURSO_DELETAR_REQUEST, deletar),
  takeLatest(GRUPO_RECURSO_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(GRUPO_RECURSO_PREPARAR_EDITAR_REQUEST, prepararEditar),
  takeLatest(GRUPO_RECURSO_ATIVAR_OU_DESATIVAR_REQUEST, ativarOuDesativar)
]);
