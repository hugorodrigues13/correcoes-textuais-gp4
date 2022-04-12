import api from "./api"
import {handleByteArray} from "./serviceUtils";

export const ServiceRomaneio = {
  getTodos: filters => {
    return api.get("/romaneio", {
      params: {...filters}
    }).then( response => {
      const entities = response.entities.map( entity => ({
        ...entity
      }));
      return {...response, entities}
    })
  },

  prepareEdit: id => {
    return api.get("/romaneio/prepareEdit", {
      params: {id}
    })
  },

  abrirStatus: (id) => {
    return api.patch("/romaneio/abrirRomaneio", {id})
  },

  fecharStatus: (id) => {
    return api.patch("/romaneio/cancelarRomaneio", {id})
  },

  mudarVolume: (id, volume) => {
    return api.patch("/romaneio/mudarVolume", {id, volume})
  },

  editarLotes: (id, selecionados) => {
    return api.patch("/romaneio/editarLotes", {id, selecionados})
  },

  listarLotes: (filtros, inclusos) => {
    return api.get("/romaneio/listarLotes", {
      params: {
        ...filtros,
        inclusos: inclusos.join(",")
      }
    })
  },

  historicoRomaneio: id => {
    return api.get("romaneio/getHistorico", {
      params: {id}
    })
  },

  exportar: id => {
    return api.get("/romaneio/exportarRomaneio", {
      params: {id}
    })
  },

  gerarNff: id => {
    return api.patch("/romaneio/gerarNff", {id})
  },

  exportarListagem: filtros => {
    return api.patch("/romaneio/exportarListagem", {...filtros})
      .then(handleByteArray)
  },

  verificaStatusIntegracao: romaneio => {
    return api.patch("/romaneio/verificaStatusIntegracao", {romaneio})
  },

  exportarXlsx: (id) => {
    return api.get('/romaneio/exportarXlsx', { params: { id } })
      .then(handleByteArray)
  },

  editarNfs: (id, nfEncomenda, nfRetorno) => {
    return api.patch("/romaneio/editarNfs", {
      id, nfEncomenda, nfRetorno
    })
  }
};
