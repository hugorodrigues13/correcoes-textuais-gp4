import { call, put, all, takeLatest } from "redux-saga/effects";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServiceGeracaoOrdemDeProducao} from "../../../services/serviceGeracaoOrdemDeProducao";
import {
  buscarFornecedoresListasRoteirosSuccess,
  buscarPorOrdemDeVendaSuccess,
  buscarProdutosSuccess,
  gerarOrdemDeProducaoSuccess,
  selecionarListaRoteiroSuccess,
  selecionarOrdensSuccess,
  error,
  selecionarDataSuccess,
  importarOrdensSuccess,
  selecionarJustificativaSuccess,
  getUsuariosFornecedoresSuccess
} from "./action";
import * as ACTIONS from "../actionTypes";
import {message} from "antd";
import {getMessage} from "../../../components/messages";

function* buscarProdutos({codigo, descricao}) {
  try {
    yield put(startLoading());

    const list = yield call(ServiceGeracaoOrdemDeProducao.buscarProdutos, {codigo, descricao})

    yield put(buscarProdutosSuccess(list))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* buscarFornecedoresListasRoteiros({codigo}) {
  try {
    yield put(startLoading());
    yield put(buscarFornecedoresListasRoteirosSuccess(codigo))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* buscarPorOV({ordemDeVenda, codigoProduto}) {
  try {
    yield put(startLoading());

    const list = yield call(ServiceGeracaoOrdemDeProducao.buscarPorOV, {ordemDeVenda, codigoProduto})

    yield put(buscarPorOrdemDeVendaSuccess(list))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* gerar({entity}) {
  try {
    yield put(startLoading());
    const data = yield call(ServiceGeracaoOrdemDeProducao.gerar, {entity})

    yield put(gerarOrdemDeProducaoSuccess(data))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* selecionar({entities, rows}) {
  try {
    yield put(startLoading());
    yield put(selecionarOrdensSuccess(entities, rows))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* selecionarListaRoteiro({entity, lista, roteiro, fornecedor, propriedade}) {
  try {
    yield put(startLoading());
    yield put(selecionarListaRoteiroSuccess(entity, lista, roteiro, fornecedor, propriedade))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* selecionarData({entity, data}) {
  try {
    yield put(startLoading());
    yield put(selecionarDataSuccess(entity, data))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* selecionarJustificativa({entity, justificativa}) {
  try {
    yield put(startLoading());
    yield put(selecionarJustificativaSuccess(entity, justificativa))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* importarOrdens({formData}){
  try {
    const loading = message.loading(getMessage("geracaoOrdemDeProducao.importarModal.carregando.label"), 0)
    yield put(startLoading());
    const data = yield call(ServiceGeracaoOrdemDeProducao.importar, {formData})
    yield put(importarOrdensSuccess(data))
    yield put(finishLoading());
    setTimeout(loading, 0)
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* getFornecedores(){
  try {
    yield put(startLoading());
    const data = yield call(ServiceGeracaoOrdemDeProducao.getUserFornecedores)
    yield put(getUsuariosFornecedoresSuccess(data))
    yield put(finishLoading());

  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_PRODUTOS_REQUEST, buscarProdutos),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_POR_OV_REQUEST, buscarPorOV),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_BUSCAR_FORNECEDORES_LISTAS_ROTEIROS_REQUEST, buscarFornecedoresListasRoteiros),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_GERAR_REQUEST, gerar),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_ORDENS_REQUEST, selecionar),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_LISTA_ROTEIRO_REQUEST, selecionarListaRoteiro),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_DATA_REQUEST, selecionarData),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_SELECIONAR_JUSTIFICATIVA_REQUEST, selecionarJustificativa),
  takeLatest(ACTIONS.GERACAO_DE_ORDEM_DE_PRODUCAO_USER_FORNECEDORES_REQUEST, getFornecedores),
  takeLatest(ACTIONS.GERACAO_ORDEM_DE_PRODUCAO_IMPORTAR_ORDENS_REQUEST, importarOrdens)
])
