import axios from "axios";
import Alerta from "../../components/Alerta";
import auth from "../auth";
import { intlShape } from "react-intl";
import PropTypes from "prop-types";

let AxiosHttpInterceptor = props => {
  let requestInterc = axios.interceptors.request.use(
    async config => {
      var isSessaoExpirada = auth.isSessaoExpirada();

      if (isSessaoExpirada) {
        throw new axios.Cancel({
          data: {
            messages: [
              { message: "sessao.sessaoExpirada.mensagem", type: "error" }
            ]
          }
        });
      }

      if (!!requestInterc || requestInterc === 0) {
        axios.interceptors.request.eject(requestInterc);
      }

      if (
        !config.url.endsWith("login") ||
        !config.url.endsWith("access_token")
      ) {
        config.showLoading =
          config.showLoading === undefined ? true : config.showLoading;
        if (config.showLoading) {
          props.contexto.setState({ isSendingRequest: true });
        }
        config.timeout = 600000;
      }
      return config;
    },
    error => {
      props.contexto.setState({ isSendingRequest: false });
      return Promise.reject(error);
    }
  );

  let responseInterc = axios.interceptors.response.use(
    response => {
      if (!!responseInterc || responseInterc === 0) {
        axios.interceptors.request.eject(responseInterc);
      }

      if (response.config.source) {
        response.config.source.cancel();
      }

      if (response.data && response.data.messages) {
        response.data.messages.forEach(message => {
          Alerta.handleAlert(
            message.type,
            props.contexto.getMessage(message.message)
          );
        });
      }
      props.contexto.setState({ isSendingRequest: false });
      return response;
    },
    error => {
      props.contexto.setState({ isSendingRequest: false });
      if (axios.isCancel(error)) {
        if (error.message.data && error.message.data.messages) {
          error.message.data.messages.forEach(message => {
            Alerta.handleAlert(
              message.type,
              props.contexto.getMessage(message.message)
            );
          });
        }
      } else {
        // const requestConfig = error.config;
        if (error.response.status === 401) {
          props.contexto.props.reconhecerSessaoExpirou();
        } else if (error.response.status === 422) {
          error.config.executaNoTratamentoDo422(error.response.data.errors);
        } else {
          if (error.data && error.data.messages) {
            error.data.messages.forEach(message => {
              Alerta.handleAlert(
                message.type,
                props.contexto.getMessage(message.message)
              );
            });
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return null;
};

AxiosHttpInterceptor.propTypes = {
  intl: intlShape.isRequired,
  showLoading: PropTypes.bool,
  executaNoTratamentoDo422: PropTypes.func
};

export function criaInterceptadores() {}
