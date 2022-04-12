import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  acompanhamentoOrdemProducaoListarSuccess,
  reexportarSuccess,
  error, atualizarSuccess, acompanhamentoOrdemProducaoListarRequest, exportarSuccess,
  ordensAtrasadasSuccess, acompanhamentoOPPrepareEditSuccess, acompanhamentoOPEditSuccess, alterarOPEmMassaSuccess,
} from "./action";
import {
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ATUALIZAR_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_EXPORTAR_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_REEXPORTAR_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_EDIT_REQUEST,
  ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ALTERAR_EM_MASSA_REQUEST,
} from "../actionTypes";
import { startLoading, finishLoading } from "../RequestManager/action";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import { serviceAcompanhamentoOrdemProducao } from "../../../services/serviceAcompanhamentoOrdemProducao";
import moment from 'moment';
import {corrigeDataParaEnvio} from "../../../utils/utils";
import {message} from "antd";
import {getMessage} from "../../../components/messages";
import {ServiceGeracaoOrdemDeProducao} from "../../../services/serviceGeracaoOrdemDeProducao";
import {importarOrdensSuccess} from "../GeracaoOrdemDeProducao/action";

function* listar({ filtros }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    corrigeDataParaEnvio(filtros, 'dataCriacao', "DD/MM/YYYY HH:mm")
    corrigeDataParaEnvio(filtros, 'dataPrevisaoFinalizacao', "DD/MM/YYYY HH:mm")
    if (filtros.statusOracle){
      filtros.statusOracle = filtros.statusOracle.join(";")
    }
    const retorno = yield call(serviceAcompanhamentoOrdemProducao.listar, filtros);

    //CHAMADA SUCCESS
    yield put(acompanhamentoOrdemProducaoListarSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
  //ERROR
  yield put(error(formataMensagemErrorRequisicao(e)));
  yield put(finishLoading());
  }
}

function* reexportar({ id }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceAcompanhamentoOrdemProducao.reexportar, id);

    //CHAMADA SUCCESS
    yield put(reexportarSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* atualizar({ filtros }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceAcompanhamentoOrdemProducao.atualizar);

    //CHAMADA SUCCESS
    yield put(atualizarSuccess(retorno));

    yield put(acompanhamentoOrdemProducaoListarRequest(filtros))

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

// dataCriacaoInicial
// dataCriacaoFinal
// dataPrevisaoFinalizacaoInicial
// dataPrevisaoFinalizacaoFinal

function* exportar({ filtros }) {
  try{
    yield put(startLoading());

    const dateFormat = "DD/MM/YYYY HH:mm";
    const dateFormatDay = "DD/MM/YYYY";

    if (filtros.dataCriacao){
      const dataCriacao = [moment(filtros.dataCriacao[0]).startOf('day').format(dateFormat), moment(filtros.dataCriacao[1]).endOf('day').format(dateFormat)];
      const [ dataCriacaoInicial, dataCriacaoFinal] = dataCriacao
      filtros.dataCriacao = [...dataCriacao.map( data => moment(data, dateFormat).format(dateFormatDay))].join(" - ");
      filtros = {
        ...filtros, 
        dataCriacaoInicial, 
        dataCriacaoFinal
      }
    }

    if (filtros.dataPrevisaoFinalizacao){
      const dataPrevisaoFinalizacao = [moment(filtros.dataPrevisaoFinalizacao[0]).startOf('day').format(dateFormat), moment(filtros.dataPrevisaoFinalizacao[1]).endOf('day').format(dateFormat)];
      const [ dataPrevisaoFinalizacaoInicial, dataPrevisaoFinalizacaoFinal] = dataPrevisaoFinalizacao
      filtros.dataPrevisaoFinalizacao = [...dataPrevisaoFinalizacao.map( data => moment(data, dateFormat).format(dateFormatDay))].join(" - ");
      filtros = {
        ...filtros, 
        dataPrevisaoFinalizacaoInicial, 
        dataPrevisaoFinalizacaoFinal
      }
    }
    
    if (filtros.statusOracle){
      filtros.statusOracle = filtros.statusOracle.join(";");
    }
    
    filtros.colunas = filtros.colunas.join(";");

    //CHAMADA API
    const retorno = yield call(serviceAcompanhamentoOrdemProducao.exportar, filtros);

    //CHAMADA SUCCESS
    yield put(exportarSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* ordensAtrasadas({filtros}) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceAcompanhamentoOrdemProducao.ordensAtrasadas, filtros);

    //CHAMADA SUCCESS
    yield put(ordensAtrasadasSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepareEdit({id}) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(serviceAcompanhamentoOrdemProducao.prepareEdit, id);

    //CHAMADA SUCCESS
    yield put(acompanhamentoOPPrepareEditSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* edit({values}) {
  try{
    yield put(startLoading());
    values.dataPrometida = values.dataPrometida.format('DD/MM/YYYY')
    //CHAMADA API
    const retorno = yield call(serviceAcompanhamentoOrdemProducao.edit, values);

    //CHAMADA SUCCESS
    yield put(acompanhamentoOPEditSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* alterarEmMassa({ formData }) {
  try {
    const loading = message.loading(getMessage("acompanhamentoOrdemProducao.importarModal.carregando.label"), 0)
    yield put(startLoading());

    // CHAMADA API
    const data = yield call(serviceAcompanhamentoOrdemProducao.alterarEmMassa, formData)

    // CHAMADA SUCCESS
    yield put(alterarOPEmMassaSuccess(data));
    setTimeout(loading, 0)
  } catch (e) {
    // ERROR
    yield put(error(e.message));
  } finally {
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_LIST_REQUEST, listar),
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_REEXPORTAR_REQUEST, reexportar),
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ATUALIZAR_REQUEST, atualizar),
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_EXPORTAR_REQUEST, exportar),
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_ATRASADAS_REQUEST, ordensAtrasadas),
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_PREPARE_EDIT_REQUEST, prepareEdit),
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ORDENS_EDIT_REQUEST, edit),
  takeLatest(ACOMPANHAMENTO_ORDEM_DE_PRODUCAO_ALTERAR_EM_MASSA_REQUEST, alterarEmMassa)
])
