import {all, call, put, takeLatest} from "redux-saga/effects";
import {finishLoading, startLoading} from "../RequestManager/action";
import {ServiceRomaneio} from "../../../services/serviceRomaneio";
import {
  abrirRomaneioStatusSuccess,
  editarLotesSuccess,
  listarLotesSuccess,
  error,
  cancelarRomaneioStatusSuccess,
  listRomaneioSuccess,
  mudarRomaneioVolumeSuccess,
  prepareRomaneioEditSuccess,
  historicoRomaneioSuccess,
  exportarRomaneioSuccess,
  gerarNffSuccess,
  prepareRomaneioEditRequest,
  exportarRomaneioListagemSuccess,
  verificarStatusIntegracaoSuccess,
  editarNfsRomaneioSuccess,
  exportarRomaneioXlsxSuccess,
} from "./action";
import {
  ROMANEIO_EDITAR_LOTES_REQUEST,
  ROMANEIO_EXPORTAR_REQUEST,
  ROMANEIO_LIST_REQUEST,
  ROMANEIO_LISTAR_LOTES_REQUEST,
  ROMANEIO_MUDAR_VOLUME_REQUEST,
  ROMANEIO_PREPARE_EDIT_REQUEST,
  ROMANEIO_ABRIR_STATUS_REQUEST,
  ROMANEIO_FECHAR_STATUS_REQUEST,
  ROMANEIO_HISTORICO_REQUEST,
  ROMANEIO_GERAR_NFF_REQUEST,
  ROMANEIO_EXPORTAR_LISTAGEM_REQUEST,
  ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_REQUEST,
  ROMANEIO_EDITAR_NFS_REQUEST,
  ROMANEIO_EXPORTAR_XLSX_REQUEST
} from "../actionTypes";

function* listRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceRomaneio.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listRomaneioSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* prepareEditRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.prepareEdit, action.id);
    //CHAMADA SUCCESS
    yield put(prepareRomaneioEditSuccess(data));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* abrirStatusRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.abrirStatus, action.entity.id);
    //CHAMADA SUCCESS
    yield put(abrirRomaneioStatusSuccess(data));
    yield put(prepareRomaneioEditRequest(action.entity.id))
    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* fecharStatusRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.fecharStatus, action.entity.id);
    //CHAMADA SUCCESS
    yield put(cancelarRomaneioStatusSuccess(data));
    yield put(prepareRomaneioEditRequest(action.entity.id))
    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* mudarVolumeRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.mudarVolume, action.entity.id, action.volume);
    //CHAMADA SUCCESS
    yield put(mudarRomaneioVolumeSuccess(action.volume));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* listarLotesRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.listarLotes, action.filtros, action.inclusos);
    //CHAMADA SUCCESS
    yield put(listarLotesSuccess(data));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* editarLotesRomaneio( action ) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const data = yield call(ServiceRomaneio.editarLotes, action.id, action.selecionados);
    //CHAMADA SUCCESS
    yield put(editarLotesSuccess(data));
    yield put(prepareRomaneioEditRequest(action.id))
    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(prepareRomaneioEditRequest(action.id))
    yield put(finishLoading())
  }
}

function* historicoRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.historicoRomaneio, action.entity);
    //CHAMADA SUCCESS
    yield put(historicoRomaneioSuccess(data));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* exportarRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.exportar, action.id);
    //CHAMADA SUCCESS
    yield put(exportarRomaneioSuccess(data));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* gerarNffRomaneio( action ) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.gerarNff, action.id);
    //CHAMADA SUCCESS
    yield put(gerarNffSuccess(data));
    yield put(prepareRomaneioEditRequest(action.id))

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* verificarStatusIntegracao({romaneio}) {
  console.log(romaneio)
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceRomaneio.verificaStatusIntegracao, romaneio);
    //CHAMADA SUCCESS
    yield put(verificarStatusIntegracaoSuccess(data));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* exportarRomaneioListagem( action ) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const data = yield call(ServiceRomaneio.exportarListagem, action.filtros);
    //CHAMADA SUCCESS
    yield put(exportarRomaneioListagemSuccess(data));

    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* exportarXlsx(action){
  try {
    yield put(startLoading());
    //CHAMADA API
    const data = yield call(ServiceRomaneio.exportarXlsx, action.id);
    //CHAMADA SUCCESS
    yield put(exportarRomaneioXlsxSuccess(data));
  } catch (e) {
    yield put(error(e.message));
  } finally {
    yield put(finishLoading());
  }
}

function* editarNfsRomaneio(action){
  try {
    yield put(startLoading());
    //CHAMADA API
    const data = yield call(ServiceRomaneio.editarNfs, action.id, action.nfEncomenda, action.nfRetorno);
    //CHAMADA SUCCESS
    yield put(editarNfsRomaneioSuccess(data));
    yield put(prepareRomaneioEditRequest(action.id))
    yield put(finishLoading())
  } catch (e) {
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all( [
  takeLatest(ROMANEIO_LIST_REQUEST, listRomaneio),
  takeLatest(ROMANEIO_PREPARE_EDIT_REQUEST, prepareEditRomaneio),
  takeLatest(ROMANEIO_ABRIR_STATUS_REQUEST, abrirStatusRomaneio),
  takeLatest(ROMANEIO_FECHAR_STATUS_REQUEST, fecharStatusRomaneio),
  takeLatest(ROMANEIO_MUDAR_VOLUME_REQUEST, mudarVolumeRomaneio),
  takeLatest(ROMANEIO_LISTAR_LOTES_REQUEST, listarLotesRomaneio),
  takeLatest(ROMANEIO_EDITAR_LOTES_REQUEST, editarLotesRomaneio),
  takeLatest(ROMANEIO_HISTORICO_REQUEST, historicoRomaneio),
  takeLatest(ROMANEIO_EXPORTAR_REQUEST, exportarRomaneio),
  takeLatest(ROMANEIO_GERAR_NFF_REQUEST, gerarNffRomaneio),
  takeLatest(ROMANEIO_EXPORTAR_LISTAGEM_REQUEST, exportarRomaneioListagem),
  takeLatest(ROMANEIO_CONSULTAR_STATUS_INTEGRACAO_REQUEST, verificarStatusIntegracao),
  takeLatest(ROMANEIO_EDITAR_NFS_REQUEST, editarNfsRomaneio),
  takeLatest(ROMANEIO_EXPORTAR_XLSX_REQUEST, exportarXlsx)
])
