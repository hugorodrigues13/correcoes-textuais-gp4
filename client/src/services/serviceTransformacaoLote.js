import api from "./api";

export const ServiceTransformacaoLote = {
  buscarCaixas: (lote) => {
    return api.get("/transformacaoLote/buscarCaixas", {
      params: {lote}
    })
  },
  dividirLote: (lote, novoLoteCaixas) => {
    return api.patch("/transformacaoLote/dividirLote", {lote, novoLoteCaixas})
  },
  agruparLote: (lote1, lote2, manterLote1) => {
    return api.patch("/transformacaoLote/agruparLote", {lote1, lote2, manterLote1})
  },
  pesquisarLotes: (lote1, lote2) => {
    return api.get("/transformacaoLote/pesquisarLotes", {
      params: {lote1, lote2}
    })
  },
}
