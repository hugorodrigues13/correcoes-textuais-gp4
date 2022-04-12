import api from "./api";

export const ServiceAsaichi = {

  list: (filtros) => {
    return api.get("/asaichi", {
      params: {
        ...filtros
      }
    })
  },

  tabelaProducao: (filtros) => {
    return api.get("/asaichi/tabelaProducao", {
      params: {
        ...filtros
      }
    })
  },

  tabelaDefeitos: (filtros) => {
    return api.get("/asaichi/tabelaDefeitos", {
      params: {
        ...filtros
      }
    })
  },

  tabelaProdutividade: (filtros) => {
    return api.get("/asaichi/tabelaProdutividade", {
      params: {
        ...filtros
      }
    })
  },

  producaoDiaria: (filtros) => {
    return api.get("/asaichi/producaoDiaria", {
      params: {
        ...filtros
      }
    })
  },

  producaoSemanal: (filtros) => {
    return api.get("/asaichi/producaoSemanal", {
      params: {
        ...filtros
      }
    })
  },

  producaoMensal: (filtros) => {
    return api.get("/asaichi/producaoMensal", {
      params: {
        ...filtros
      }
    })
  },

  graficoDefeitos: (filtros) => {
    return api.get("/asaichi/graficoDefeitos", {
      params: {
        ...filtros
      }
    })
  },

}
