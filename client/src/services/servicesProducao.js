import api from "./api"
import {handleByteArray} from "./serviceUtils";

export const ServiceRelatorioProducao = {
  getDadosIniciais: () => {
    return api.get("/relatorioProducao/pegarDadosIniciaisRelatorio")
  },

  gerarRelatorio: (filtros) => {
    return api.get("/relatorioProducao/exportar", {
        params: {...filtros}
    }).then(handleByteArray)
  },



};
