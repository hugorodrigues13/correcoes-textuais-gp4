import api from "./api";

export const ServicePerfil = {
  getTodos: filters => {
    return api
      .get("/perfil", {
        params: { ...filters }
      })
      .then(response => {
        const entities = response.entities.map(entity => ({
          ...entity
        }));
        return { ...response, entities };
      });
  },

  getPermissoesUsuarioLogado: () => {
    return api.get("/perfil/permissoesByUser");
  },

  novo: () => {
    return api.get("/perfil/prepareNew");
  },

  prepararEditar: id => {
    return api.get("/perfil/prepareEdit", {
      params: { id }
    });
  },

  salvar: ({ entity }) => {
    return api.post(`/perfil`, {
      ...entity,
      authority: entity.role,
      nome: entity.nome,
      descricao: entity.descricao
    });
  },

  deletar: id => {
    return api.delete(`/perfil/${id}`);
  },

  editar: ({ entity }) => {
    return api.put(`/perfil/${entity.id}`, {
      ...entity,
      authority: entity.role,
      nome: entity.nome,
      descricao: entity.descricao
    });
  }
};
