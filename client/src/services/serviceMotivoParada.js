import api from "./api";

export const ServiceMotivoParada = {
  list: (filters) => {
    return api.get("/motivoDeParada", {
      params: {...filters}
    })
  },
  prepareEdit: (id) => {
    return api.get("/motivoDeParada/prepareEdit", {
      params: {id}
    })
  },
  prepareNew: () => {
    return api.get("/motivoDeParada/prepareNew")
  },
  edit: (values) => {
    return api.put(`/motivoDeParada/${values.id}`, {...values})
  },
  novo: (values) => {
    return api.post('/motivoDeParada', {...values})
  },
  deletar: (id) => {
    return api.delete(`/motivoDeParada/${id}`)
  },
  ativarDesativar: id => {
    return api.patch("/motivoDeParada/ativarOuDesativar", {
      id
    });
  },
}
