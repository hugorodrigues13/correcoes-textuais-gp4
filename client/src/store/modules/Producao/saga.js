import { call, put, all, takeLatest } from "redux-saga/effects"
import {
    gerarRelatorioSuccess,
    getDadosIniciaisSuccess,
} from "./action"

import {
    PRODUCAO_GET_DADOS_INICIAIS_REQUEST,
    PRODUCAO_GERAR_RELATORIO_REQUEST,
    PRODUCAO_GERAR_RELATORIO_SUCCESS
} from "../actionTypes"
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import { corrigeDataParaEnvio } from "../../../utils/utils";
import {startLoading, finishLoading} from "../RequestManager/action";
import { ServiceRelatorioProducao } from "../../../services/servicesProducao";
import * as moment from 'moment'

function* getDadosIniciaisRequest() {
    try {
      yield put(startLoading());
  
      //CHAMADA API
      const data = yield call(ServiceRelatorioProducao.getDadosIniciais);
  
      //CHAMADA SUCCESS
      yield put(getDadosIniciaisSuccess( data ));
  
      yield put(finishLoading())
    } catch (e) {
      //ERROR
      yield put(error(e.message));
      yield put(finishLoading())
    }
}

function* gerarRelatorio({filtros}){
  try {
    yield put(startLoading());

    if(filtros.periodo){
      const format = "MM/YY"
      const periodo = [moment(filtros.periodo[0]).format(format), moment(filtros.periodo[1]).format(format)];
      const [periodoInicial, periodoFinal] = periodo;

      filtros.periodoInicial = periodoInicial
      filtros.periodoFinal = periodoFinal
      filtros.periodo = periodo.join(' - ')
    }

    //CHAMADA API
    const data = yield call(ServiceRelatorioProducao.gerarRelatorio, {
      ...filtros,
    });
    
    //CHAMADA SUCCESS
    yield put(gerarRelatorioSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(PRODUCAO_GET_DADOS_INICIAIS_REQUEST, getDadosIniciaisRequest),
  takeLatest(PRODUCAO_GERAR_RELATORIO_REQUEST, gerarRelatorio),
])
