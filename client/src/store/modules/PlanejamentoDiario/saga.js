import {all, call, put, takeLatest} from "redux-saga/effects";
import {
  PLANEJAMENTO_DIARIO_DELETAR_REQUEST,
  PLANEJAMENTO_DIARIO_EDIT_REQUEST, PLANEJAMENTO_DIARIO_EXPORTAR_REQUEST,
  PLANEJAMENTO_DIARIO_LISTAR_REQUEST,
  PLANEJAMENTO_DIARIO_NOVO_REQUEST,
  PLANEJAMENTO_DIARIO_PREPARE_EDIT_REQUEST, PLANEJAMENTO_DIARIO_PREPARE_NEW_REQUEST
} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {corrigeDataParaEnvio} from "../../../utils/utils";
import {
  planejamentoDiarioDeletarSuccess,
  planejamentoDiarioEditSuccess,
  planejamentoDiarioError, planejamentoDiarioExportarSuccess, planejamentoDiarioListarRequest,
  planejamentoDiarioListarSuccess,
  planejamentoDiarioNovoSuccess, planejamentoDiarioPrepareEditRequest,
  planejamentoDiarioPrepareEditSuccess, planejamentoDiarioPrepareNewSuccess
} from "./action";
import {ServicePlanejamentoDiario} from "../../../services/servicePlanejamentoDiario";

function* listar(action){
  try {
    yield put(startLoading())
    corrigeDataParaEnvio(action.filtros, 'data', "DD/MM/YYYY")
    // CHAMADA API
    const data = yield call(ServicePlanejamentoDiario.listar, action.filtros)
    //CHAMADA SUCCESS
    yield put(planejamentoDiarioListarSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(planejamentoDiarioError(e))
    yield put(finishLoading())
  }
}

function* editar(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServicePlanejamentoDiario.editar, action.values)
    //CHAMADA SUCCESS
    yield put(planejamentoDiarioEditSuccess(data))
    yield put(planejamentoDiarioPrepareEditRequest(action.values.id))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(planejamentoDiarioError(e))
    yield put(planejamentoDiarioPrepareEditRequest(action.values.id))
    yield put(finishLoading())
  }
}

function* prepareEditar(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServicePlanejamentoDiario.prepareEditar, action.id)
    //CHAMADA SUCCESS
    yield put(planejamentoDiarioPrepareEditSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(planejamentoDiarioError(e))
    yield put(finishLoading())
  }
}

function* novo(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServicePlanejamentoDiario.novo, action.values)
    //CHAMADA SUCCESS
    yield put(planejamentoDiarioNovoSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(planejamentoDiarioError(e))
    yield put(finishLoading())
  }
}

function* prepareNovo(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServicePlanejamentoDiario.prepareNovo)
    //CHAMADA SUCCESS
    yield put(planejamentoDiarioPrepareNewSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(planejamentoDiarioError(e))
    yield put(finishLoading())
  }
}

function* deletar(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServicePlanejamentoDiario.deletar, action.id)
    //CHAMADA SUCCESS
    yield put(planejamentoDiarioDeletarSuccess(data))
    yield put(planejamentoDiarioListarRequest(action.filtros))
    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(planejamentoDiarioError(e))
    yield put(planejamentoDiarioListarRequest(action.filtros))
    yield put(finishLoading())
  }
}

function* exportar(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    corrigeDataParaEnvio(action.filtros, 'data', "DD/MM/YYYY")
    const data = yield call(ServicePlanejamentoDiario.exportar, action.filtros)
    //CHAMADA SUCCESS
    yield put(planejamentoDiarioExportarSuccess(data))
    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(planejamentoDiarioError(e))
    yield put(planejamentoDiarioListarRequest(action.filtros))
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(PLANEJAMENTO_DIARIO_LISTAR_REQUEST, listar),
  takeLatest(PLANEJAMENTO_DIARIO_PREPARE_EDIT_REQUEST, prepareEditar),
  takeLatest(PLANEJAMENTO_DIARIO_EDIT_REQUEST, editar),
  takeLatest(PLANEJAMENTO_DIARIO_PREPARE_NEW_REQUEST, prepareNovo),
  takeLatest(PLANEJAMENTO_DIARIO_NOVO_REQUEST, novo),
  takeLatest(PLANEJAMENTO_DIARIO_DELETAR_REQUEST, deletar),
  takeLatest(PLANEJAMENTO_DIARIO_EXPORTAR_REQUEST, exportar),
])
