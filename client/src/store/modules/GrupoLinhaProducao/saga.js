import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  listGrupoLinhaProducaoSuccess,
  salvarSuccess,
  editarSuccess,
  error,
  listGrupoLinhaProducaoRequest,
  prepararNovoSuccess,
  prepararEditarSuccess, grupoLinhaProducaoExportarSuccess
} from "./action";
import {
  GRUPO_LINHA_PRODUCAO_LIST_REQUEST,
  GRUPO_LINHA_PRODUCAO_SALVAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_EDITAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_REQUEST,
  GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_DELETE_REQUEST,
  GRUPO_LINHA_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
  GRUPO_LINHA_PRODUCAO_EXPORTAR_REQUEST
} from "../actionTypes";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServiceGrupoLinhaProducao} from "../../../services/serviceGrupoLinhaProducao";

function* listGrupoLinhaProducao( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceGrupoLinhaProducao.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listGrupoLinhaProducaoSuccess( list ));
    // console.log("Estou aqui!")
    // console.log(list)
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
    const retorno = yield call(ServiceGrupoLinhaProducao.salvar, { entity });
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
    const retorno = yield call(ServiceGrupoLinhaProducao.deletar, id);
    //CHAMADA SUCCESS
    yield put(listGrupoLinhaProducaoRequest(filtros));

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
    const retorno = yield call(ServiceGrupoLinhaProducao.editar, { entity });
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
    const retorno = yield call(ServiceGrupoLinhaProducao.novo);
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
    const retorno = yield call(ServiceGrupoLinhaProducao.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}


function* ativarOuDesativar(action) {
  try {
    //CHAMADA API
    yield call(ServiceGrupoLinhaProducao.ativarDesativar, action.objeto.id);
    // CHAMADA SUCCESS
    yield call(listGrupoLinhaProducao, action);
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
  }
}

function* exportar({ filtros }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceGrupoLinhaProducao.exportar, filtros);
    //CHAMADA SUCCESS
    yield put(grupoLinhaProducaoExportarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(GRUPO_LINHA_PRODUCAO_LIST_REQUEST, listGrupoLinhaProducao),
  takeLatest(GRUPO_LINHA_PRODUCAO_SALVAR_REQUEST, salvar),
  takeLatest(GRUPO_LINHA_PRODUCAO_DELETE_REQUEST, deletar),
  takeLatest(GRUPO_LINHA_PRODUCAO_EDITAR_REQUEST, editar),
  takeLatest(GRUPO_LINHA_PRODUCAO_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(GRUPO_LINHA_PRODUCAO_PREPARAR_EDITAR_REQUEST, prepararEditar),
  takeLatest(GRUPO_LINHA_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST, ativarOuDesativar),
  takeLatest(GRUPO_LINHA_PRODUCAO_EXPORTAR_REQUEST, exportar),
])
