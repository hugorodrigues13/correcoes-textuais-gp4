import {call, put, all, takeLatest} from "redux-saga/effects"
import {
  listSerialSuccess,
  error,
  serialGerarEtiquetaSuccess,
  serialImprimirSuccess,
  serialEstornarApontamentoSuccess,
  listSerialRequest,
  listSerialHistoricoSuccess,
  serialExportarSuccess,
  serialSucatearSuccess, folhaImpressaoDataSuccess, buscaValoresIniciaisSuccess,
} from "./action"
import {
  SERIAL_ESTORNAR_APONTAMENTO_REQUEST,
  SERIAL_LIST_HISTORICO_REQUEST,
  SERIAL_GERAR_ETIQUETA_REQUEST,
  SERIAL_IMPRIMIR_REQUEST,
  SERIAL_LIST_REQUEST,
  SERIAL_EXPORTAR_REQUEST,
  SERIAL_SUCATEAR_REQUEST,
  SERIAL_FOLHA_IMPRESSAO_DATA_REQUEST,
  SERIAL_VALORES_INICIAIS_REQUEST,
} from "../actionTypes"
import {formataMensagemErrorRequisicao} from "../../../utils/formatador";
import {startLoading, finishLoading} from "../RequestManager/action";
import {ServiceSerial} from "../../../services/serviceSerial";
import {corrigeDataParaEnvio} from "../../../utils/utils";
import {ServiceOrdemFabricacao} from "../../../services/serviceOrdemFabricacao";

