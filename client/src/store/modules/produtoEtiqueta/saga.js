import { call, put, all, takeLatest } from "redux-saga/effects"
import {
  listProdutoEtiquetaRequest,
  listProdutoEtiquetaSuccess,
  prepararNovoSuccess,
  prepararEditarSuccess,
  salvarSuccess,
  editarSuccess,
  gerarRelatorioEtiquetaSuccess,
  error,
} from "./action"

import {
  PRODUTO_ETIQUETA_LIST_REQUEST,
  PRODUTO_ETIQUETA_PREPARAR_EDITAR_REQUEST,
  PRODUTO_ETIQUETA_PREPARAR_NOVO_REQUEST,
  PRODUTO_ETIQUETA_SALVAR_REQUEST,
  PRODUTO_ETIQUETA_EDITAR_REQUEST,
  PRODUTO_ETIQUETA_DELETE_REQUEST,
  PRODUTO_ETIQUETA_GERAR_ETIQUETA_REQUEST
} from "../actionTypes"
import { ServiceProdutoEtiqueta} from "../../../services/serviceProdutoEtiqueta";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import {startLoading, finishLoading} from "../RequestManager/action";

function* listProdutoEtiqueta( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceProdutoEtiqueta.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listProdutoEtiquetaSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* salvar({entity}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceProdutoEtiqueta.salvar, {entity});
    //CHAMADA SUCCESS
    yield put(salvarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* editar({ entity }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceProdutoEtiqueta.editar, {entity});
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
    const retorno = yield call(ServiceProdutoEtiqueta.novo);
    //CHAMADA SUCCESS
    yield put(prepararNovoSuccess(retorno));

    yield put(finishLoading())
  } catch(e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* prepararEditar({ id }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceProdutoEtiqueta.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess( retorno ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* deletar({ id, filtros}) {
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServiceProdutoEtiqueta.deletar, id);
    //CHAMADA SUCCESS
    yield put(listProdutoEtiquetaRequest( filtros ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* gerarEtiqueta({filtros}){
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceProdutoEtiqueta.gerarRelatorioEtiqueta, {
      ...filtros,
    });

    //CHAMADA SUCCESS
    yield put(gerarRelatorioEtiquetaSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all( [
  takeLatest(PRODUTO_ETIQUETA_LIST_REQUEST, listProdutoEtiqueta),
  takeLatest(PRODUTO_ETIQUETA_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(PRODUTO_ETIQUETA_SALVAR_REQUEST, salvar),
  takeLatest(PRODUTO_ETIQUETA_PREPARAR_EDITAR_REQUEST, prepararEditar),
  takeLatest(PRODUTO_ETIQUETA_EDITAR_REQUEST, editar),
  takeLatest(PRODUTO_ETIQUETA_DELETE_REQUEST, deletar),
  takeLatest(PRODUTO_ETIQUETA_GERAR_ETIQUETA_REQUEST, gerarEtiqueta),
])
