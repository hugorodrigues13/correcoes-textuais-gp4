import api from "./api"

export const ServiceProdutoEtiqueta = {
  getTodos: filters => {
    return api.get("/produtoEtiqueta", {
      params: {...filters}
    }).then( response => {
      const entities = response.entities.map( entity => ({
        ...entity
      }))
      return {...response, entities}
    })
  },

  novo: () => {
    return api.get("/produtoEtiqueta/prepareNew")
  },

  salvar: ({ entity }) => {
    return api.post("/produtoEtiqueta", {
      ...entity
    })
  },

  prepararEditar: id => {
    return api.get("/produtoEtiqueta/prepareEdit", {
      params: { id }
    })
  },

  editar: ({ entity }) => {
    return api.put(`/produtoEtiqueta/${entity.id}`, {
      ...entity
    })
  },

  deletar: id => {
    return api.delete(`produtoEtiqueta/${id}`)
  },

  gerarRelatorioEtiqueta: (filtros) => {
      return api.get("/produtoEtiqueta/relatorioEtiqueta", {params: {...filtros}})
        .then(response => {
          const byteArray = new Uint8Array(response.match(/.{2}/g)
            .map(e => parseInt(e, 16)));
          return new Blob([byteArray], {type: "application/octet-stream"})
        })
    },
};
