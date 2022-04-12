import PropTypes from "prop-types";
import axios from "axios";
import { intlShape, injectIntl } from "react-intl";

import { errorHandler, conexaoInvalidaHandler } from "./ErrorHandler";
import { checaTimeout, validaResponse } from "../../components/utils";

let mensagensDeAlertasAbertas = [];
let requisicoes = [];

export let tirarAlertaDeErroDaLista = mensagem => {
  let mensagemASerRemovida = mensagensDeAlertasAbertas.filter(
    mensagemDeAlertaAberta => {
      return mensagem === mensagemDeAlertaAberta;
    }
  );
  let posicao = requisicoes.indexOf(mensagemASerRemovida[0]);
  mensagensDeAlertasAbertas.splice(posicao, 1);
};

function Requisicao() {
  this.carregadorSilencioso = false;
  this.errosSilenciosos = false;
  this.executaNoTratamentoDo422 = null;
  this.substituiTratamentoDo422 = null;
}

Requisicao.prototype.constructor = function(
  id,
  carregadorSilencioso,
  errosSilenciosos,
  executaNoTratamentoDo422 = null,
  substituiTratamentoDo422 = null
) {
  this.id = id;
  this.carregadorSilencioso = carregadorSilencioso;
  this.errosSilenciosos = errosSilenciosos;
  this.executaNoTratamentoDo422 = executaNoTratamentoDo422;
  this.substituiTratamentoDo422 = substituiTratamentoDo422;
};

let inserirNovaMensagemAlerta = message => {
  mensagensDeAlertasAbertas.push(message);
};

let checarAlertaRepetido = mensagem => {
  let existencia = false;
  for (let mensagemAlerta of mensagensDeAlertasAbertas) {
    if (mensagemAlerta === mensagem) {
      existencia = true;
      break;
    }
  }
  return existencia;
};

let checarExistenciaRequisicoesComLoader = () => {
  let existencia = false;
  for (let requisicao of requisicoes) {
    if (requisicao.carregadorSilencioso === false) {
      existencia = true;
      break;
    }
  }
  return existencia;
};

let abrirRequisicao = requisicao => {
  requisicoes.push(requisicao);
  conexoesAbertas = requisicoes.length;
};

let checarSeEsperaErro = idRequisicaoAtual => {
  let esperaErro = true;
  for (let requisicao of requisicoes) {
    if (
      requisicao.id === idRequisicaoAtual &&
      requisicao.errosSilenciosos === true
    ) {
      esperaErro = false;
      break;
    }
  }
  return esperaErro;
};

let fecharRequisicao = idRequisicaoAtual => {
  let requisicaoASerDeletada = requisicoes.filter(requisicao => {
    return requisicao.id === idRequisicaoAtual;
  });
  let posicao = requisicoes.indexOf(requisicaoASerDeletada[0]);
  requisicoes.splice(posicao, 1);
  conexoesAbertas = requisicoes.length;
};

let conexoesAbertas = requisicoes.length;