function* listSerial(action) {
  try {
    yield put(startLoading());
    if (Array.isArray(action.filtros.serial)){
      action.filtros.serial = action.filtros.serial.join(";")
    }
    if (Array.isArray(action.filtros.codigoNF)){
      action.filtros.codigoNF = action.filtros.codigoNF.join(";")
    }
    if (Array.isArray(action.filtros.lote)){
      action.filtros.lote = action.filtros.lote.join(";")
    }
    if (Array.isArray(action.filtros.ordemFabricacao)){
      action.filtros.ordemFabricacao = action.filtros.ordemFabricacao.join(";")
    }
    if (Array.isArray(action.filtros.ordemProducao)){
      action.filtros.ordemProducao = action.filtros.ordemProducao.join(";")
    }
    if (Array.isArray(action.filtros.codigoProduto)){
      action.filtros.codigoProduto = action.filtros.codigoProduto.join(";")
    }
    if (Array.isArray(action.filtros.codigoRomaneio)){
      action.filtros.codigoRomaneio = action.filtros.codigoRomaneio.join(";")
    }
    if (Array.isArray(action.filtros.status)){
      action.filtros.status = action.filtros.status.join(";")
    }
    if (Array.isArray(action.filtros.statusOrdemFabricacao)){
      action.filtros.statusOrdemFabricacao = action.filtros.statusOrdemFabricacao.join(";")
    }
    if (Array.isArray(action.filtros.statusRomaneio)){
      action.filtros.statusRomaneio = action.filtros.statusRomaneio.join(";")
    }
    if (Array.isArray(action.filtros.statusWip)){
      action.filtros.statusWip = action.filtros.statusWip.join(";")
    }
    if (Array.isArray(action.filtros.statusLote)){
      action.filtros.statusLote = action.filtros.statusLote.join(";")
    }
    if (Array.isArray(action.filtros.statusImpressaoEtiqueta)){
      action.filtros.statusImpressaoEtiqueta = action.filtros.statusImpressaoEtiqueta.join(";")
    }
    corrigeDataParaEnvio(action.filtros, "dataFinalizacao", "DD/MM/YYYY HH:mm:ss", true)
    corrigeDataParaEnvio(action.filtros, "ultimoApontamento", "DD/MM/YYYY HH:mm:ss")
    corrigeDataParaEnvio(action.filtros, "dataRomaneio", "DD/MM/YYYY HH:mm:ss")
    corrigeDataParaEnvio(action.filtros, "dataSucateamento", "DD/MM/YYYY HH:mm:ss")
    //CHAMADA API
    const list = yield call(ServiceSerial.getTodos, action.filtros);
    //CHAMADA SUCCESS
    yield put(listSerialSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* buscaValoresIniciais() {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceSerial.getValoresIniciais);
    //CHAMADA SUCCESS
    yield put(buscaValoresIniciaisSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* listSerialHistorico(action) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceSerial.getHistorico, action.serialId);
    //CHAMADA SUCCESS
    yield put(listSerialHistoricoSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* folhaImpressaoData({ entity }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.folhaImpressaoData, entity);

    //CHAMADA SUCCESS
    yield put(folhaImpressaoDataSuccess(retorno));
  } catch (e) {
    yield put(error(e.message));
  } finally {
    yield put(finishLoading());
  }
}

function* gerarEtiqueta({data}) {

  try {
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceSerial.gerarEtiqueta, data);

    //CHAMADA SUCCESS
    yield put(serialGerarEtiquetaSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* imprimir({data}) {
  try {
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceSerial.imprimir, data);

    //CHAMADA SUCCESS
    yield put(serialImprimirSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* estornar({serial, justificativa, apontamento, filtros}) {
  try {
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceSerial.estornar, serial, justificativa, apontamento);

    //CHAMADA SUCCESS
    yield put(serialEstornarApontamentoSuccess(retorno));
    yield put(listSerialRequest(filtros))
    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* exportarSerial({filtros}) {
  try {
    yield put(startLoading())
    if (Array.isArray(filtros.serial)){
      filtros.serial = filtros.serial.join(";")
    }
    if (Array.isArray(filtros.codigoNF)){
      filtros.codigoNF = filtros.codigoNF.join(";")
    }
    if (Array.isArray(filtros.lote)){
      filtros.lote = filtros.lote.join(";")
    }
    if (Array.isArray(filtros.ordemFabricacao)){
      filtros.ordemFabricacao = filtros.ordemFabricacao.join(";")
    }
    if (Array.isArray(filtros.ordemProducao)){
      filtros.ordemProducao = filtros.ordemProducao.join(";")
    }
    if (Array.isArray(filtros.codigoProduto)){
      filtros.codigoProduto = filtros.codigoProduto.join(";")
    }
    if (Array.isArray(filtros.codigoRomaneio)){
      filtros.codigoRomaneio = filtros.codigoRomaneio.join(";")
    }
    if (Array.isArray(filtros.status)){
      filtros.status = filtros.status.join(";")
    }
    if (Array.isArray(filtros.statusOrdemFabricacao)){
      filtros.statusOrdemFabricacao = filtros.statusOrdemFabricacao.join(";")
    }
    if (Array.isArray(filtros.statusRomaneio)){
      filtros.statusRomaneio = filtros.statusRomaneio.join(";")
    }
    if (Array.isArray(filtros.statusWip)){
      filtros.statusWip = filtros.statusWip.join(";")
    }
    corrigeDataParaEnvio(filtros, "dataFinalizacao", "DD/MM/YYYY HH:mm:ss", true)
    corrigeDataParaEnvio(filtros, "ultimoApontamento", "DD/MM/YYYY HH:mm:ss")
    corrigeDataParaEnvio(filtros, "dataRomaneio", "DD/MM/YYYY HH:mm:ss")
    corrigeDataParaEnvio(filtros, "dataSucateamento", "DD/MM/YYYY HH:mm:ss")
    //CHAMADA API
    const retorno = yield call(ServiceSerial.exportar,filtros);

    //CHAMADA SUCCESS
    yield put(serialExportarSuccess(retorno));
    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* sucatearSerial({id, filtros}){
  try {
    yield put(startLoading())
    //CHAMADA API
    const retorno = yield call(ServiceSerial.sucatearSerial, id);

    //CHAMADA SUCCESS
    yield put(serialSucatearSuccess(retorno));

    yield put(listSerialRequest(filtros))

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(SERIAL_LIST_REQUEST, listSerial),
  takeLatest(SERIAL_GERAR_ETIQUETA_REQUEST, gerarEtiqueta),
  takeLatest(SERIAL_IMPRIMIR_REQUEST, imprimir),
  takeLatest(SERIAL_ESTORNAR_APONTAMENTO_REQUEST, estornar),
  takeLatest(SERIAL_LIST_HISTORICO_REQUEST, listSerialHistorico),
  takeLatest(SERIAL_EXPORTAR_REQUEST, exportarSerial),
  takeLatest(SERIAL_SUCATEAR_REQUEST, sucatearSerial),
  takeLatest(SERIAL_FOLHA_IMPRESSAO_DATA_REQUEST, folhaImpressaoData),
  takeLatest(SERIAL_VALORES_INICIAIS_REQUEST, buscaValoresIniciais),
])
