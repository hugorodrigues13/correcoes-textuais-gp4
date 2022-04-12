import Alerta from "../components/alertas/Alerta";
import store from "../store/index";
import { setMessages } from "../store/modules/Alertas/alertasAction";
import moment from "moment";
import humanizeDuration from "humanize-duration";

export function flattenMessages(nestedMessages, prefix = "") {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, {});
}

export function objectToQueryStringParameters(objeto) {
  const parametros = Object.entries(objeto)
    .filter(([key, val]) => {
      return (
        val !== null &&
        (typeof val !== "string" ||
          (typeof val === "string" && val.trim() !== ""))
      );
    })
    .map(([key, val]) => {
      return `${key}=${typeof val === "string" ? val.trim() : val}`;
    })
    .join("&");

  return parametros !== undefined && parametros !== "" ? `?${parametros}` : "";
}

export function errorHandler(t, responseErrors, showAlert = true) {
  let errors = [];
  responseErrors.forEach((error, i) => {
    let messageAlert = "";
    if (error.arguments !== null && error.arguments !== undefined) {
      messageAlert = t.props.intl.formatMessage(
        { id: error.message },
        { arguments: error.arguments }
      );
    } else {
      messageAlert = t.props.intl.formatMessage({ id: error.message });
    }
    if (showAlert === true || showAlert === undefined) {
      Alerta.handleAlert("error", messageAlert, error.message);
    }
    errors.push({
      type: "error",
      message: messageAlert,
      field: error.field !== null ? error.field : null
    });
  });
  store.dispatch(setMessages(errors));
}

export function validaResponse(getMessage, response) {
  return response !== "Network Error";
}

export function checaTimeout(getMessage, response) {
  if (typeof response === "string" || response instanceof String) {
    return response.includes("timeout");
  }
}

export function unique(array, propertyName) {
  return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}

export function corrigeDataParaEnvio(filtros, propriedade, format, endOfDay=false){
  if (filtros[propriedade]){
    if (endOfDay){
      filtros[propriedade + "Inicial"] = moment(filtros[propriedade][0]).startOf('day').format(format)
      filtros[propriedade + "Final"] = moment(filtros[propriedade][1]).endOf('day').format(format)
    } else {
      filtros[propriedade + "Inicial"] = moment(filtros[propriedade][0]).format(format)
      filtros[propriedade + "Final"] = moment(filtros[propriedade][1]).format(format)
    }
    filtros[propriedade] = undefined
  }
}

export const humanizeDurationShort =
  humanizeDuration.humanizer({
    round: true,
    languages: {
      pt: {
        y: () => "a",
        mo: () => "m",
        w: () => "s",
        d: () => "d",
        h: () => "h",
        m: () => "m",
        s: () => "s",
        ms: () => "ms",
      },
      es: {
        y: () => "a",
        mo: () => "m",
        w: () => "s",
        d: () => "d",
        h: () => "h",
        m: () => "m",
        s: () => "s",
        ms: () => "ms",
      },
      en: {
        y: () => "a",
        mo: () => "m",
        w: () => "s",
        d: () => "d",
        h: () => "h",
        m: () => "m",
        s: () => "s",
        ms: () => "ms",
      },
    },
  });