let RequestHandler = props => {
  let getMessage = (id, argumento) => {
    return props.intl.formatMessage({ id: id }, { arguments: argumento });
  };

  let abrirLoader = () => {
    props.requestSent();
  };

  let fecharLoader = () => {
    props.requestReceived();
  };

  let mudarSwitchRequisicao = () => {
    props.mudarSwitchRequisicao();
  };

  let setMessageSpinner = message => {
    props.setMessageSpinner(message);
  };

  ///////////////////////////////////////
  //Interceptors                      //
  //////////////////////////////////////
  let interceptorRequest = axios.interceptors.request.use(
    function(config) {
      if (config.timeout == null) {
        config.timeout = 600000;
      }

      if (!!interceptorRequest || interceptorRequest === 0) {
        axios.interceptors.request.eject(interceptorRequest);
      }

      let conexaoId;

      setMessageSpinner(config.messageSpinner);

      if (requisicoes.length === 0) {
        conexaoId = 0;
      } else {
        conexaoId = requisicoes[requisicoes.length - 1].id + 1;
      }

      config.pipelineId = parseInt(conexaoId, 10);

      let silencioso = false;
      if (config.silent) {
        silencioso = true;
        mudarSwitchRequisicao();
      }

      let semErros = false;
      if (config.noError) {
        semErros = true;
        mudarSwitchRequisicao();
      }

      let executaNoTratamentoDo422 = null;
      if (config.executaNoTratamentoDo422) {
        executaNoTratamentoDo422 = config.executaNoTratamentoDo422;
      }

      let substituiTratamentoDo422 = null;
      if (config.substituiTratamentoDo422) {
        substituiTratamentoDo422 = config.substituiTratamentoDo422;
      }

      let novaRequisicao = new Requisicao();
      novaRequisicao.constructor(
        conexaoId,
        silencioso,
        semErros,
        executaNoTratamentoDo422,
        substituiTratamentoDo422
      );
      if (!novaRequisicao.carregadorSilencioso) {
        if (conexoesAbertas === 0 || !checarExistenciaRequisicoesComLoader()) {
          abrirLoader();
        }
      }

      abrirRequisicao(novaRequisicao);
      return config;
    },
    function(error) {
      if (!!interceptorRequest || interceptorRequest === 0) {
        axios.interceptors.request.eject(interceptorRequest);
      }
      let requisicaoId = 0;
      if (error.config !== undefined) {
        requisicaoId = error.config.pipelineId;
      }
      fecharRequisicao(requisicaoId);
      if (!checarExistenciaRequisicoesComLoader()) {
        fecharLoader();
      }

      return Promise.reject(error);
    }
  );

  let interceptorResponse = axios.interceptors.response.use(
    function(response) {
      if (!!interceptorResponse || interceptorResponse === 0) {
        axios.interceptors.response.eject(interceptorResponse);
      }

      if (response.config.source) {
        response.config.source.cancel();
      }

      let requisicaoId = response.config.pipelineId;
      fecharRequisicao(requisicaoId);
      if (!checarExistenciaRequisicoesComLoader()) {
        fecharLoader();
      }

      return response;
    },
    function(error) {
      if (!!interceptorResponse || interceptorResponse === 0) {
        axios.interceptors.response.eject(interceptorResponse);
      }

      let respostaValida = validaResponse(getMessage.bind(this), error.message);
      let houveTimeout = checaTimeout(getMessage.bind(this), error.message);
      let errorMessage;
      if (!respostaValida || houveTimeout) {
        errorMessage = error.message;
      } else if (error.response) {
        errorMessage = error.response.data.message;
      }

      let requisicaoId = 0;
      let esperaErro = checarSeEsperaErro(requisicaoId);
      let executaNoTratamentoDo422 = null;
      let substituiTratamentoDo422 = null;

      if (error.config !== undefined) {
        requisicaoId = error.config.pipelineId;
        esperaErro = checarSeEsperaErro(requisicaoId);
        executaNoTratamentoDo422 = error.config.executaNoTratamentoDo422;
        substituiTratamentoDo422 = error.config.substituiTratamentoDo422;
      } else {
        requisicaoId = 0;
        esperaErro = checarSeEsperaErro(requisicaoId);
        executaNoTratamentoDo422 = null;
        substituiTratamentoDo422 = null;
      }

      fecharRequisicao(requisicaoId);
      if (!checarExistenciaRequisicoesComLoader()) {
        fecharLoader();
      }

      if (
        esperaErro &&
        respostaValida &&
        !houveTimeout &&
        error.response !== undefined
      ) {
        errorHandler(
          props,
          getMessage,
          error.response.status,
          error.response.data.type,
          error.response.data.message,
          substituiTratamentoDo422,
          executaNoTratamentoDo422,
          checarAlertaRepetido.bind(this),
          tirarAlertaDeErroDaLista.bind(this),
          inserirNovaMensagemAlerta.bind(this),
          error.response.data.messages
        );
      } else if (!respostaValida) {
        conexaoInvalidaHandler(
          errorMessage,
          getMessage("sessao.falhaConexaoServidor.mensagem"),
          checarAlertaRepetido.bind(this),
          tirarAlertaDeErroDaLista.bind(this),
          inserirNovaMensagemAlerta.bind(this)
        );
      } else if (houveTimeout) {
        conexaoInvalidaHandler(
          errorMessage,
          getMessage("comum.timeout.message"),
          checarAlertaRepetido.bind(this),
          tirarAlertaDeErroDaLista.bind(this),
          inserirNovaMensagemAlerta.bind(this)
        );
      }
      return Promise.reject(error);
    }
  );
  return null;
};

RequestHandler.propTypes = {
  intl: intlShape.isRequired,
  executaNoTratamentoDo422: PropTypes.func,
  substituiTratamentoDo422: PropTypes.func
};

export default injectIntl(RequestHandler);
