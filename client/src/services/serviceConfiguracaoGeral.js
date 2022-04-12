import api from "./api";

export const ServiceConfGeral = {
  getTodos: filters => {
    return api.get("/configuracaoGeral", {
      params: { ...filters }
    });
  },

  getById: id => {
    return api.get(`/configuracaoGeral/${id}`);
  },

  setValor: ({ id, valor }) => {
    return api.patch(`/configuracaoGeral/${id}`, {valor: valor});
  }
};
