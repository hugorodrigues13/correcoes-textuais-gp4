import {call, put, all, takeLatest} from "redux-saga/effects";
import {ServiceApontamento} from "../../../services/serviceApontamento";
import {
  apontamentoSalvarSuccess,
  apontamentoGerarEtiquetaRequest,
  apontamentoGerarEtiquetaSuccess,
  apontamentoValidarSerialSuccess,
  getDadosApontamentoPorRecursoSuccess,
  getRecursosSuccess,
  verificarUsuarioSuccess,
  error,
  verificarParadaSuccess,
  setMotivoParadaSuccess,
  pararRecursoSuccess,
  verificarParadaRequest,
  getRecursosRequest,
  apontamentoValidarOFSuccess
} from "./action";
import {
  APONTAMENTO_SALVAR_REQUEST,
  APONTAMENTO_GERAR_ETIQUETA_REQUEST,
  APONTAMENTO_VALIDAR_SERIAL_REQUEST,
  GET_RECURSOS_REQUEST,
  GET_DADOSAPONTAMENTOPORRECURSO_REQUEST,
  VERIFICAR_USUARIO_REQUEST,
  APONTAMENTO_VERIFICAR_PARADA_REQUEST,
  APONTAMENTO_SET_MOTIVO_REQUEST,
  APONTAMENTO_PARAR_RECURSO_REQUEST,
  APONTAMENTO_VALIDAR_OF_REQUEST
} from "../actionTypes";
import {formataMensagemErrorRequisicao} from "../../../utils/formatador";
import {startLoading, finishLoading} from "../RequestManager/action";
import dayjs from "dayjs";
const maximoSeriais = 50
function* salvar({data}) {
  try {
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceApontamento.salvar, {data});
    //CHAMADA SUCCESS

    let {seriais} = data
    if (Object.keys(retorno).length > 0) {
      let {serial} = data
      seriais = [...seriais, {
        "serial" : data.apontarOF ? null : serial,
        "ordemDeFabricacao": data.apontarOF ? serial : null,
        "dataApontamento": dayjs(new Date()).format("DD/MM/YYYY-HH:mm:ss"),
        "descricao": retorno.messages[0].message,
        "situacao": retorno.messages[0].type,
        "ordemFabricacao": retorno.ordemFabricacao,
        "lote": retorno.lote,
        "caixa": retorno.caixa,
        "codigoProduto": retorno.codigoProduto,
        "etiquetaImpressa": retorno.etiquetaImpressa,
        "modelo": retorno.modelo,
        "comprimento": retorno.comprimento,
        "proximoProcesso": retorno.proximoProcesso,
        "reprocesso": retorno.reprocesso,
        "cor": retorno.messages[0].cor,
      }].sort((a, b) => a.dataApontamento > b.dataApontamento ? -1 : a.dataApontamento < b.dataApontamento ? 1 : 0).slice(0, maximoSeriais)

      localStorage.setItem("seriais", JSON.stringify(seriais))
    }

    yield put(apontamentoSalvarSuccess({...retorno, seriais}));

    if(data.impressora !== undefined && data.impressora !== ''){
      yield put(apontamentoGerarEtiquetaRequest(data));
    }

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    console.log(e)
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* verificarUsuario({data}) {
  try {
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceApontamento.verificarUsuario, {data});

    let {seriais} = data

    if (Object.keys(retorno).length > 0) {
      let {serial} = data
      seriais = [...seriais, {
        serial,
        "dataApontamento": dayjs(new Date()).format("DD/MM/YYYY-HH:mm:ss"),
        "ordemFabricacao": retorno.ordemFabricacao,
        "codigoProduto": retorno.codigoProduto,
        "modelo": retorno.modelo,
        "comprimento": retorno.comprimento,
        "descricao": retorno.messages[0].message,
        "situacao": retorno.messages[0].type,
        "cor": retorno.messages[0].cor,
      }].sort((a, b) => a.dataApontamento > b.dataApontamento ? -1 : a.dataApontamento < b.dataApontamento ? 1 : 0).slice(0, maximoSeriais)
      localStorage.setItem("seriais", JSON.stringify(seriais))
    }

    //CHAMADA SUCCESS
    yield put(verificarUsuarioSuccess({...retorno, seriais}));

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* gerarEtiqueta({data}) {
  try {
    yield put(startLoading())

    //CHAMADA API
    const retorno = yield call(ServiceApontamento.gerarEtiqueta, {data});
    //CHAMADA SUCCESS
    yield put(apontamentoGerarEtiquetaSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}



function* validarSerial({serial, recurso, seriais, impressoraId}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceApontamento.validarSerial, {serial, recurso, impressoraId})

    if (Object.keys(retorno).length > 0 && retorno.messages?.length) {
      seriais = ([...seriais,{
        serial,
        "dataApontamento": dayjs(new Date()).format("DD/MM/YYYY-HH:mm:ss"),
        "descricao": retorno.messages[0]?.message,
        "situacao": retorno.messages[0]?.type,
        "ordemFabricacao": retorno.ordemFabricacao,
        "lote": retorno.lote,
        "caixa": retorno.caixa,
        "codigoProduto": retorno.codigoProduto,
        "modelo": retorno.modelo,
        "comprimento": retorno.comprimento,
        "cor": retorno.messages[0]?.cor,
      }]).sort((a, b) => a.dataApontamento > b.dataApontamento ? -1 : a.dataApontamento < b.dataApontamento ? 1 : 0).slice(0, maximoSeriais)
    }
    localStorage.setItem("seriais", JSON.stringify(seriais))

    //CHAMADA SUCCESS
    yield put(apontamentoValidarSerialSuccess(retorno, seriais))
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    console.log(e)
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* validarOF({of, recurso, seriais, impressoraId}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceApontamento.validarOF, {of, recurso, impressoraId})

    if (Object.keys(retorno).length > 0 && retorno.messages?.length) {
      seriais = ([...seriais,{
        "ordemDeFabricacao": of,
        "dataApontamento": dayjs(new Date()).format("DD/MM/YYYY-HH:mm:ss"),
        "descricao": retorno.messages[0]?.message,
        "situacao": retorno.messages[0]?.type,
        "ordemFabricacao": retorno.ordemFabricacao,
        "lote": retorno.lote,
        "caixa": retorno.caixa,
        "codigoProduto": retorno.codigoProduto,
        "modelo": retorno.modelo,
        "comprimento": retorno.comprimento,
        "cor": retorno.messages[0]?.cor,
      }]).sort((a, b) => a.dataApontamento > b.dataApontamento ? -1 : a.dataApontamento < b.dataApontamento ? 1 : 0).slice(0, maximoSeriais)
    }
    localStorage.setItem("seriais", JSON.stringify(seriais))

    //CHAMADA SUCCESS
    yield put(apontamentoValidarOFSuccess(retorno, seriais))
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    console.log(e)
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* getRecursos() {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceApontamento.getRecursos);

    //CHAMADA SUCCESS
    yield put(getRecursosSuccess(list))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(formataMensagemErrorRequisicao(e));
    yield put(finishLoading());
  }
}

function* getDadosApontamentoPorRecurso({recursoId}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceApontamento.getDadosApontamentoPorRecurso, recursoId);
    const {defeitos, impressoras, tempoMaximoSemApontamento, ultimoApontamento} = list

    //CHAMADA SUCCESS
    yield put(getDadosApontamentoPorRecursoSuccess({defeitos, impressoras, tempoMaximoSemApontamento, ultimoApontamento}))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    console.log(e)
    yield put(formataMensagemErrorRequisicao(e));
    yield put(finishLoading());
  }
}


