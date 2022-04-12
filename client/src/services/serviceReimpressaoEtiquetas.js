import api from "./api";
import {handleImpressoraResponse} from "./serviceUtils";

export const ServiceReimpressaoEtiquetas = {

  reimprimir: (values) => {
    return api.patch("/reimpressaoEtiquetas/reimprimir", values)
      .then(handleImpressoraResponse)
  },

  impressoras: () => {
    return api.get("/reimpressaoEtiquetas/impressoras")
  },

  pesquisarDados: (lote) => {
    return api.get("/reimpressaoEtiquetas/pesquisarDados", {
      params: {lote}
    })
  }
}
