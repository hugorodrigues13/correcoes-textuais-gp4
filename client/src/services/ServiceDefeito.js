import api from "./api"

export const ServiceDefeito = {
  getTodos: filters => {
    return api.get("/defeito", {
      params: {...filters}
    }).then( response => {
      const entities = response.entities.map( entity => ({
        ...entity
      }));
      return {...response, entities}
    })
  },

  ativarDesativar: id => {
    return api.patch("/defeito/ativarOuDesativar", {
      id
    });
  },

  novo: () => {
    return api.get("/defeito/prepareNew")
  },

  salvar: ({ entity }) => {
    return api.post(`/defeito`, {
      ...entity
    })
  },

  prepararEditar: id => {
    return api.get( "/defeito/prepareEdit", {
      params: { id }
    })
  },

  editar: ({ entity }) => {
    return api.put(`/defeito/${entity.id}`, {
      ...entity
    })
  },

  deletar: id => {
    return api.delete(`defeito/${id}`)
  }
};
