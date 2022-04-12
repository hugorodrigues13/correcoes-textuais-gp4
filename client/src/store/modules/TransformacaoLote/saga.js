import {all, put, takeLatest, call} from "redux-saga/effects";
import {
  TRANSFORMACAO_LOTE_AGRUPAR_REQUEST,
  TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_REQUEST,
  TRANSFORMACAO_LOTE_DIVIDIR_REQUEST, TRANSFORMACAO_LOTE_PESQUISAR_LOTES_REQUEST
} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {
  transformacaoLoteAgruparSuccess, transformacaoLoteBuscarCaixasRequest,
  transformacaoLoteBuscarCaixasSuccess,
  transformacaoLoteDividirLoteSuccess,
  transformacaoLoteError, transformacaoLotePesquisarLotesSuccess
} from "./action";
import {ServiceTransformacaoLote} from "../../../services/serviceTransformacaoLote";

function* buscarCaixas(action){
  try {
    yield put(startLoading())

    // CHAMADA API
    const data = yield call(ServiceTransformacaoLote.buscarCaixas, action.lote)
    //CHAMADA SUCCESS
    yield put(transformacaoLoteBuscarCaixasSuccess(data))

    yield put(finishLoading())
  } catch (e){
    yield put(transformacaoLoteError(e))
    yield put(finishLoading())
  }
}

function* dividir(action){
  try {
    yield put(startLoading())

    // CHAMADA API
    const data = yield call(ServiceTransformacaoLote.dividirLote, action.lote, action.novoLoteCaixas)
    //CHAMADA SUCCESS
    yield put(transformacaoLoteDividirLoteSuccess(data))
    yield put(transformacaoLoteBuscarCaixasRequest(action.lote))
    yield put(finishLoading())
  } catch (e){
    yield put(transformacaoLoteError(e))
    yield put(finishLoading())
  }
}

function* agrupar(action){
  try {
    yield put(startLoading())

    // CHAMADA API
    const data = yield call(ServiceTransformacaoLote.agruparLote, action.lote1, action.lote2, action.manterLote1)
    //CHAMADA SUCCESS
    yield put(transformacaoLoteAgruparSuccess(data))

    yield put(finishLoading())
  } catch (e){
    yield put(transformacaoLoteError(e))
    yield put(finishLoading())
  }
}

function* pesquisarLote(action){
  try {
    yield put(startLoading())

    // CHAMADA API
    const data = yield call(ServiceTransformacaoLote.pesquisarLotes, action.lote1, action.lote2)
    //CHAMADA SUCCESS
    yield put(transformacaoLotePesquisarLotesSuccess(data))

    yield put(finishLoading())
  } catch (e){
    yield put(transformacaoLoteError(e))
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(TRANSFORMACAO_LOTE_BUSCAR_CAIXAS_REQUEST, buscarCaixas),
  takeLatest(TRANSFORMACAO_LOTE_DIVIDIR_REQUEST, dividir),
  takeLatest(TRANSFORMACAO_LOTE_AGRUPAR_REQUEST, agrupar),
  takeLatest(TRANSFORMACAO_LOTE_PESQUISAR_LOTES_REQUEST, pesquisarLote),
])
