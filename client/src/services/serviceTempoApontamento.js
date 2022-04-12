import api from "./api"

export const ServiceTempoApontamento = {
  list: (filtros) => {
    return api.get("/tempoApontamentoProduto", {
      params: {...filtros}
    })
  },
  edit: (id, tempo, todos) => {
    return api.patch("/tempoApontamentoProduto/editarTempo", {id, tempo, todos})
  },
}
