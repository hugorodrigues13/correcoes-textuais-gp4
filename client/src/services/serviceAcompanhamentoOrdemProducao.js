import api from "./api";
import {handleByteArray} from "./serviceUtils";

export const serviceAcompanhamentoOrdemProducao = {
  listar: filtros => {
    return api.get("/acompanhamentoOrdemProducao",
      { params: { ...filtros }}
      ).then(response => {
        const entities = response.entities.map(entity => ({
           ...entity
        }));
        return { ...response, entities };
      })
  },

  reexportar: id => {
    return api.get("/acompanhamentoOrdemProducao/reexportar",{params: { id: id }});
  },

  atualizar: () => {
    return api.patch("/acompanhamentoOrdemProducao/atualizar");
  },

  exportar: (filtros) => {
    return api.get("/acompanhamentoOrdemProducao/exportarOps",
      { params: { ...filtros }}
    ).then(handleByteArray)
  },

  ordensAtrasadas: filtros => {
    return api.get("/acompanhamentoOrdemProducao/ordensAtrasadas", {
      params: filtros
    })
  },

  prepareEdit: id => {
    return api.get("/acompanhamentoOrdemProducao/prepareEdit", {
      params: {id}
    })
  },

  edit: values => {
    return api.patch("/acompanhamentoOrdemProducao/editar", values)
  },

  alterarEmMassa: formData => {
    console.log(formData);
    return api.patch(`/acompanhamentoOrdemProducao/alterarEmMassa`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }
}
