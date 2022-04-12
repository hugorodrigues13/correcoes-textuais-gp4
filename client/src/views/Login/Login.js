import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  exibeModalLogin,
  logout,
  loginRequest
} from "../../store/modules/Login/loginAction";
import { injectIntl } from "react-intl";
import FormLogin from "../../components/login/FormLogin";
import {Container, WrapperLogin} from "./styles";
import {Spin} from "antd";

class Login extends React.Component {
  state = {
    iconeLinguagem: "",
    idioma: "",
    userDetails: {
      username: "",
      password: ""
    },
    error: null
  };

  render() {
    return (
      <Spin spinning={this.props.loading}>
      <Container>
        <WrapperLogin>
          <div className="logLogin">
            <img
              className=""
              alt="logo-gpa"
              src={require("../../images/logo_gp4_0.png")}
            />
          </div>
        <FormLogin
          locale={this.state.idioma}
          organizacoes={this.state.organizacoes}
        />
          </WrapperLogin >
      </Container>
      </Spin>
    );
  }

  componentDidMount() {
    this.getLanguage();
  }

  getLanguage = () => {
    let params = new URLSearchParams(document.location.search.substring(1));
    let locale = params.get("lang");

    let state = this.state;
    state.idioma = locale;
    if (locale === "en-US") {
      state.iconeLinguagem = require("../../images/US.jpg");
    } else if (locale === "es-ES") {
      state.iconeLinguagem = require("../../images/ES.jpg");
    } else {
      state.iconeLinguagem = require("../../images/BR.jpeg");
    }
    this.setState(state);
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };
}

const mapStateToProps = store => ({
  sessao: store.sessaoReducer.sessao,
  messages: store.alertasReducer.messages,
  loading: store.requestManager.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ logout, exibeModalLogin, loginRequest }, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
