import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faKey,
  faChevronDown,
  faChevronUp,
  faTrash,
  faEdit,
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

import Layout from "./Layout";
import Login from "./Login/Login";
import Loading from "../components/Spinner";
import {
  exibeModalLogin,
  logout,
  setSessaoSate
} from "../store/modules/Login/loginAction";

library.add(
  faEnvelope,
  faKey,
  faChevronDown,
  faChevronUp,
  faTrash,
  faEdit,
  faCheckCircle,
  faTimesCircle
);

class Root extends Component {
  state = {
    sessionExpired: false,
    serverInfo: {},
    route: "",
    error: null
  };

  render() {
    const { user } = this.props;
    const { loading } = user;
    return (
      <div>
        <div>{this.contentForRoute()}</div>
        <Loading isSendingRequest={loading} />
        <Alert stack={{ limit: 3 }} />
      </div>
    );
  }

  reset = () => {
    const { logout } = this.props;
    logout();
    this.setState({
      userDetails: {
        username: "",
        password: ""
      },
      route: "login",
      error: null,
      sessionExpired: false
    });
  };

  contentForRoute() {
    return (
      <React.Fragment>
        {this.isLogado() && <Layout isSelecionarRecurso={this.isSelecionarRecurso()} />}
        {!this.isLogado() && <Login />}
      </React.Fragment>
    );
  }

  isLogado() {
    return !!this.props.user.data;
  }

  isSelecionarRecurso() {
    const { isSelecionarRecurso, recursoSelecionado } = (this.props.user.data || {});
    return isSelecionarRecurso && !recursoSelecionado
  }
}

const mapStateToProps = store => ({
  sessao: store.sessaoReducer.sessao,
  user: store.sessaoReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ logout, exibeModalLogin, setSessaoSate }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
