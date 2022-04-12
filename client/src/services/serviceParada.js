import api from "./api";

export const ServiceParada = {
  getTodos: filters => {
    return api.get("/paradas", {
            params: { ...filters }
           })
  },
  listSelectMotivoParada: () => {
    return api.get("/paradas/getTodosMotivos")
  },
  updateMotivoRequest: ( data ) => {
    return api.patch("/paradas/updateMotivoRequest", data)
  },
  dividirParadaRequest: ( data ) => {
    return api.post("/paradas/dividirParadas", {
      paradas: data
    })
  }
}
