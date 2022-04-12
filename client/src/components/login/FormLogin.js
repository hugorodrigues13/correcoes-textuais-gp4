import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import {FormattedMessage, injectIntl} from "react-intl";
import {Col, Form, Row, Button, Divider} from 'antd';
import AlertDismissable from "../AlertDismissable";
import RecuperarSenha from "./RecuperarSenha";
import {
  logout,
  exibeModalLogin,
  loginRequest
} from "../../store/modules/Login/loginAction";

import {InputAnt} from "../form/Input";
import {DropdownIdioma} from "../Dropdown/Idioma";

class FormLogin extends PureComponent {
  formRef = React.createRef();

  static propTypes = {
    isModal: PropTypes.bool
  };

  static defaultProps = {
    isModal: false
  };

  state = {
    isExibirRecuperarSenha: false,
    useToken: true
  };

  render() {
    const {
      isExibirRecuperarSenha,
      useToken
    } = this.state;
    return (
      <>
        <Form name="control-ref"  ref={this.formRef} onFinish={this.finish}>
          {
            useToken ?
              <Row gutter={24}>
                <Col md={24}>
                  <InputAnt type="password" onPressEnter={this.login} placeholder={this.getMessage("login.token.label")} nomeAtributo={"token"}/>
                </Col>
              </Row>
              :
              <>
                <Row gutter={24}>
                  <Col md={24}>
                    <InputAnt onPressEnter={this.login} placeholder={this.getMessage("login.nomeDeUsuario.label")} nomeAtributo={"username"}/>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col md={24}>
                    <InputAnt onPressEnter={this.login} type={"password"} placeholder={this.getMessage("login.senha.label")}
                              nomeAtributo={"password"}/>
                  </Col>
                </Row></>

          }

          <Row gutter={24}>
            <Col span={10}>
              <DropdownIdioma/>
            </Col>

            <Col span={14}>
              <Button style={{width: "100%", height: 40, borderRadius: 5}} htmlType={"button"} type={"primary"} onClick={this.login}>
                <FormattedMessage id="login.entrar.label"/>
              </Button>
            </Col>
          </Row>
          <Divider><FormattedMessage id={"login.ou.label"}/></Divider>
          <Row gutter={24}>
            {
              !useToken ?
                <Col span={10}>
                  <Button style={{width: "100%", height: 40, borderRadius: 5}} type={"link"}
                          onClick={this.exibirModalRecuperarSenha}>
                    <FormattedMessage id="login.recuperarSenha.label"/>
                  </Button>
                </Col>
                :
                null
            }
            <Col span={useToken ? 24 : 14}>
              <Button style={{width: "100%", height: 40, borderRadius: 5}} type={"secundary"} onClick={() => {
                this.setState({useToken: !this.state.useToken})
              }}>
                <FormattedMessage id={!useToken ? "login.acesar.token.label" : "login.acesar.usuarioSenha.label"}/>
              </Button>
            </Col>
          </Row>

        </Form>

        <Col md={4} mdOffset={4} className="">
          {this.error ? (
            <AlertDismissable bsStyle="danger" message={this.error}/>
          ) : null}
        </Col>
        <RecuperarSenha
          show={isExibirRecuperarSenha}
          onHide={this.fecharModalRecuperarSenha}
          locale={this.props.locale}
        />
      </>
    );
  }

  fecharModalRecuperarSenha = () => {
    this.setState({isExibirRecuperarSenha: false});
  };

  exibirModalRecuperarSenha = () => {
    this.setState({isExibirRecuperarSenha: true});
  };

  getMessage = id => {
    return this.props.intl.formatMessage({id: id});
  };

  login = e => {
    e.preventDefault();
    this.formRef.current.submit();
  };

  finish = values => {
    const {username, password, token} = values;

    const {loginRequest} = this.props;

    loginRequest({username, password, token: this.state.useToken ? token : null});
  }
}

const mapStateToProps = store => ({
  sessao: store.sessaoReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({logout, exibeModalLogin, loginRequest}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FormLogin)
);
