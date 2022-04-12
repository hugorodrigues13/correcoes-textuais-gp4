import api from "./api";

export const ServiceLogOperacao = {
  getTodos: filtros => {
    return api.get("/logOperacao", {
      params: { ...filtros }
    });
  },

  getById: id => {
    return api.get(`/logOperacao/${id}`);
  }
};
