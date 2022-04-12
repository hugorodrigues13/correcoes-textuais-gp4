import React from "react";
import AlertDismissable from "../../components/AlertDismissable";
import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Row
} from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import RecuperarSenha from "../../components/login/RecuperarSenha";

class LoginModal extends React.Component {
  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };
  render() {
    return (
      <Row>
        <Row className="formulario-login">
          <Col sm={8} smOffset={2} md={8} mdOffset={2} lg={8} lgOffset={2}>
            <Form onSubmit={this.props.onSubmit}>
              <Col md={0} mdOffset={0}>
                <FormGroup>
                  <ControlLabel className="label-login" />
                  <FormControl
                    className="input-rv tamanho-min-login"
                    type="text"
                    name="username"
                    placeholder={this.getMessage("login.nomeDeUsuario.label")}
                    value={this.props.userDetails.username}
                    onChange={this.props.inputChangeHandler}
                  />
                  <FormControl
                    className="input-rv tamanho-min-login"
                    type="password"
                    name="password"
                    placeholder={this.getMessage("login.senha.label")}
                    value={this.props.userDetails.password}
                    onChange={this.props.inputChangeHandler}
                  />
                  <ControlLabel
                    className="label-esqueci-a-senha"
                    onClick={this.props.handleShow}
                  >
                    <FormattedMessage id="login.recuperarSenha.label"></FormattedMessage>
                  </ControlLabel>
                </FormGroup>
                <br />
                <FormGroup className="alinhamento-bt-login">
                  <Button
                    className="secundario tamanho-min-login"
                    bsStyle={"link"}
                    type="submit"
                  >
                    <FormattedMessage id="login.entrar.label" />
                  </Button>
                </FormGroup>
              </Col>
            </Form>
          </Col>
          <Col
            md={6}
            mdOffset={3}
            lg={8}
            lgOffset={2}
            className="alinhamento-botao-formulario"
          >
            {this.props.error ? (
              <AlertDismissable bsStyle="danger" message={this.props.error} />
            ) : null}
          </Col>
        </Row>
        <RecuperarSenha show={this.props.show} onHide={this.props.onHide} />
      </Row>
    );
  }
}

export default injectIntl(LoginModal);
