import {all, call, put, takeLatest} from "redux-saga/effects";
import {APONTAMENTOS_PENDENTES_LIST_REQUEST, APONTAMENTOS_PENDENTES_EXPORTAR_REQUEST} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {corrigeDataParaEnvio} from "../../../utils/utils";
import {apontamentosPendentesError, apontamentosPendentesListSuccess, apontamentosPendentesExportarSuccess} from "./action";
import {ServiceApontamentosPendentes} from "../../../services/serviceApontamentosPendentes";

function* listar ({filtros}){
  try {
    yield put(startLoading())
    corrigeDataParaEnvio(filtros, 'periodo', 'DD/MM/YYYY HH:mm')
    // CHAMADA API
    const data = yield call(ServiceApontamentosPendentes.listar, filtros)
    //CHAMADA SUCCESS
    yield put(apontamentosPendentesListSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(apontamentosPendentesError(e))
    yield put(finishLoading())
  }
}
function* exportarApontamentosPendentes ({filtros}){
  try {
    yield put(startLoading())
    corrigeDataParaEnvio(filtros, "periodo", "DD/MM/YYYY HH:mm")
    //CHAMADA API
    const retorno = yield call(ServiceApontamentosPendentes.exportar, filtros);
    //CHAMADA SUCCESS
    yield put(apontamentosPendentesExportarSuccess(retorno));
    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(finishLoading());
    yield put(error(e.message));
  }
}

export default all([
  takeLatest(APONTAMENTOS_PENDENTES_LIST_REQUEST, listar),
  takeLatest(APONTAMENTOS_PENDENTES_EXPORTAR_REQUEST, exportarApontamentosPendentes),
])
