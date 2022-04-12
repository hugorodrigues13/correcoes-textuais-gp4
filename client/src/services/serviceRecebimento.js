import api from "./api"

export const ServiceRecebimento = {
  list: (filtros) => {
    return api.get("/recebimento", {
      params: {...filtros}
    })
  },
  concluirManualmente: (id) => api.patch('/recebimento/concluirManualmente', { id }),
}