function* verificarParada({recursoId}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceApontamento.verificarParada, recursoId);
    //CHAMADA SUCCESS
    yield put(verificarParadaSuccess(list))
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(formataMensagemErrorRequisicao(e));
    yield put(finishLoading());
  }
}

function* setMotivoParada({paradaId, motivoId}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceApontamento.setMotivoParada, paradaId, motivoId);
    //CHAMADA SUCCESS
    yield put(setMotivoParadaSuccess(list))
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e))
    yield put(finishLoading());
  }
}

function* pararRecurso({recursoId, acaoDoUsuario}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceApontamento.pararRecurso, {recursoId, acaoDoUsuario});
    //CHAMADA SUCCESS
    yield put(pararRecursoSuccess(list))
    yield put (verificarParadaRequest(recursoId))
    if(!acaoDoUsuario) {
      yield put (getRecursosRequest())
    }
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e));
    yield put (verificarParadaRequest(recursoId))
    yield put (getRecursosRequest())
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(APONTAMENTO_SALVAR_REQUEST, salvar),
  takeLatest(VERIFICAR_USUARIO_REQUEST, verificarUsuario),
  takeLatest(APONTAMENTO_GERAR_ETIQUETA_REQUEST, gerarEtiqueta),
  takeLatest(APONTAMENTO_VALIDAR_SERIAL_REQUEST, validarSerial),
  takeLatest(GET_RECURSOS_REQUEST, getRecursos),
  takeLatest(GET_DADOSAPONTAMENTOPORRECURSO_REQUEST, getDadosApontamentoPorRecurso),
  takeLatest(APONTAMENTO_VERIFICAR_PARADA_REQUEST, verificarParada),
  takeLatest(APONTAMENTO_SET_MOTIVO_REQUEST, setMotivoParada),
  takeLatest(APONTAMENTO_PARAR_RECURSO_REQUEST, pararRecurso),
  takeLatest(APONTAMENTO_VALIDAR_OF_REQUEST, validarOF),
])
