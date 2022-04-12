import {call, put, all, takeLatest} from "redux-saga/effects";
import {
  buscarGruposSuccess,
  error,
  buscaOrdensGrupoSuccess,
  buscarOrdensGrupoRequest,
  buscaLinhasGrupoSuccess,
  buscarCatalogoDoProdutoSuccess,
  getTotalOrdensDeProducaoProdutosSemGrupoAssociadoSuccess,
  getOrdensDeProducaoProdutosSemGrupoAssociadoSuccess,
  getOrdensDeProducaoProdutosAssociadoGrupoSuccess,
  getOrdensDeProducaoProdutosSemGrupoAssociadoRequest,
  getOrdensDeProducaoProdutosAssociadoGrupoRequest,
  getMateriaPrimaOrdemProducaoSuccess,
  ordenacaoRapidaSuccess,
  alterarLinhaSequenciamentoSuccess,
  mudarOrdemSuccess,
  buscarGruposRequest,
} from "./action";
import {finishLoading, startLoading} from "../RequestManager/action";
import {ServiceSequenciamento} from "../../../services/serviceSequenciamento";
import {
  SEQUENCIAMENTO_BUSCAR_GRUPOS_REQUEST,
  SEQUENCIAMENTO_SALVAR_REQUEST,
  SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_REQUEST,
  SEQUENCIAMENTO_ALTERAR_ORDEM_REQUEST,
  SEQUENCIAMENTO_EXCLUIR_REQUEST,
  SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_REQUEST,
  SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_REQUEST,
  SEQUENCIAMENTO_ASSOCIAR_PRODUTO_AO_GRUPO_REQUEST,
  SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
  SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
  SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_REQUEST,
  SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_REQUEST,
  SEQUENCIAMENTO_ORDENACAO_RAPIDA_REQUEST,
  SEQUENCIAMENTO_ALTERAR_LDP_REQUEST,
  SEQUENCIAMENTO_MUDAR_ORDEM_SUCCESS,
  SEQUENCIAMENTO_MUDAR_ORDEM_REQUEST,
} from "../actionTypes";
import {formataMensagemErrorRequisicao} from "../../../utils/formatador";

function* buscarCatalogoDoProduto({item}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.getCatalogoDoProduto, {item});
    //CHAMADA SUCCESS
    yield put(buscarCatalogoDoProdutoSuccess(retorno));
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}


function* buscarGrupos() {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.buscarGrupos)
    //CHAMADA SUCCESS
    yield put(buscarGruposSuccess(retorno))
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* buscarLinhasGrupoLinhaDeProducao({idGrupoLinha}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.buscarLinhasGrupoLinhaDeProducao, {idGrupoLinha});
    //CHAMADA SUCCESS
    yield put(buscaLinhasGrupoSuccess(retorno));
    yield put(buscarGruposRequest())
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* deletar({ id, idGrupoLinha }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.deletar, id);
    //CHAMADA SUCCESS
    yield put(buscarOrdensGrupoRequest(idGrupoLinha));
    yield put(getOrdensDeProducaoProdutosAssociadoGrupoRequest(idGrupoLinha))

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* buscarOrdensInternasGrupoLinhaDeProducao({idGrupoLinha, values}) {
  try {
    if(values && values.status !== undefined && Array.isArray(values.status)){
      values.status = values.status.join(";")
    }
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.buscarOrdensInternasGrupoLinhaDeProducao, {idGrupoLinha, values});
    //CHAMADA SUCCESS
    yield put(buscaOrdensGrupoSuccess(retorno));
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading());
  }
}

function* gerarCodigo({ordemDeFabricacao, idGrupoLinha}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceSequenciamento.gerarCodigo, {ordemDeFabricacao});
    //CHAMADA SUCCESS
    yield put(buscarOrdensGrupoRequest(idGrupoLinha));
    yield put(getOrdensDeProducaoProdutosAssociadoGrupoRequest(idGrupoLinha))
    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* alterarOrdem({ordemDeFabricacao, idGrupoLinha}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const list = yield call(ServiceSequenciamento.alterarOrdem, {ordemDeFabricacao});
    //CHAMADA SUCCESS
    yield put(buscarOrdensGrupoRequest(idGrupoLinha));
    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading())
  }
}

