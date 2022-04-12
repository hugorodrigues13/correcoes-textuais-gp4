import {
  SEQUENCIAMENTO_SALVAR_REQUEST,
  SEQUENCIAMENTO_ERROR,
  SEQUENCIAMENTO_BUSCAR_GRUPOS_REQUEST,
  SEQUENCIAMENTO_BUSCAR_GRUPOS_SUCCESS,
  SEQUENCIAMENTO_SET_PRODUTO_SELECIONADO,
  SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_SUCCESS,
  SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_REQUEST,
  SEQUENCIAMENTO_SET_ORDEM_POS_ANTERIOR,
  SEQUENCIAMENTO_CANCELA_DROP,
  SEQUENCIAMENTO_SET_GRUPO_SELECIONADO,
  SEQUENCIAMENTO_ALTERAR_ORDEM_REQUEST,
  SEQUENCIAMENTO_ALTERAR_ORDEM_SUCCESS,
  SEQUENCIAMENTO_EXCLUIR_REQUEST,
  SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_REQUEST,
  SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_SUCCESS,
  SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_REQUEST,
  SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_SUCCESS,
  SEQUENCIAMENTO_HIDE_MODAL_CATALOGO,
  SEQUENCIAMENTO_ASSOCIAR_PRODUTO_AO_GRUPO_REQUEST,
  SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
  SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS,
  SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
  SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS,
  SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_REQUEST,
  SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_SUCCESS,
  SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_REQUEST,
  SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_SUCCESS,
  SEQUENCIAMENTO_ORDENACAO_RAPIDA_REQUEST,
  SEQUENCIAMENTO_ORDENACAO_RAPIDA_SUCCESS,
  SEQUENCIAMENTO_ALTERAR_LDP_REQUEST,
  SEQUENCIAMENTO_ALTERAR_LDP_SUCCESS,
  SEQUENCIAMENTO_MUDAR_ORDEM_REQUEST,
  SEQUENCIAMENTO_MUDAR_ORDEM_SUCCESS,
} from "../actionTypes";

export function buscarCatalogoDoProdutoRequest(item, descricao){
  return {
    type: SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_REQUEST,
    item,
    descricao
  }
}

export function buscarCatalogoDoProdutoSuccess(itens){
  return {
    type: SEQUENCIAMENTO_BUSCAR_CATALOGO_DO_PRODUTO_SUCCESS,
    itens
  }
}

export function buscarGruposRequest() {
  return {
    type: SEQUENCIAMENTO_BUSCAR_GRUPOS_REQUEST
  }
}

export function buscarGruposSuccess(data) {
  return {
    type: SEQUENCIAMENTO_BUSCAR_GRUPOS_SUCCESS,
    data
  }
}

export function buscaLinhasGrupoRequest(idGrupoLinha) {
  return {
    type: SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_REQUEST,
    idGrupoLinha
  }
}

export function buscarOrdensGrupoRequest(idGrupoLinha, values) {
  return {
    type: SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_REQUEST,
    idGrupoLinha,
    values
  }
}

export function buscaLinhasGrupoSuccess(data) {
  return {
    type: SEQUENCIAMENTO_BUSCAR_LINHAS_GRUPO_SUCCESS,
    data
  }
}

export function buscaOrdensGrupoSuccess(data) {
  return {
    type: SEQUENCIAMENTO_BUSCAR_ORDENS_GRUPO_SUCCESS,
    data
  }
}

export function salvarRequest(ordemDeFabricacao, idGrupoLinha) {
  return {
    type: SEQUENCIAMENTO_SALVAR_REQUEST,
    ordemDeFabricacao,
    idGrupoLinha
  }
}

export function setProdutoSelecionado(produto) {
  return {
    type: SEQUENCIAMENTO_SET_PRODUTO_SELECIONADO,
    produto
  }
}

export function setGrupoSelecionado(grupo) {
  return {
    type: SEQUENCIAMENTO_SET_GRUPO_SELECIONADO,
    grupo
  }
}

export function setOrdemPosAnterior(codigoOrdemAnterior) {
  return {
    type: SEQUENCIAMENTO_SET_ORDEM_POS_ANTERIOR,
    codigoOrdemAnterior
  }
}

