import Alerta from "../components/Alerta";
import { receiveShowAlert } from "../utils/api/ErrorHandler";
import { tirarAlertaDeErroDaLista } from "../utils/api/RequestHandler";
import dayjs from "dayjs";

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

export function errorHandler(t, responseError, showAlert) {
  t.state.errors = [];
  responseError.forEach((error, i) => {
    let messageAlert = "";
    if (
      t.state.confirmePassword !== null &&
      t.state.confirmePassword !== undefined
    ) {
      t.state.password = "";
      t.state.confirmePassword = "";
    }
    if (error.arguments !== null && error.arguments !== undefined) {
      messageAlert = t.props.intl.formatMessage(
        { id: error.message },
        { arguments: error.arguments }
      );
    } else if (
      error.listaParametros !== null &&
      error.listaParametros !== undefined
    ) {
      messageAlert = t.props.intl.formatMessage(
        { id: error.message },
        { nome: error.listaParametros[i].nome }
      );
      error.listaParametros.forEach(parametro =>
        t.state.parametrosComRepeticao.push(parametro)
      );
    } else {
      messageAlert = t.props.intl.formatMessage({ id: error.message });
    }
    if (showAlert === true || showAlert === null || showAlert === undefined) {
      Alerta.handleAlert(
        "error",
        messageAlert,
        tirarAlertaDeErroDaLista,
        error.message
      );
    }
    t.state.errors.push({
      message: messageAlert,
      field: error.field !== null ? error.field : null
    });
  });
  t.setState(t.state);
  receiveShowAlert(showAlert);
}

export function validaResponse(getMessage, response) {
  return response !== "Network Error";
}

export function checaTimeout(getMessage, response) {
  if (typeof response === "string" || response instanceof String) {
    return response.includes("timeout");
  }
}

export function disabledDate(current) {
  return current < dayjs().startOf("day");
}

export const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
