import {call, put, all, takeLatest, select} from "redux-saga/effects";
import {
  changePaginationAlmoxarifadoSuccess,
  error, listAlmoxarifadoSuccess, listarMateriaisSuccess, setOpenAlmoxarifadoSuccess,
} from "./action";
import {
  ALMOXARIFADO_CHANGE_PAGINATION_REQUEST, ALMOXARIFADO_LIST_MATERIAIS_REQUEST,
  ALMOXARIFADO_LIST_REQUEST, ALMOXARIFADO_SET_OPEN_REQUEST,
} from "../actionTypes";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServiceAlmoxarifado} from "../../../services/serviceAlmoxarifado";
import {corrigeDataParaEnvio} from "../../../utils/utils";

function* listAlmoxarifado( action ) {
  try {
    yield put(startLoading());
    const almoxarifado = yield select(state => state.almoxarifado)
    if (action.filtros){
      corrigeDataParaEnvio(action.filtros, 'dataPrevisaoFinalizacao', 'DD/MM/YYYY')
    }
    //CHAMADA API
    const list = yield call(ServiceAlmoxarifado.listar, {
      ...action.filtros,
      max: almoxarifado.pageSize,
      offset: almoxarifado.pageSize * (almoxarifado.page - 1)
    });
    //CHAMADA SUCCESS
    yield put(listAlmoxarifadoSuccess( list ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    console.log(e)
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* setOpenAlmoxarifado( action ) {
  try {
    yield put(startLoading());
    const almoxarifado = yield select(state => state.almoxarifado)
    //CHAMADA API
    const data = yield call(ServiceAlmoxarifado.setEmAberto, action.id, action.justificativa);
    //CHAMADA SUCCESS
    yield put(setOpenAlmoxarifadoSuccess( data ));
    yield listAlmoxarifado({filtros: almoxarifado.filtros})

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* changePaginationAlmoxarifado( action ){
  try {
    yield put(startLoading());
    const almoxarifado = yield select(state => state.almoxarifado)
    yield put(changePaginationAlmoxarifadoSuccess( action.page, action.pageSize ));
    yield listAlmoxarifado({filtros: almoxarifado.filtros})

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* listMateriais( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceAlmoxarifado.listarMateriais, action.filtros);
    //CHAMADA SUCCESS
    yield put(listarMateriaisSuccess( list ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(ALMOXARIFADO_LIST_REQUEST, listAlmoxarifado),
  takeLatest(ALMOXARIFADO_SET_OPEN_REQUEST, setOpenAlmoxarifado),
  takeLatest(ALMOXARIFADO_CHANGE_PAGINATION_REQUEST, changePaginationAlmoxarifado),
  takeLatest(ALMOXARIFADO_LIST_MATERIAIS_REQUEST, listMateriais),
])
