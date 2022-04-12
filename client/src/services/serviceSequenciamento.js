import api from "./api"

export const ServiceSequenciamento = {
  getCatalogoDoProduto: (item) => {
    return api.get("/sequenciamento/getCatalogoDoProduto",{
      params: item
    });
  },
  buscarGrupos: () => {
    return api.get("/sequenciamento/buscarGrupos");
  },
  gerarCodigo: ({ordemDeFabricacao}) => {
    return api.post("/sequenciamento", {
      ...ordemDeFabricacao
    })
  },
  alterarOrdem: ({ordemDeFabricacao}) => {
    return api.put(`/sequenciamento/${ordemDeFabricacao.id}`, {
      ...ordemDeFabricacao
    })
  },
  buscarLinhasGrupoLinhaDeProducao: ({idGrupoLinha}) => {
    return api.get(`/sequenciamento/buscarLinhasDeProducao`, {
      params: {idGrupoLinha}
    })
  },
  deletar: id => {
    return api.delete(`sequenciamento/${id}`)
  },
  buscarOrdensInternasGrupoLinhaDeProducao: ({idGrupoLinha, values}) => {
    return api.get(`/sequenciamento/buscarOrdensInternasDoGrupo`, {
      params: {idGrupoLinha, ...values}
    })
  },

  associarProdutoAoGrupo:  ({produtoComGrupoSelecionado}) => {
    return api.patch(`/sequenciamento/associarProdutoAoGrupo`, {
      ...produtoComGrupoSelecionado
    })
  },
  getTotalOrdensDeProducaoProdutosSemGrupoAssociado: ( filtros ) => {
    return api.get("/sequenciamento/getTotalOrdensDeProducaoProdutosSemGrupoAssociado", {
      params: {...filtros}
    });
  },
  getOrdensDeProducaoProdutosSemGrupoAssociado: ( filtros ) => {
    return api.get("/sequenciamento/getOrdensDeProducaoProdutosSemGrupoAssociado", {
      params: {...filtros}
    });
  },
  getOrdensDeProducaoProdutosAssociadosAoGrupo:(id) => {
    return api.get(`/sequenciamento/getOrdensDeProducaoProdutosAssociadosAoGrupo`, {
      params: {id}
    })
  },
  getMateriaPrimaOrdemProducao: (ordemDeProducao) => {
    return api.get(`/sequenciamento/getMPComponentesLoteWIP`,{
      params: { ordemDeProducao }
    })
  },
  ordenacaoRapida: (idGrupoLP, ordens) => {
    return api.patch(`/sequenciamento/ordenacaoRapida`,{
      idGrupoLP, ordens
    })
  },
  alterarLinha: (ordemFabricacao, linhaProducao) => {
    return api.patch(`/sequenciamento/alterarLinhaProducao`,{
      ordemFabricacao, linhaProducao
    })
  },
  mudarOrdem: (grupoLinhaProducao, ordens) => {
    return api.patch(`/sequenciamento/mudarOrdem`,{
      grupoLinhaProducao, ordens
    })
  },
}
