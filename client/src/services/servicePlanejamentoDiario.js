import api from "./api"
import {handleByteArray} from "./serviceUtils";

export const ServicePlanejamentoDiario = {
  listar: (filtros) => {
    return api.get("/planejamentoDiario", {
      params: {...filtros}
    })
  },
  prepareNovo: () => {
    return api.get("/planejamentoDiario/prepareNew")
  },
  prepareEditar: (id) => {
    return api.get("/planejamentoDiario/prepareEdit", {params: {id}})
  },
  editar: (values) => {
    return api.put(`/planejamentoDiario/${values.id}`, values)
  },
  novo: (values) => {
    return api.post('/planejamentoDiario', values)
  },
  deletar: (id) => {
    return api.delete(`/planejamentoDiario/${id}`)
  },
  exportar: (filtros) => {
    return api.post(`/planejamentoDiario/exportar`, filtros)
        .then(handleByteArray)
  },
}
