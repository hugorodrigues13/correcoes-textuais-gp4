import api from "./api"
import axios from "axios";
import {handleByteArray, handleImpressoraResponse} from "./serviceUtils";

export const ServiceOrdemFabricacao = {

  listar: (filtros) => {
    return api.get("/ordemDeFabricacao", {params: {...filtros}})
      .then(response => {
        return {...response, entities: response.entities}
      })
  },

  historicoImpressao: (id) => {
    return api.get("/ordemDeFabricacao/historicoImpressao", {params: {id: id}})
  },

  imprimirEtiqueta: (entity) => {
    return api.patch("/ordemDeFabricacao/imprimirEtiqueta", {...entity})
      .then(handleImpressoraResponse)
  },

  folhaImpressao: (data) => {
    const ids = data.map(obj => obj.id);
    return api.patch("/ordemDeFabricacao/folhaImpressao", {params: {ids: ids}})
  },

  folhaImpressaoData: (entity) => {
    return api.get("/ordemDeFabricacao/folhaImpressaoData", {params: {id: entity.id}})
  },

  exportar: (filtros) => {
    return api.get("/ordemDeFabricacao/exportarOfs",
      { params: { ...filtros }}
    )
    .then(handleByteArray)
  },
  materiasPrimas: (ordemProducao) => {
    return api.get("/ordemDeFabricacao/materiasPrimas", {params: {ordemProducao}})
  },
  enviarSeparacao: (values) => {
    return api.patch("/ordemDeFabricacao/enviarSeparacao", values)
  },

  alterarQuantidade: (id, quantidade) => {
    return api.patch("/ordemDeFabricacao/alterarQuantidade", {id, quantidade})
  },

  cancelar: (ids) => {
    return api.patch("/ordemDeFabricacao/cancelar", {ids})
  },

};
