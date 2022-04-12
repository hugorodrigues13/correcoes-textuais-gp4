import api from "./api";
import axios from "axios";

export const ServiceApontamento = {
  validarSerial: ({serial, recurso, impressoraId}) => {
    return api.patch("/apontamento/validarSerial", {
      serial: serial,
      recurso: recurso,
      impressoraId: impressoraId,
    });
  },

  validarOF: ({of, recurso, impressoraId}) => {
    return api.patch("/apontamento/validarOF", {
      of: of,
      recurso: recurso,
      impressoraId: impressoraId,
    });
  },

  getRecursos: () => {
    return api.get("/apontamento/getRecursosDoFornecedor")
  },

  verificarParada: (recursoId) => {
    return api.get("/apontamento/verificarParada", {
      params: { recursoId }
    })
  },

  setMotivoParada: (paradaId, motivoId) => {
    return api.post("/apontamento/setarMotivoParada", {
      paradaId, motivoId
    })
  },

  pararRecurso: ({recursoId, acaoDoUsuario}) => {
    return api.post("/apontamento/pararRecurso", {
      recursoId,
      acaoDoUsuario
    })
  },

  getDadosApontamentoPorRecurso: recursoId => {
    return api.get("/apontamento/getDadosApontamentoPorRecurso", {
      params: { recursoId }
    })
      .then(response => {
        return response
      })
  },

  salvar: ({data}) => {
    return api.post("/apontamento", {
      ...data,
      serial: data.serial,
      recurso: data.recurso,
      defeito: data.defeito,
      impressora: data.impressora?.id,
      camposRastreaveis: data.camposRastreaveis
    });
  },

  verificarUsuario: ({data}) => {
    let teste = api.patch("/apontamento/verificarUsuario", {
      ...data
    });
    return teste;
  },

  gerarEtiqueta: ({data}) => {
    return api.get("/apontamento/gerarEtiqueta", { params: { serial: data.serial, recurso: data.recurso, impressora: data.impressora.id } })
      .then(response => {
        if(data.impressora.tipoImpressao === "SERVIDOR") {
          return response
        } else {
          if (response.etiqueta) {
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
          } else {
            return response;
          }
        }
      })
  }

}
