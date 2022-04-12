import {all, call, put, takeLatest} from "redux-saga/effects";
import {
  REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_REQUEST,
  REIMPRESSAO_ETIQUETAS_REIMPRIMIR_REQUEST,
  REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_REQUEST
} from "../actionTypes";
import {finishLoading, startLoading} from "../RequestManager/action";
import {formataMensagemErrorRequisicao} from "../../../utils/formatador";
import {
  reimpressaoEtiquetasError,
  reimpressaoEtiquetasGetImpressorasSucess,
  reimpressaoEtiquetasReimprimirSuccess,
  reimpressaoEtiquetasPesquisarDadosSuccess,
} from "./action";
import {ServiceReimpressaoEtiquetas} from "../../../services/serviceReimpressaoEtiquetas";

function* reimprimir({ values }) {
  try {
    yield put(startLoading());

    const response = yield call(ServiceReimpressaoEtiquetas.reimprimir, values);
    yield put(reimpressaoEtiquetasReimprimirSuccess(response));

    yield put(finishLoading())
  } catch (e) {
    yield put(reimpressaoEtiquetasError(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* impressoras(){
  try {
    yield put(startLoading());

    const response = yield call(ServiceReimpressaoEtiquetas.impressoras);
    yield put(reimpressaoEtiquetasGetImpressorasSucess(response));

    yield put(finishLoading())
  } catch (e) {
    yield put(reimpressaoEtiquetasError(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* pesquisarDados({ lote }){
  try {
    yield put(startLoading());

    //CHAMADA API
    const data = yield call(ServiceReimpressaoEtiquetas.pesquisarDados, lote);

    //CHAMADA SUCCESS
    yield put(reimpressaoEtiquetasPesquisarDadosSuccess( data ));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

export default all([
  takeLatest(REIMPRESSAO_ETIQUETAS_REIMPRIMIR_REQUEST, reimprimir),
  takeLatest(REIMPRESSAO_ETIQUETAS_GET_IMPRESSORAS_REQUEST, impressoras),
  takeLatest(REIMPRESSAO_ETIQUETAS_PESQUISAR_DADOS_REQUEST, pesquisarDados),
])
