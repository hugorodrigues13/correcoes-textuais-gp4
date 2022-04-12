import api from "./api"

export const ServiceDashProgramacao = {

  listar: (filtros) => {
    return api.get("/home/dashboardProgramacao/",
      { params: filtros }
      )
  },



};
