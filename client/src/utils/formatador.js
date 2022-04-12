import moment from "moment";
import "moment-timezone";

export const formatadorTempo = tempo => {
    if(tempo) {
        if(typeof tempo === "string") {
            tempo = new Date(tempo);
        }
        const tempoAtual = moment.tz(tempo, Intl.DateTimeFormat().resolvedOptions().timeZone);
        const tempoFormatado = tempoAtual.format("DD/MM/YYYY HH:mm");
        const userLang = navigator.language || navigator.userLanguage;
        return tempoFormatado.toLocaleString(userLang.toLowerCase());
    }

    return tempo;
};

export const formataMensagemErrorRequisicao = e => {
  if (
    !e &&
    !e.error &&
    !e.error.response &&
    !e.error.response.data &&
    !e.error.response.data.messages
  ) {
    return e.message;
  }
  return e.error.response.data.messages;
};

/**
 * Get label validateSaatus for Item Form (Antd)
 * @param {Array.<Object>} data
 * {*Array [type: String, field: String]}
 * @param {String } fieldName
 */
export const retornaValidateStatus = (data, fieldName) => {
  if (!fieldName && !data && data.length !== 0) {
    return;
  }
  const retorno = data.filter(message => message.field === fieldName);
  if (retorno && retorno.length > 0) {
    return retorno[0].type;
  }
  return;
};

export const ordenaListaSelect = data => {
  return (data || []).sort((objectA, objectB) =>
    (objectA.value || "").toLowerCase() > (objectB.value || "").toLowerCase() ? 1 : -1
  );
};

export const ordenaLista = lista => {
  return (lista || []).sort((primeiroElemento, segundoElemento) =>
    primeiroElemento.toLowerCase() > segundoElemento.toLowerCase() ? 1 : -1
  );
};

export const normalizeText = value => {
  return value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const formataListaParaSelect = (list, key, value) => {
  return list.map(l => ({ ...l, key: l[key], value: l[value] }))
}

export const formataListaDeStringsParaSelect = (list) =>{
  return list.map(l => ({key: l, value: l}))
}
