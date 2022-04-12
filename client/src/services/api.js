import axios from "axios";
import { path } from "ramda";
import { SERVER_URL } from "../config";
import { httpErrorHandler } from "./errorHandle";
import { httpSucessMessage } from "./handleSuccess";
import history from "../services/history";
import Alert from "react-s-alert";
import { CLIENT_URL } from "../config";
import {getMessage} from "../components/messages";

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

api.setAuth = ({ access_token, user }) => {
  // attach authorization data to sebsequent requests
  localStorage.setItem("token", access_token);
  localStorage.setItem("user", JSON.stringify(user));
  api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
};

api.setIdioma = idioma => {
  localStorage.setItem("language", idioma);
  api.defaults.headers.common["locale"] = idioma;
};

// interceptors
api.interceptors.request.use(
  // update config before request
  config => config,
  // handle request error
  error => handleError(error)
);

api.interceptors.response.use(
  // do something with response
  response => mapResponseToUsefulData(response),
  // handle response error
  error => handleError(error)
);

api.unsetAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  api.defaults.headers.common["Authorization"] = undefined;
};

api.logout = ({ redirectTimeout } = {}) => {
  if (!!localStorage.getItem("token")) {
    Alert.error(getMessage("sessao.sessaoExpirada.titulo"));
    setTimeout(function() {
      history.push(`${CLIENT_URL}/`);
    }, redirectTimeout);
  }

  api.unsetAuth();
};

// utility

const handleError = error => {
  // log
  console.error(error);
  // handle http erros
  httpErrorHandler(error);
  // extract in useful error format
  const usefulError = mapToUsefulError(error);
  // important:
  // message isn't string. It's object, with: { message: '...', error: {} }
  // publish error event
  //publish('error', usefulError);
  // return as promise rejected
  return Promise.reject(usefulError);
};

const mapResponseToUsefulData = response => {
  const data = response.data;

  if (data.messages) {
    httpSucessMessage(data.messages);
  }
  return data;
};

const mapToUsefulError = error => {
  // try get from body
  const messageFromBody = path(["response", "data", "message"], error);
  // const messageFromBody = path(['response', 'data'], error);
  if (messageFromBody) return { message: messageFromBody, error };
  // try get exception
  const messageFromError = error && error.message;
  if (messageFromError) return { message: messageFromError, error };
  // otherwise, return error
  return { message: error, error };
};

export default api;
