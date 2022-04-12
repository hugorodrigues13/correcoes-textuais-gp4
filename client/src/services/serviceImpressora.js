import api from "./api"
import en from "react-intl/src/en";

export const ServiceImpressora = {
  getTodos: filters => {
    return api.get("/impressora", {
      params: { ...filters}
    }).then(response => {
      const entities = response.entities.map( entity => ({
        ...entity
      }));
      return {...response, entities}
    })
  },

  novo: () => {
    return api.get( "/impressora/prepareNew" )
  },

  salvar: ({ entity }) => {
    return api.post(`/impressora`, {
      ...entity
    })
  },

  prepararEditar: id => {
    return api.get("/impressora/prepareEdit", {
      params: {id}
    })
  },

  editar: ({ entity }) => {
    return api.put(`/impressora/${entity.id}`, {
      ...entity,
    })
  },

  deletar: id => {
    return api.delete(`/impressora/${id}`);
  }
};
