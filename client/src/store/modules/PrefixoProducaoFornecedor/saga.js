import {call, put, all, takeLatest} from "redux-saga/effects"
import {
  listPrefixoProducaoFornecedorSuccess,
  updateValorSuccess,
  prepararEditarSuccess,
  error,
} from "./action"
import {
  PREFIXO_PRODUCAO_FORNECEDOR_LIST_REQUEST, PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_REQUEST,
  PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_REQUEST,
} from "../actionTypes"
import {formataMensagemErrorRequisicao} from "../../../utils/formatador";
import history from "../../../services/history";
import {CLIENT_URL} from "../../../config";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServicePrefixoProducaoFornecedor} from "../../../services/servicePrefixoProducaoFornecedor"
import {message} from "antd";

function* listPrefixoProducaoFornecedor(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServicePrefixoProducaoFornecedor.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listPrefixoProducaoFornecedorSuccess(list));
    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* prepararEditar({id}) {
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServicePrefixoProducaoFornecedor.prepararEditar, id);
    //CHAMADA SUCCESS
    yield put(prepararEditarSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}


function* atualizaValor({entity}) {
  try {
    const retorno = yield call(ServicePrefixoProducaoFornecedor.setValor, entity);
    yield put(updateValorSuccess(retorno));

    yield put(finishLoading())

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(PREFIXO_PRODUCAO_FORNECEDOR_LIST_REQUEST, listPrefixoProducaoFornecedor),
  takeLatest(PREFIXO_PRODUCAO_FORNECEDOR_UPDATE_VALOR_REQUEST, atualizaValor),
  takeLatest(PREFIXO_PRODUCAO_FORNECEDOR_PREPARAR_EDITAR_REQUEST, prepararEditar),
])
