import api from "./api";

export const ServiceAuditoria = {
  getTodos: filters => {
    return api.get("/auditoria", {
      params: { ...filters }
    });
  },

  getById: id => {
    return api.get(`/auditoria/${id}`);
  }
};
