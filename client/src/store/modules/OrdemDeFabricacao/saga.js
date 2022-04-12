import {all, call, put, select, takeLatest} from "redux-saga/effects";
import {
  ORDEM_FABRICACAO_FOLHA_IMPRESSAO_REQUEST,
  ORDEM_FABRICACAO_IMPRIMIR_ETIQUETA_REQUEST,
  ORDEM_FABRICACAO_LIST_REQUEST,
  ORDEM_FABRICACAO_EXPORTAR_REQUEST,
  ORDEM_FABRICACAO_MATERIAS_PRIMAS_REQUEST,
  ORDEM_FABRICACAO_ENVIAR_SEPARACAO_REQUEST,
  ORDEM_FABRICACAO_ALTERAR_QUANTIDADE_REQUEST,
  ORDEM_FABRICACAO_CANCELAR_REQUEST,
  ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_REQUEST,
  ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_REQUEST
} from "../actionTypes";
import {startLoading, finishLoading} from "../RequestManager/action";
import {
  error,
  folhaImpressaoSuccess,
  imprimirEtiquetaSuccess,
  listOrdemFabricacaoRequest,
  listOrdemFabricacaoSuccess,
  exportarSuccess,
  materiasPrimasDaOFSuccess,
  enviarSeparacaoOFSuccess,
  alterarQuantidadeOFSuccess,
  cancelarOFsSuccess,
  folhaImpressaoDataSuccess,
  listaHistoricoImpressaoSuccess
} from "./action";
import {ServiceOrdemFabricacao} from "../../../services/serviceOrdemFabricacao";
import moment from 'moment';

function* listOrdemFabricacao(action){
  try {
    yield put(startLoading());
    //CHAMADA API
    if (action.filtros.dataCriacao){
      action.filtros.dataCriacaoInicial = moment(action.filtros.dataCriacao[0]).startOf('day').format("DD/MM/YYYY HH:mm")
      action.filtros.dataCriacaoFinal = moment(action.filtros.dataCriacao[1]).endOf('day').format("DD/MM/YYYY HH:mm")
      action.filtros.dataCriacao = undefined
    }
    if (action.filtros.dataPrevisaoFinalizacao){
      action.filtros.dataPrevisaoFinalizacaoInicial = moment(action.filtros.dataPrevisaoFinalizacao[0]).startOf('day').format("DD/MM/YYYY HH:mm")
      action.filtros.dataPrevisaoFinalizacaoFinal = moment(action.filtros.dataPrevisaoFinalizacao[1]).endOf('day').format("DD/MM/YYYY HH:mm")
      action.filtros.dataPrevisaoFinalizacao = undefined
    }
    if(action.filtros.status) {
      action.filtros.status = action.filtros.status.join(";");
    }
    if(action.filtros.statusWIP) action.filtros.statusWIP = action.filtros.statusWIP.join(';');
    const list = yield call(ServiceOrdemFabricacao.listar, action.filtros);
    //CHAMADA SUCCESS
    yield put(listOrdemFabricacaoSuccess( list ));

    yield put(finishLoading())
  } catch (e){
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* listHistoricoImpressaoOFRequest(entity){
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceOrdemFabricacao.historicoImpressao, entity.id);
    //CHAMADA SUCCESS
    yield put(listaHistoricoImpressaoSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* imprimirEtiqueta({entity, filtros}){
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.imprimirEtiqueta, entity);
    //CHAMADA SUCCESS
    yield put(imprimirEtiquetaSuccess(retorno));
    yield put(listOrdemFabricacaoRequest(filtros))
    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* folhaImpressao({data}){
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.folhaImpressao, data);
    //CHAMADA SUCCESS
    yield put(folhaImpressaoSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(e.message));
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

function* exportar({ filtros }) {
  try{
    yield put(startLoading());
    if (filtros.dataCriacao){
      filtros.dataCriacaoInicial = moment(filtros.dataCriacao[0]).startOf('day').format("DD/MM/YYYY HH:mm")
      filtros.dataCriacaoFinal = moment(filtros.dataCriacao[1]).endOf('day').format("DD/MM/YYYY HH:mm")
      filtros.dataCriacao = undefined
    }
    if (filtros.dataPrevisaoFinalizacao){
      filtros.dataPrevisaoFinalizacaoInicial = moment(filtros.dataPrevisaoFinalizacao[0]).startOf('day').format("DD/MM/YYYY HH:mm")
      filtros.dataPrevisaoFinalizacaoFinal = moment(filtros.dataPrevisaoFinalizacao[1]).endOf('day').format("DD/MM/YYYY HH:mm")
      filtros.dataPrevisaoFinalizacao = undefined
    }
    if(filtros.status) {
      filtros.status = filtros.status.join(";")
    }

    if(filtros.statusWIP) {
      filtros.statusWIP = filtros.statusWIP.join(';')
    }

    filtros.colunas = filtros.colunas.join(";")
    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.exportar, filtros);

    //CHAMADA SUCCESS
    yield put(exportarSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* materiasPrimas({ordemProducao}){
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.materiasPrimas, ordemProducao);
    //CHAMADA SUCCESS
    yield put(materiasPrimasDaOFSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* enviarSeparacao({values, filtros}){
  try {
    yield put(startLoading());
    values.dataSeparacao = values.dataSeparacao && values.dataSeparacao.format("DD/MM/YYYY HH:mm")
    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.enviarSeparacao, values);
    //CHAMADA SUCCESS
    yield put(enviarSeparacaoOFSuccess(retorno));
    yield put(listOrdemFabricacaoRequest(filtros))

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* cancelar({ids, filtros}){
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.cancelar, ids);
    //CHAMADA SUCCESS
    yield put(cancelarOFsSuccess(retorno));
    yield put(listOrdemFabricacaoRequest(filtros))

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* alterarQuantidade({id, quantidade, filtros}){
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceOrdemFabricacao.alterarQuantidade, id, quantidade);
    //CHAMADA SUCCESS
    yield put(alterarQuantidadeOFSuccess(retorno));
    yield put(listOrdemFabricacaoRequest(filtros))

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(e.message));
    yield put(listOrdemFabricacaoRequest(filtros))
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(ORDEM_FABRICACAO_LIST_REQUEST, listOrdemFabricacao),
  takeLatest(ORDEM_FABRICACAO_IMPRIMIR_ETIQUETA_REQUEST, imprimirEtiqueta),
  takeLatest(ORDEM_FABRICACAO_FOLHA_IMPRESSAO_REQUEST, folhaImpressao),
  takeLatest(ORDEM_FABRICACAO_FOLHA_IMPRESSAO_DATA_REQUEST, folhaImpressaoData),
  takeLatest(ORDEM_FABRICACAO_EXPORTAR_REQUEST, exportar),
  takeLatest(ORDEM_FABRICACAO_MATERIAS_PRIMAS_REQUEST, materiasPrimas),
  takeLatest(ORDEM_FABRICACAO_ENVIAR_SEPARACAO_REQUEST, enviarSeparacao),
  takeLatest(ORDEM_FABRICACAO_ALTERAR_QUANTIDADE_REQUEST, alterarQuantidade),
  takeLatest(ORDEM_FABRICACAO_CANCELAR_REQUEST, cancelar),
  takeLatest(ORDEM_FABRICACAO_HISTORICO_IMPRESSAO_REQUEST, listHistoricoImpressaoOFRequest),
])
