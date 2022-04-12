import {all, call, put, takeLatest} from "redux-saga/effects";
import {
  APONTAMENTO_DE_MATERIAL_APONTAR_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_REQUEST,
  APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_REQUEST,
  APONTAMENTO_DE_MATERIAL_IMPORTAR_ARQUIVO_REQUEST, APONTAMENTO_DE_MATERIAL_LIST_REQUEST
} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {
  buscarLotesDisponiveisSuccess,
  buscarMateriaisSuccess,
  buscarOrdensDeProducaoSuccess,
  importarArquivoSuccess,
  error,
  apontarSuccess,
  listSuccess
} from "./action";
import {ServiceApontamentoDeMaterial} from "../../../services/serviceApontamentoDeMaterial";
import {message} from "antd";
import {getMessage} from "../../../components/messages";
import {corrigeDataParaEnvio} from "../../../utils/utils";

function* list(action) {
  try {
    yield put(startLoading());
    corrigeDataParaEnvio(action.filtros, 'data', "DD/MM/YYYY HH:mm:ss", true)

    //CHAMADA API
    const list = yield call(ServiceApontamentoDeMaterial.list, action.filtros);
    //CHAMDA SUCESS
    const success = yield put(listSuccess(list));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* buscarOrdensDeProducao({ ordemDeProducao }){
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceApontamentoDeMaterial.buscarOrdensDeProducao, ordemDeProducao);

    //CHAMADA SUCCESS
    yield put(buscarOrdensDeProducaoSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* buscarMateriais({ ordemDeProducao }){
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceApontamentoDeMaterial.buscarMateriais, ordemDeProducao);

    //CHAMADA SUCCESS
    yield put(buscarMateriaisSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* buscarLotesDisponiveis({material}){
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceApontamentoDeMaterial.buscarLotesDisponiveis, material);

    //CHAMADA SUCCESS
    yield put(buscarLotesDisponiveisSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* apontar({material}){
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceApontamentoDeMaterial.apontar, material);

    //CHAMADA SUCCESS
    yield put(apontarSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* importarArquivoApontamentos({formData}){
  try {
    const loading = message.loading(getMessage("apontamentoDeMaterial.importarModal.carregando.label"), 0)
    yield put(startLoading());
    const data = yield call(ServiceApontamentoDeMaterial.importar, {formData})
    yield put(importarArquivoSuccess(data))
    yield put(finishLoading());
    setTimeout(loading, 0)
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(APONTAMENTO_DE_MATERIAL_LIST_REQUEST, list),
  takeLatest(APONTAMENTO_DE_MATERIAL_BUSCA_ORDENS_DE_PRODUCAO_REQUEST, buscarOrdensDeProducao),
  takeLatest(APONTAMENTO_DE_MATERIAL_BUSCA_MATERIAIS_REQUEST, buscarMateriais),
  takeLatest(APONTAMENTO_DE_MATERIAL_BUSCA_LOTES_DISPONIVEIS_REQUEST, buscarLotesDisponiveis),
  takeLatest(APONTAMENTO_DE_MATERIAL_IMPORTAR_ARQUIVO_REQUEST, importarArquivoApontamentos),
  takeLatest(APONTAMENTO_DE_MATERIAL_APONTAR_REQUEST, apontar)
])
