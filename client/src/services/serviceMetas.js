import api from "./api";

export const ServiceMetas = {
  list: (filters) => {
    return api.get("/meta", {
      params: {...filters}
    })
  },
  prepareEdit: (id) => {
    return api.get("/meta/prepareEdit", {
      params: {id}
    })
  },
  prepareNew: () => {
    return api.get("/meta/prepareNew")
  },
  edit: (values) => {
    return api.put(`/meta/${values.id}`, {...values})
  },
  novo: (values) => {
    return api.post('/meta', {...values})
  },
  deletar: (id) => {
    return api.delete(`/meta/${id}`)
  }
}
