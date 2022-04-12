import api from "./api";

export const ServiceGeracaoOrdemDeProducao = {
  buscarProdutos: ({codigo, descricao}) => {
    return api.get("/geracaoOrdemDeProducao/buscarProdutos", {
      params: {
        codigo,
        descricao
      }
    });
  },

  buscarPorOV: ({ordemDeVenda, codigoProduto}) => {
    return api.get("/geracaoOrdemDeProducao/buscarPorOrdemDeVenda", {
      params: {
        ordemDeVenda,
        codigoProduto
      }
    });
  },

  gerar: ({ entity }) => {
    return api.post(`/geracaoOrdemDeProducao`, {
      ...entity
    });
  },

  importar: ({ formData }) => {
    return api.patch(`/geracaoOrdemDeProducao/importar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },

  getUserFornecedores: () => {
    return api.get("/geracaoOrdemDeProducao/userFornecedores");
  },

}
