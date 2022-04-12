import api from "./api"
import axios from "axios";
import {handleByteArray, handleImpressoraResponse} from "./serviceUtils";

export const ServiceSerial = {
  getTodos: filters => {
    return api.get("/serial", {
      params: {...filters}
    }).then(response => {
      const entities = response.entities.map( entity => ({
        ...entity
      }));
      return {...response, entities}
    })
  },

  getValoresIniciais: () => {
    return api.get("/serial/buscaValoresIniciais");
  },

  getHistorico: serialId => {
    return api.get("/serial/getHistoricosSerial", {
      params: {id: serialId}
    })
  },

  gerarEtiqueta: data => {
    return api.patch("/serial/gerarEtiqueta", { ...data}  )
      .then(handleImpressoraResponse)
  },
  imprimir: data => {
    return api.patch("/serial/imprimir", { ...data}  )
      .then(handleImpressoraResponse)
  },
  estornar: (serial, justificativa, apontamento) => {
    return api.patch("/serial/estornarApontamento", {serial, justificativa, apontamento})
  },
  exportar: (filtros) => {
    return api.patch("/serial/exportar", {...filtros})
      .then(handleByteArray)
  },

  sucatearSerial: (id) => {
    return api.patch("/serial/sucatear", {id})
  }
};
