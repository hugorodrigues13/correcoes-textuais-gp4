import axios from "axios";
import Alert from "react-s-alert";
import {getMessage} from "../components/messages";
import dayjs from "dayjs";

// todo: utilizar essa função no serviceFaturamento, serviceApontamento
export function handleImpressoraResponse(response) {
  const {impressora, etiquetas} = response;
  if (!impressora || !impressora.id || impressora.tipoImpressao === "SERVIDOR") {
    return response;
  } else if (impressora && impressora.tipoImpressao === "AGENTE") {
    etiquetas.forEach((etiqueta, idx) => {
      if (etiqueta.success) {
        impressora.agentes.forEach(ipAgente => {
          axios.post(
            `${ipAgente}`,
            {
              "printerName": response.impressora.nome,
              "document": etiqueta.base64Etiqueta,
              "name": `ETQ${idx}`,
              "contentType": ".pdf"
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            }
          )
        })
      }
    })

    return [{success: true, message: "Etiquetas enviadas para o agente de impresssão!"}]
  }
}

export const baixarPdfEtiquetas = (etiqueta) => {
  if (!etiqueta.length || etiqueta?.some(e => !e.success)){
    Alert.warning(getMessage("comum.etiquetas.erro.label"))
  }
  etiqueta.forEach(etiqueta => {
    if (etiqueta.success) {
      const url = base64ToURL(etiqueta.base64Etiqueta, "application/pdf")
      window.open(url)
    }
  })
}

export const base64ToURL = (base64, type) => {
  const decodedContent = atob(base64);
  const byteArray = new Uint8Array(decodedContent.length);
  for (let i = 0; i < decodedContent.length; i++) {
    byteArray[i] = decodedContent.charCodeAt(i);
  }
  const blob = new Blob([byteArray.buffer], {type: type});
  let url = URL.createObjectURL(blob);
  return url
}


export function handleByteArray(response) {
  const byteArray = new Uint8Array(response.match(/.{2}/g)
    .map(e => parseInt(e, 16)));
  return new Blob([byteArray], {type: "application/octet-stream"})
}

export function downloadRelatorio(data, nome, extensao='.xlsx') {
  const dia = dayjs(new Date()).format("DD-MM-YYYY")
  let url = window.URL.createObjectURL( data );
  let a = document.createElement('a');
  a.href = url;
  a.download = getMessage(nome).replace('{data}', dia) + extensao;
  a.click();
}
