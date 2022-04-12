import api from "./api"

export const ServicePrefixoProducaoFornecedor = {
  getTodos: filters => {
    return api.get("/prefixoProducaoFornecedor", {
      params: { ...filters}
    }).then(response => {
      return response
    }).catch(e=>console.log(e))
  },

  prepararEditar: id => {
    return api.get( "/prefixoProducaoFornecedor/prepareEdit", {
      params: { id }
    })
  },

  setValor: (entity) => {
    let { prefixoProducao, id, endereco } = entity;
    return api.put(`/prefixoProducaoFornecedor/${id}`, {
      prefixoProducao: prefixoProducao,
      endereco: endereco,
    });
  }

};
