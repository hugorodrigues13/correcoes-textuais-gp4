import api from "./api";

export const ServiceApontamentoDeMaterial = {
  list: filters => {
    return api
      .get("/apontamentoMaterial", {
        params: { ...filters }
      })
      .then(response => {
        const entities = response.entities.map(entity => ({
          ...entity
        }));
        return { ...response, entities };
      });
  },
  buscarOrdensDeProducao: (ordemDeProducao) => {
    return api.get("/apontamentoMaterial/buscaOrdensDeProducao", {
      params: {ordemDeProducao}
    })
  },

  buscarMateriais: (ordemDeProducao) => {
    return api.get("/apontamentoMaterial/buscaMateriaisDaOrdemDeProducao", {
      params: {ordemDeProducao}
    })
  },

  buscarLotesDisponiveis: ({codigoProduto, organizationId, codigoSubinventario, locatorId}) => {
    return api.get("/apontamentoMaterial/buscaLotesDisponiveisParaMateriaPrima", {
      params: {codigoProduto, organizationId, codigoSubinventario, locatorId}
    })
  },

  apontar: ({ordemDeProducao, codigoProduto, quantidade, tipo, codigoLote}) => {
    return api.post("/apontamentoMaterial", {
      ordemDeProducao, codigoProduto, quantidade, tipo, codigoLote
    })
  },

  importar: ({ formData }) => {
    return api.patch(`/apontamentoMaterial/importar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
}