function* associarProdutoAoGrupo({produtoComGrupoSelecionado, filtros}){
  try {
    yield put(startLoading());

    //CHAMDA API
    const retorno = yield call(ServiceSequenciamento.associarProdutoAoGrupo, {produtoComGrupoSelecionado});

    yield put(getOrdensDeProducaoProdutosSemGrupoAssociadoRequest(filtros))

    yield put(finishLoading())
  } catch (e) {
    //ERROR
    yield put(error(formataMensagemErrorRequisicao(e)));
    yield put(finishLoading())
  }
}

function* getTotalOrdensDeProducaoProdutosSemGrupoAssociado({filtros}) {
  try {
    yield put(startLoading());
    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.getTotalOrdensDeProducaoProdutosSemGrupoAssociado, filtros)
    //CHAMADA SUCCESS
    yield put(getTotalOrdensDeProducaoProdutosSemGrupoAssociadoSuccess(retorno))
    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* getOrdensDeProducaoProdutosSemGrupoAssociado({filtros}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.getOrdensDeProducaoProdutosSemGrupoAssociado, filtros)

    //CHAMADA SUCCESS
    yield put(getOrdensDeProducaoProdutosSemGrupoAssociadoSuccess(retorno))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* getOrdensDeProducaoProdutosAssociadosAoGrupo({ id }) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.getOrdensDeProducaoProdutosAssociadosAoGrupo, id)

    //CHAMADA SUCCESS
    yield put(getOrdensDeProducaoProdutosAssociadoGrupoSuccess(retorno))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* getMateriaPrimaOrdemProducao({ordemDeProducao}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.getMateriaPrimaOrdemProducao, ordemDeProducao)
    //CHAMADA SUCCESS
    yield put(getMateriaPrimaOrdemProducaoSuccess(retorno))

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* ordenacaoRapida({idGrupoLP, ordens}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.ordenacaoRapida, idGrupoLP, ordens)
    //CHAMADA SUCCESS
    yield put(ordenacaoRapidaSuccess(retorno))
    yield put(buscarOrdensGrupoRequest(idGrupoLP));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    console.log(e)
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* alterarLinha({ordemFabricacao, linhaProducao, idGrupoLP}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.alterarLinha, ordemFabricacao, linhaProducao)
    //CHAMADA SUCCESS
    yield put(alterarLinhaSequenciamentoSuccess(retorno))
    yield put(buscarOrdensGrupoRequest(idGrupoLP));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

function* mudarOrdem({grupoLinhaProducao, ordens}) {
  try {
    yield put(startLoading());

    //CHAMADA API
    const retorno = yield call(ServiceSequenciamento.mudarOrdem, grupoLinhaProducao, ordens)
    //CHAMADA SUCCESS
    yield put(mudarOrdemSuccess(retorno))
    yield put(buscarOrdensGrupoRequest(grupoLinhaProducao));

    yield put(finishLoading());
  } catch (e) {
    //ERROR
    console.log(e)
    yield put(error(e.message));
    yield put(finishLoading());
  }
}

export default all([
  takeLatest(SEQUENCIAMENTO_SALVAR_REQUEST, gerarCodigo),
  takeLatest(SEQUENCIAMENTO_BUSCAR_GRUPOS_REQUEST, buscarGrupos),
  takeLatest(SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_REQUEST, buscarCatalogoDoProduto),
  takeLatest(SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_REQUEST, buscarOrdensInternasGrupoLinhaDeProducao),
  takeLatest(SEQUENCIAMENTO_ALTERAR_ORDEM_REQUEST, alterarOrdem),
  takeLatest(SEQUENCIAMENTO_EXCLUIR_REQUEST, deletar),
  takeLatest(SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_REQUEST, buscarLinhasGrupoLinhaDeProducao),
  takeLatest(SEQUENCIAMENTO_ASSOCIAR_PRODUTO_AO_GRUPO_REQUEST, associarProdutoAoGrupo),
  takeLatest(SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST, getTotalOrdensDeProducaoProdutosSemGrupoAssociado),
  takeLatest(SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST ,getOrdensDeProducaoProdutosSemGrupoAssociado),
  takeLatest(SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_REQUEST, getOrdensDeProducaoProdutosAssociadosAoGrupo),
  takeLatest(SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_REQUEST, getMateriaPrimaOrdemProducao),
  takeLatest(SEQUENCIAMENTO_ORDENACAO_RAPIDA_REQUEST, ordenacaoRapida),
  takeLatest(SEQUENCIAMENTO_ALTERAR_LDP_REQUEST, alterarLinha),
  takeLatest(SEQUENCIAMENTO_MUDAR_ORDEM_REQUEST, mudarOrdem),
])
