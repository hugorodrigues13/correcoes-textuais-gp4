import api from "./api"

export const ServiceRelatorios = {
  getDadosIniciais: () => {
    return api.get("/relatorio/getDadosRelatorioSerial")
  },

  pesquisarDados: (lote, codigoProduto, ordemFabricacao, ordemProducao) => {
    return api.get("/relatorio/pesquisarDadosRelatorioSerial", {
      params: {
        lote, codigoProduto, ordemFabricacao, ordemProducao
      }
    })
  },

  gerarRelatorioSerial: (filtros) => {
    return api.get("/relatorio/relatorioSerial", {params: {...filtros}})
      .then(response => {
        const byteArray = new Uint8Array(response.match(/.{2}/g)
          .map(e => parseInt(e, 16)));
        return new Blob([byteArray], {type: "application/octet-stream"})
      })
  },



};
