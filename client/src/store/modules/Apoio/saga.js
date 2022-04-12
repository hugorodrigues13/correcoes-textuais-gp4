import { call, put, all, takeLatest } from "redux-saga/effects"
import {
  buscarSerialSelecionadoSuccess,
  buscarGruposLinhasDeProducaoSuccess,
  buscarGrupoLinhasDeProducaoSuccess,
  buscarGrupoLinhasDeProducaoRequest,
} from "./action"
import {
  APOIO_BUSCAR_SERIAL_REQUEST,
  APOIO_REDIRECIONAR_SERIAL_REQUEST,
  APOIO_DESCARTAR_SERIAL_REQUEST, APOIO_BUSCAR_GRUPOS_LINHAS_REQUEST, APOIO_BUSCAR_GRUPO_LINHAS_REQUEST,
} from "../actionTypes"
import { ServiceApoio } from "../../../services/serviceApoio"
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import { startLoading, finishLoading } from "../RequestManager/action";




function* buscarGruposLinhasDeProducao() {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceApoio.buscarGruposLinhasDeProducao);

    //CHAMADA SUCCESS
    yield put(buscarGruposLinhasDeProducaoSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* buscarGrupoLinhasDeProducao({ id }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const list = yield call(ServiceApoio.buscarGrupoLinhasDeProducao, id);

    //CHAMADA SUCCESS
    yield put(buscarGrupoLinhasDeProducaoSuccess(list));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* buscarSerialSelecionado({ id }) {
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServiceApoio.buscarSerialSelecionado, id);

    //CHAMADA SUCCESS
    yield put(buscarSerialSelecionadoSuccess(retorno));

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}


function* redirecionarSerial({ entity, grupoSelecionado }) {
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServiceApoio.redirecionarSerial, { entity });

    //CHAMADA SUCCESS
    yield put(buscarGrupoLinhasDeProducaoRequest(grupoSelecionado));
    yield put(finishLoading())

  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}


function* descartarSerial({ id, grupoSelecionado}) {
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServiceApoio.descartarSerial, id);

    //CHAMADA SUCCESS
    yield put(buscarGrupoLinhasDeProducaoRequest(grupoSelecionado));
    yield put(finishLoading())

  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}



export default all([
    takeLatest(APOIO_BUSCAR_GRUPOS_LINHAS_REQUEST, buscarGruposLinhasDeProducao),
    takeLatest(APOIO_BUSCAR_GRUPO_LINHAS_REQUEST, buscarGrupoLinhasDeProducao),
    takeLatest(APOIO_BUSCAR_SERIAL_REQUEST, buscarSerialSelecionado),
    takeLatest(APOIO_REDIRECIONAR_SERIAL_REQUEST, redirecionarSerial),
    takeLatest(APOIO_DESCARTAR_SERIAL_REQUEST, descartarSerial),
])

