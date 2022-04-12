import api from "./api";

export const ServiceGrupoRecurso = {
  list: filters => {
    return api.get(`/grupoRecurso`, {
      params: { ...filters }
    })
      .then(response => {
        const entities = response.entities.map(entity => ({
          ...entity
        }));
        return { ...response, entities };
      });
  },
  novo: () => {
    return api.get("/grupoRecurso/prepareNew");
  },
  salvar: ({entity}) => {
    return api.post("/grupoRecurso",{
      ...entity,
      operacao:  entity.operacao,
      nome:  entity.nome,
    });
  },
  prepararEditar: id => {
    return api.get("/grupoRecurso/prepareEdit", {
      params: { id }
    });
  },
  editar: ({ entity }) => {
    return api.put(`/grupoRecurso/${entity.id}`,{
      ...entity,
      operacao:  entity.operacao,
      nome:  entity.nome,
    });
  },
  deletar: id => {
    return api.delete(`/grupoRecurso/${id}`);
  },
  ativarDesativar: id => {
    return api.patch("/grupoRecurso/ativarOuDesativar", {
      id
    });
  },
}
