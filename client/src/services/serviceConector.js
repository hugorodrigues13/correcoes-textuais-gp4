import api from "./api";

export const ServiceConector = {
  getTodos: filters => {
    return api
      .get("/conector", {
        params: { ...filters }
      })
      .then(response => {
        const entities = response.entities.map(entity => ({
          ...entity
        }));
        return { ...response, entities };
      });
  },
  salvar: ({data}) => {
    return api.post("/conector/", {
      ...data,
      descricao: data.descricao,
      linhaForecast: data.linhaForecast,
      formacao: data.formacao
    });
  },
  deletar: id => {
    return api.delete(`/conector/${id}`)
  },
  editar: ({ entity }) => {
    return api.put(`/conector/${entity.id}`, {
      ...entity,
      descricao: entity.descricao,
      linhaForecast: entity.linhaForecast,
      formacao: entity.formacao
    });
  },
  novo: () => {
    return api.get("/conector/prepareNew");
  },
  prepararEditar: id => {
    return api.get("/conector/prepareEdit", {
          params: { id }
    });
  },
}
