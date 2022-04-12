import api from "./api"

export const ServiceAcesso = {
  getTodos: filters => {
    return api
      .get("/acesso", {
        params: {...filters}
      })
      .then(response => {
        const entities = response.entities.map(entity => ({
          ...entity
        }));
        return { ...response, entities }
      })
  },

  novo: () => {
    return api.get( "/acesso/prepareNew");
  },

  prepararEditar: id => {
    return api.get("/acesso/prepareEdit", {
      params: { id }
    })
  },

  salvar: ({ entity }) => {
    return api.post( `/acesso`, {
      ...entity
    })
  },

  deletar: id => {
    return api.delete( `/acesso/${id}`);
  },

  editar: ({ entity }) => {
    return api.put(`/acesso/${entity.id}`, {
      ...entity
    })
  }
};
