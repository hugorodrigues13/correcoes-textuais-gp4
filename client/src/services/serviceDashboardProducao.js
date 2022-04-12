import api from "./api"
import en from "react-intl/src/en";

export const ServiceDashboardProducao = {
  dadosProducao: () => {
    return api.get("/dashboardProducao/index/")
  },
  indicadores: () => {
    return api.get("/dashboardProducao/buscarIndicadores/")
  },
  statusSeriais: (filtros) => {
    return api.get("/dashboardProducao/buscarStatusDosSeriais/", {
      params: filtros
    })
  },
  seriaisDoDia: (filtros) => {
    return api.get("/dashboardProducao/buscarSeriaisDoDia/", {
      params: filtros
    })
  }

};
