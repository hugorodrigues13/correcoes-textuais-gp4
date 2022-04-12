import api from "./api"
import en from "react-intl/src/en";

export const ServiceClassePorPlanejador = {
  getTodos: filters => {
    return api.get("/classePorPlanejador", {
      params: { ...filters}
    }).then(response => {
      const entities = response.entities.map( entity => ({
        ...entity
      }));
      return {...response, entities}
    })
  },

  novo: () => {
    return api.get( "/classePorPlanejador/prepareNew" )
  },

  salvar: ({ entity }) => {
    return api.post(`/classePorPlanejador`, {
      ...entity
    })
  },

  prepararEditar: id => {
    return api.get("/classePorPlanejador/prepareEdit", {
      params: {id}
    })
  },

  editar: ({ entity }) => {
    return api.put(`/classePorPlanejador/${entity.id}`, {
      ...entity,
    })
  },

  deletar: id => {
    return api.delete(`/classePorPlanejador/${id}`);
  }
};
