import api from "./api"
import {handleByteArray} from "./serviceUtils";

export const ServiceGrupoLinhaProducao = {
  getTodos: filters => {
    return api
      .get("/grupoLinhaProducao", {
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
    return api.get( "/grupoLinhaProducao/prepareNew");
  },

  prepararEditar: id => {
    return api.get("/grupoLinhaProducao/prepareEdit", {
      params: { id }
    })
  },

  salvar: ({ entity }) => {
    return api.post( `/grupoLinhaProducao`, {
      ...entity
    })
  },

  deletar: id => {
    return api.delete( `/grupoLinhaProducao/${id}`);
  },

  editar: ({ entity }) => {
    return api.put(`/grupoLinhaProducao/${entity.id}`, {
      ...entity
    })
  },
  ativarDesativar: id => {
    return api.patch("/grupoLinhaProducao/ativarOuDesativar", {
      id
    });
  },

  exportar: (filtros) => {
    return api.patch(`/grupoLinhaProducao/exportar`, filtros)
      .then(handleByteArray)
  },
};
