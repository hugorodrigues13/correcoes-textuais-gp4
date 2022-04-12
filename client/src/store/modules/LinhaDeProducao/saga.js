import { call, put, all, takeLatest } from "redux-saga/effects";
import {
  linhaProducaoListarSuccess,
  linhaProducaoPrepararNovoSuccess,
  linhaProducaoSalvarSuccess,
  linhaProducaoListarRequest,
  linhaProducaoPrepararEditarSuccess,
  linhaProducaoEditarSuccess, error, buscarLinhaProducaoPorNomeSuccess, restaurarLinhaProducaoSuccess
} from "./action";
import {
  LINHA_DE_PRODUCAO_LIST_REQUEST,
  LINHA_DE_PRODUCAO_PREPARAR_NOVO_REQUEST,
  LINHA_DE_PRODUCAO_SALVAR_REQUEST,
  LINHA_DE_PRODUCAO_PREPARAR_EDITAR_REQUEST,
  LINHA_DE_PRODUCAO_DELETE_REQUEST,
  LINHA_DE_PRODUCAO_EDITAR_REQUEST,
  LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_REQUEST, LINHA_DE_PRODUCAO_RESTAURAR_REQUEST,
  LINHA_DE_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST,
} from "../actionTypes";
import { startLoading, finishLoading } from "../RequestManager/action";
import { formataMensagemErrorRequisicao } from "../../../utils/formatador";
import { ServiceLinhaDeProducao } from "../../../services/ServiceLinhaDeProducao";
import history from "../../../services/history";
import { CLIENT_URL } from "../../../config";

function* listar({ filtros }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.listar, filtros);

    //CHAMADA SUCCESS
    yield put(linhaProducaoListarSuccess(retorno));

    yield put(finishLoading());
  } catch (e){
  //ERROR
  yield put(error(formataMensagemErrorRequisicao(e)));
  yield put(finishLoading());
  }
}

function* salvar({ entity, diagrama }) {
  // try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.salvar, { entity,diagrama })
    //CHAMADA SUCCESS
    yield put(linhaProducaoSalvarSuccess(retorno))

    yield put(finishLoading());
  // } catch (e){
  //   //ERROR
  //   yield put(error(formataMensagemErrorRequisicao(e)));
  //   yield put(finishLoading());
  // }
}

function* deletar({ id, filtros }) {
  try{
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.deletar, id)

    //CHAMADA SUCCESS
    yield put(linhaProducaoSalvarSuccess(retorno));

    //CHAMADA LISTA
    yield put(linhaProducaoListarRequest(filtros));

    yield put(finishLoading());
  } catch (e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* editar( {entity, diagrama} ) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.editar, {entity, diagrama} )

    const { entityInstance } = yield call(ServiceLinhaDeProducao.afterSaveEdit, {entity})
    history.push(CLIENT_URL + `/cad/linhaDeProducao/form/${entityInstance.id}`)

    //CHAMADA SUCCESS
    yield put(linhaProducaoEditarSuccess(entityInstance))
    yield put(finishLoading());
  } catch(e){
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararNovo() {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.novo);

    //CHAMADA SUCCESS
    yield put(linhaProducaoPrepararNovoSuccess(retorno));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* prepararEditar({ id }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.prepararEditar, id);

    //CHAMADA SUCCESS
    yield put(linhaProducaoPrepararEditarSuccess(retorno));

    yield put(finishLoading());
  } catch(e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* buscarLinhaProducaoPorNome({ nome }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.buscarLinhaProducaoPorNome, nome);

    //CHAMADA SUCCESS
    yield put(buscarLinhaProducaoPorNomeSuccess(retorno));

    yield put(finishLoading());
  } catch(e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* restaurarLinhaProducao({ entity }) {
  try{
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceLinhaDeProducao.restaurarLinhaProducao, entity.id);

    //CHAMADA SUCCESS
    yield put(restaurarLinhaProducaoSuccess(retorno));

    yield put(finishLoading());
  } catch(e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* ativarOuDesativar(action) {
  try {
    //CHAMADA API
    yield call(ServiceLinhaDeProducao.ativarDesativar, action.objeto.id);
    // CHAMADA SUCCESS
    yield call(listar, action);
  } catch (e) {
    // ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
  }
}

export default all([
  takeLatest(LINHA_DE_PRODUCAO_LIST_REQUEST, listar),
  takeLatest(LINHA_DE_PRODUCAO_PREPARAR_NOVO_REQUEST, prepararNovo),
  takeLatest(LINHA_DE_PRODUCAO_SALVAR_REQUEST, salvar),
  takeLatest(LINHA_DE_PRODUCAO_DELETE_REQUEST, deletar),
  takeLatest(LINHA_DE_PRODUCAO_PREPARAR_EDITAR_REQUEST, prepararEditar),
  takeLatest(LINHA_DE_PRODUCAO_EDITAR_REQUEST, editar),
  takeLatest(LINHA_DE_PRODUCAO_BUSCAR_POR_NOME_REQUEST, buscarLinhaProducaoPorNome),
  takeLatest(LINHA_DE_PRODUCAO_RESTAURAR_REQUEST, restaurarLinhaProducao),
  takeLatest(LINHA_DE_PRODUCAO_ATIVAR_OU_DESATIVAR_REQUEST, ativarOuDesativar),
])
