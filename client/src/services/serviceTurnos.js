import api from "./api"

export const ServiceTurnos = {
  listar: (filtros) => {
    return api.get("/turno", {
      params: {...filtros}
    })
  },
  prepareNovo: () => {
    return api.get("/turno/prepareNew")
  },
  prepareEditar: (id) => {
    return api.get("/turno/prepareEdit", {params: {id}})
  },
  editar: (values) => {
    return api.put(`/turno/${values.id}`, values)
  },
  novo: (values) => {
    return api.post('/turno', values)
  },
  deletar: (id) => {
    return api.delete(`/turno/${id}`)
  },
}
