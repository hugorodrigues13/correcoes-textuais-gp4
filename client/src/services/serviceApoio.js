import api from "./api"



export const ServiceApoio = {

  buscarGruposLinhasDeProducao: () => {
    return api.get("/apoio")
  },

  buscarGrupoLinhasDeProducao: (id) => {
    return api.get("/apoio/grupoSelecionado", {params: {id}})
  },

  buscarSerialSelecionado: id => {
    return api.get("/apoio/serialSelecionado", {params: {id}})
  },


  redirecionarSerial: ({ entity }) => {
    return api.patch(`/apoio/redirecionarSerial`, {...entity})
  },


  descartarSerial: id => {
    return api.patch(`/apoio/descartarSerial`, {id});
  },

};
