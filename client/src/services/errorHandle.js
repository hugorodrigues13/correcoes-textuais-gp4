import api from "./api";
import Alert from "react-s-alert";
import store from "../store/index";
import { loginClean } from "../store/modules/Login/loginAction";
import {CLIENT_URL} from "../config";
import history from "../services/history";

const alertaError = messages => {
  messages.forEach(message => {
    if(message.type === "INFO_TYPE"){
      Alert.info(message.message);
    } else {
      Alert.error(message.message);
    }
  });
};

const httpErrorHandlers = {
  "401": error => {
    api.logout({ redirectTimeout: 3000 });
    store.dispatch(loginClean());
  },
  "422": error => {
    if (!!error.response.data.messages) {
      alertaError(error.response.data.messages || []);
    }
  },
  "400": error => {
    if (!!error.response.data.messages) {
      alertaError(error.response.data.messages || []);
    }
  },
  "409": error => {
    if (!!error.response.data.messages) {
      alertaError(error.response.data.messages || []);
    }
  },
  "403": error => {
    if (!!error.response.data.messages) {
      let indexForm = -1;
      if(window.location.pathname) indexForm = window.location.pathname.indexOf("/form");
      if(indexForm > -1){
        history.push(`${CLIENT_URL}${window.location.pathname.substring(0, indexForm)}`)
      }
      alertaError(error.response.data.messages || []);
    }
  },
  "404": error => {
    if (!!error.response.data.messages) {
      let indexForm = -1;
      if(window.location.pathname) indexForm = window.location.pathname.indexOf("/form");
      if(indexForm > -1){
        history.push(`${CLIENT_URL}${window.location.pathname.substring(0, indexForm)}`)
      }
      alertaError(error.response.data.messages || []);
    }
  },
  "500": error => {
    if(!!error.response.data.messages){
      alertaError(error.response.data.messages || []);
    }
  },
  "NETWORK_ERROR": error =>{
    let message = getMessage("erro.conexao.mensagem");
    const messages = [{message: message, type: 'error'}];
    alertaError(messages || []);
  },
};

export const httpErrorHandler = error => {
  if (error.response) {
    const { status } = error.response;
    const handler = httpErrorHandlers[`${status}`];

    handler && handler(error);
  }
};