export function cancelaDrop() {
  return {
    type: SEQUENCIAMENTO_CANCELA_DROP
  }
}

export function hideModalCatalogo() {
  return {
    type: SEQUENCIAMENTO_HIDE_MODAL_CATALOGO
  }
}

export function alterarOrdemRequest(ordemDeFabricacao, idGrupoLinha) {
  return {
    type: SEQUENCIAMENTO_ALTERAR_ORDEM_REQUEST,
    ordemDeFabricacao,
    idGrupoLinha
  }
}

export function excluirRequest(id, idGrupoLinha) {
  return {
    type: SEQUENCIAMENTO_EXCLUIR_REQUEST,
    id,
    idGrupoLinha
  }
}

export function alterarOrdemSuccess(data) {
  return {
    type: SEQUENCIAMENTO_ALTERAR_ORDEM_SUCCESS,
    data
  }
}

export function getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest(filtros) {
  return {
    type: SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
    filtros
  }
}

export function getTotalOrdensDeProducaoProdutosSemGrupoAssociadoSuccess(data) {
  return {
    type: SEQUENCIAMENTO_TOTAL_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS,
    data
  }
}

export function getOrdensDeProducaoProdutosSemGrupoAssociadoRequest(filtros) {
  return {
    type: SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_REQUEST,
    filtros
  }
}

export function getOrdensDeProducaoProdutosSemGrupoAssociadoSuccess(data) {
  return {
    type: SEQUENCIAMENTO_OP_PRODUTOS_SEM_GRUPO_ASSOCIADO_SUCCESS,
    data
  }
}

export function getOrdensDeProducaoProdutosAssociadoGrupoRequest(id) {
  return {
    type: SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_REQUEST,
    id
  }
}

export function getOrdensDeProducaoProdutosAssociadoGrupoSuccess(data) {
  return {
    type: SEQUENCIAMENTO_OP_PRODUTOS_ASSOCIADO_GRUPO_SUCCESS,
    data
  }
}

export function associarProdutoAoGrupoRequest(produtoComGrupoSelecionado, filtros) {
  return {
    type: SEQUENCIAMENTO_ASSOCIAR_PRODUTO_AO_GRUPO_REQUEST,
    produtoComGrupoSelecionado,
    filtros
  }
}

export function getMateriaPrimaOrdemProducaoRequest(data) {
  return {
    type: SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_REQUEST,
    ordemDeProducao: data
  }
}

export function getMateriaPrimaOrdemProducaoSuccess(data) {
  return {
    type: SEQUENCIAMENTO_GET_MATERIA_PRIMA_ORDEM_PRODUCAO_SUCCESS,
    data
  }
}

export function ordenacaoRapidaRequest(idGrupoLP, ordens){
  return {
    type: SEQUENCIAMENTO_ORDENACAO_RAPIDA_REQUEST,
    idGrupoLP, ordens
  }
}

export function ordenacaoRapidaSuccess(data){
  return {
    type: SEQUENCIAMENTO_ORDENACAO_RAPIDA_SUCCESS,
    data
  }
}

export function alterarLinhaSequenciamentoRequest(ordemFabricacao, linhaProducao, idGrupoLP){
  return {
    type: SEQUENCIAMENTO_ALTERAR_LDP_REQUEST,
    ordemFabricacao, linhaProducao, idGrupoLP,
  }
}

export function alterarLinhaSequenciamentoSuccess(data){
  return {
    type: SEQUENCIAMENTO_ALTERAR_LDP_SUCCESS,
    data
  }
}

export function mudarOrdemRequest(grupoLinhaProducao, ordens){
  return {
    type: SEQUENCIAMENTO_MUDAR_ORDEM_REQUEST,
    grupoLinhaProducao, ordens
  }
}

export function mudarOrdemSuccess(data){
  return {
    type: SEQUENCIAMENTO_MUDAR_ORDEM_SUCCESS,
    data
  }
}

// ERROR
export function error(error) {
  return {
    type: SEQUENCIAMENTO_ERROR,
    error
  };
}
