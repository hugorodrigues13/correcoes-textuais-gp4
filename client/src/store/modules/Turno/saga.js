import {all, call, put, takeLatest} from "redux-saga/effects";
import {
  TURNOS_DELETAR_REQUEST,
  TURNOS_EDIT_REQUEST,
  TURNOS_LISTAR_REQUEST,
  TURNOS_NOVO_REQUEST,
  TURNOS_PREPARE_EDIT_REQUEST, TURNOS_PREPARE_NEW_REQUEST
} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {corrigeDataParaEnvio} from "../../../utils/utils";
import {
  turnosDeletarSuccess,
  turnosEditSuccess,
  turnosError, turnosListarRequest,
  turnosListarSuccess,
  turnosNovoSuccess, turnosPrepareEditRequest,
  turnosPrepareEditSuccess, turnosPrepareNewSuccess
} from "./action";
import {ServiceTurnos} from "../../../services/serviceTurnos";

function* listar(action){
  try {
    yield put(startLoading())
    corrigeDataParaEnvio(action.filtros, 'horarioInicial', 'HH:mm')
    corrigeDataParaEnvio(action.filtros, 'horarioFinal', "HH:mm")
    corrigeDataParaEnvio(action.filtros, 'duracao', "HH:mm")
    // CHAMADA API
    const data = yield call(ServiceTurnos.listar, action.filtros)
    //CHAMADA SUCCESS
    yield put(turnosListarSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(turnosError(e))
    yield put(finishLoading())
  }
}

function* editar(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServiceTurnos.editar, action.values)
    //CHAMADA SUCCESS
    yield put(turnosEditSuccess(data))
    yield put(turnosPrepareEditRequest(action.values.id))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(turnosError(e))
    yield put(turnosPrepareEditRequest(action.values.id))
    yield put(finishLoading())
  }
}

function* prepareEditar(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServiceTurnos.prepareEditar, action.id)
    //CHAMADA SUCCESS
    yield put(turnosPrepareEditSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(turnosError(e))
    yield put(finishLoading())
  }
}

function* novo(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServiceTurnos.novo, action.values)
    //CHAMADA SUCCESS
    yield put(turnosNovoSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(turnosError(e))
    yield put(finishLoading())
  }
}

function* prepareNovo(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServiceTurnos.prepareNovo)
    //CHAMADA SUCCESS
    yield put(turnosPrepareNewSuccess(data))

    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(turnosError(e))
    yield put(finishLoading())
  }
}

function* deletar(action){
  try {
    yield put(startLoading())
    // CHAMADA API
    const data = yield call(ServiceTurnos.deletar, action.id)
    //CHAMADA SUCCESS
    yield put(turnosDeletarSuccess(data))
    yield put(turnosListarRequest(action.filtros))
    yield put(finishLoading())
  } catch (e){
    // ERROR
    yield put(turnosError(e))
    yield put(turnosListarRequest(action.filtros))
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(TURNOS_LISTAR_REQUEST, listar),
  takeLatest(TURNOS_PREPARE_EDIT_REQUEST, prepareEditar),
  takeLatest(TURNOS_EDIT_REQUEST, editar),
  takeLatest(TURNOS_PREPARE_NEW_REQUEST, prepareNovo),
  takeLatest(TURNOS_NOVO_REQUEST, novo),
  takeLatest(TURNOS_DELETAR_REQUEST, deletar),
])
