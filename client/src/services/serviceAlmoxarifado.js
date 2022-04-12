import api from "./api"

export const ServiceAlmoxarifado = {

  listar: (filtros) => {
    return api.get("/almoxarifado", {params: {...filtros}})
      .then(response => {
        return {...response, entities: response.entities}
      })
  },

  listarMateriais: (filtros) => {
    return api.get("/almoxarifado/listarMateriais", {params: {...filtros}})
  },

  setEmAberto: (id, justificativa) => {
    return api.patch("/almoxarifado/liberarOrdemDeFabricacao", {id, justificativa})
      .then(response => response.entities)
  },



};
