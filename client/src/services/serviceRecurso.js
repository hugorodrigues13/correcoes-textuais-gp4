import api from "./api"
import en from "react-intl/src/en";

export const ServiceRecurso = {
  getTodos: filters => {
    return api.get("/recurso", {
      params: { ...filters}
    }).then(response => {
      const entities = response.entities.map( entity => ({
        ...entity
      }));
      return {...response, entities}
    })
  },

  novo: () => {
    return api.get( "/recurso/prepareNew" )
  },

  salvar: ({ entity }) => {
    return api.post(`/recurso`, {
      ...entity
    })
  },

  prepararEditar: id => {
    return api.get("/recurso/prepareEdit", {
      params: {id}
    })
  },

  prepararClonar: id => {
    return api.get('/recurso/prepareEdit', {
      params: {id}
    })
  },

  editar: ({ entity }) => {
    return api.put(`/recurso/${entity.id}`, {
      ...entity,
    })
  },

  deletar: id => {
    return api.delete(`/recurso/${id}`);
  },

  ativarDesativar: id => {
    return api.patch("/recurso/ativarOuDesativar", {
      id
    });
  },
};
