import api from "./api";
import {handleByteArray} from "./serviceUtils";

export const ServiceApontamentosPendentes = {
  listar: (filtros) => {
    return api.get("/apontamentosPendentes", {
      params: filtros
    })
  },
  exportar: (filtros) => {
    return api.patch("/apontamentosPendentes/exportar", {...filtros}).then(handleByteArray)
  }
}
