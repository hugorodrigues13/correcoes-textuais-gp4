import { Modal } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import React, { Component } from "react";
import FormLogin from "./login/FormLogin";
class ModalSessaoExpirada extends Component {
  state = {
    mostrarFormLogin: false
  };

  render() {
    if (this.state.mostrarFormLogin === false) {
      return (
        <Modal show={true}>
          <Modal.Header>
            <Modal.Title>
              <FormattedMessage id={"sessao.sessaoExpirada.titulo"} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <FormattedMessage id={"sessao.sessaoExpirada.mensagem"} />
            </p>
            <p>
              <FormattedMessage
                id={"sessao.sessaoExpirada.instrucao.mensagem"}
              />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <FormLogin locale={this.getLanguage()} isModal={true} />
          </Modal.Footer>
        </Modal>
      );
    }
  }

  getLanguage = () => {
    const params = new URLSearchParams(document.location.search.substring(1));
    const locale = params.get("lang");

    const state = {};
    state.idioma = locale;
    if (locale === "en-US") {
      state.iconeLinguagem = require("../images/US.jpg");
    } else if (locale === "es-ES") {
      state.iconeLinguagem = require("../images/ES.jpg");
    } else {
      state.iconeLinguagem = require("../images/BR.jpeg");
    }
    return state;
  };
}

export default ModalSessaoExpirada;
