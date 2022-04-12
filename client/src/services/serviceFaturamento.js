import api from "./api";
import axios from "axios";
import {handleByteArray} from "./serviceUtils";

export const serviceFaturamento = {
  listar: filtros => {
    return api.get("/faturamento", {
      params: {...filtros}
    }).then(response => {
      const lotes = response.lotes.map(lote => ({
        ...lote
      }));
      return {...response, lotes}
    })
  },

  listarImpressoras: () => {
    return api.get("/faturamento/impressoras")
  },

  envioLoteRomaneio: (data) => {
    let { id } = data
    return api.post(`/faturamento/enviarParaRomaneio`, {
      id: id[0]
    })
  },

  checarLoteRomaneio: (data) => {
    let { id } = data
    return api.get(`/faturamento/checarEnvioParaRomaneio`, {
      params: {
        id: id.join(",")
      }
    })
  },

  fecharLoteIncompleto: ({data}) => {
    let { id, codigoLote, justificativa, statusLote, impressora } = data
    return api.post(`/faturamento/fecharLoteIncompleto`, {
      id: id,
      codigoLote: codigoLote,
      statusLote: statusLote,
      justificativa: justificativa,
      impressora: (impressora||{}).id,
    }).then(response => {
      if (!response.etiqueta) return // se não tiver impressoes pendentes
      if(data.impressora.tipoImpressao === "SERVIDOR") {
        return response
      } else {
        response.etiqueta.forEach((etiqueta, idx) => {
          if(etiqueta.success) {
            data.impressora.agentes.forEach(ipAgente => {
              axios.post(
                `${ipAgente}`,
                { "printerName": data.impressora.nome, "document": etiqueta.base64Etiqueta, "name": `ETQ${idx}`, "contentType": ".pdf" },
                { headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  }}
              )
            })
          }
        })

        return [{success: true, message: "Etiquetas enviadas para o agente de impresssão!"}]
      }
    })
  },

  exportarLotes: () => {
    return api.patch(`/faturamento/exportarLotes`)
      .then(handleByteArray)
  },

  exportarCaixas: (lote) => {
    return api.post(`/faturamento/exportarCaixas`, {lote})
      .then(handleByteArray)
  },

  exportarExcel: (filtros) => {
    return api.post(`/faturamento/exportarExcel`, filtros)
      .then(handleByteArray)
  },

  getCaixas: (lote) => {
    return api.get('/faturamento/caixasDoLote', {params: {lote}})
  },

  abrirLote: id => {
    return api.post(`/faturamento/abrirLote`, {
      id
  })},

  concluirOP: (data) => {
    return api.post(`/faturamento/concluirOP`, {
      lote: data.lote
    })
  },
}
