import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  faturamentoListarSuccess,
  error,
  envioLoteRomaneioSuccess,
  fecharLoteIncompletoSuccess,
  faturamentoListarRequest,
  exportarLotesSuccess,
  checarLoteRomaneioSuccess,
  listImpressorasSuccess,
  getCaixasFaturamentoSuccess,
  exportarCaixasFaturamentoSuccess,
  faturamento_abrir_lote_success,
  faturamentoExportarExcelSuccess,
  concluirOPSuccess,
} from "./action";
import {
  FATURAMENTO_ENVIO_LOTE_ROMANEIO_REQUEST,
  FATURAMENTO_LIST_REQUEST,
  FATURAMENTO_FECHAR_LOTE_INCOMPLETO_REQUEST,
  FATURAMENTO_EXPORTAR_LOTES_REQUEST,
  FATURAMENTO_CHECAR_LOTE_ROMANEIO_REQUEST,
  FATURAMENTO_LIST_IMPRESSORAS_REQUEST,
  FATURAMENTO_GET_CAIXAS_REQUEST,
  FATURAMENTO_EXPORTAR_CAIXAS_REQUEST,
  FATURAMENTO_ABRIR_LOTE_REQUEST,
  FATURAMENTO_EXPORTAR_EXCEL_REQUEST,
  FATURAMENTO_CONCLUIR_OP_REQUEST
} from "../actionTypes";
import { startLoading, finishLoading } from "../RequestManager/action";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import { serviceFaturamento } from "../../../services/serviceFaturamento";

function* listar(action) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.listar, action.filtros);

    //CHAMADA SUCCESS
    yield put(faturamentoListarSuccess(retorno));


    yield put(finishLoading());
  } catch (e){
  //ERROR
  yield put(error(formataMensagemErrorRequisicao(e)));
  yield put(finishLoading());
  }
}

function* envioLoteRomaneio({data}) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.envioLoteRomaneio, data);

    //CHAMADA SUCCESS
    yield put(envioLoteRomaneioSuccess(retorno));
    yield put(faturamentoListarRequest({}))


    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(faturamentoListarRequest({}))
    yield put(finishLoading());
  }
}

function* concluirOP({data}) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.concluirOP, data);

    //CHAMADA SUCCESS
    yield put(concluirOPSuccess(retorno));
    yield put(faturamentoListarRequest({}))

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(faturamentoListarRequest({}))
    yield put(finishLoading());
  }
}

function* checarLoteRomaneio({data}) {
  try{
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(serviceFaturamento.checarLoteRomaneio, data);
    //CHAMADA SUCCESS
    yield put(checarLoteRomaneioSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(faturamentoListarRequest({}))
    yield put(finishLoading());
  }
}

function* fecharLoteIncompleto({data}) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.fecharLoteIncompleto, {data});
    //CHAMADA SUCCESS
    yield put(fecharLoteIncompletoSuccess(retorno));
    yield put(faturamentoListarRequest({}))

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(faturamentoListarRequest({}))
    yield put(finishLoading());
  }
}

function* exportarLotes(action) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(serviceFaturamento.exportarLotes);
    yield put(exportarLotesSuccess(data))


    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* listarImpressoras(action) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.listarImpressoras);
    //CHAMADA SUCCESS
    yield put(listImpressorasSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* abrirLote({ id }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.abrirLote, id);
    //CHAMADA SUCCESS
    yield put(faturamento_abrir_lote_success(retorno));

    yield put(faturamentoListarRequest({}))

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* getCaixas(action) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.getCaixas, action.lote);
    //CHAMADA SUCCESS
    yield put(getCaixasFaturamentoSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* exportarCaixas(action) {
  // try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.exportarCaixas, action.lote);
    //CHAMADA SUCCESS
    yield put(exportarCaixasFaturamentoSuccess(retorno));

    yield put(finishLoading());
  // } catch (e){
  //   //ERROR
  //   console.log(e)
  //   yield put(error(formataMensagemErrorRequisicao(e)));
  //   yield put(finishLoading());
  // }
}

function* exportarExcel(action) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceFaturamento.exportarExcel, action.filtros);
    //CHAMADA SUCCESS
    yield put(faturamentoExportarExcelSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    console.log(e)
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(FATURAMENTO_LIST_REQUEST, listar),
  takeLatest(FATURAMENTO_ENVIO_LOTE_ROMANEIO_REQUEST, envioLoteRomaneio),
  takeLatest(FATURAMENTO_CHECAR_LOTE_ROMANEIO_REQUEST, checarLoteRomaneio),
  takeLatest(FATURAMENTO_FECHAR_LOTE_INCOMPLETO_REQUEST, fecharLoteIncompleto),
  takeLatest(FATURAMENTO_EXPORTAR_LOTES_REQUEST, exportarLotes),
  takeLatest(FATURAMENTO_LIST_IMPRESSORAS_REQUEST, listarImpressoras),
  takeLatest(FATURAMENTO_GET_CAIXAS_REQUEST, getCaixas),
  takeLatest(FATURAMENTO_EXPORTAR_CAIXAS_REQUEST, exportarCaixas),
  takeLatest(FATURAMENTO_ABRIR_LOTE_REQUEST, abrirLote),
  takeLatest(FATURAMENTO_EXPORTAR_EXCEL_REQUEST, exportarExcel),
  takeLatest(FATURAMENTO_CONCLUIR_OP_REQUEST, concluirOP),
])
