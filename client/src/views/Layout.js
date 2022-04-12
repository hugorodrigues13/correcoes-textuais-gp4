import React, { Fragment } from "react";
import { bindActionCreators } from "redux";
import {connect} from "react-redux";
import { injectIntl, intlShape } from "react-intl";
import {Link, Router} from "react-router-dom";
import {CLIENT_URL, CLIENT_VERSION} from "../config";
import Spinner from "../components/Spinner";
import ErrorRender from "./errors/ErrorRender";
import Routes from "./Routes";
import history from "../services/history";
import {Col, Layout} from "antd";

import { logout } from "../store/modules/Login/loginAction";
import {Header} from "antd/es/layout/layout";
import theme1 from "../themes/theme1";
import styled from "styled-components";
import {listRequest, setOrganizacao} from "../store/modules/Organizacao/action";
import MenuPrincipal from "../components/Menu";
import * as moment from "moment";
import {menuItemRequest} from "../store/modules/MenuItem/action";

const ano = moment().format("YYYY")
const telasAsaichi = ["/", "/gp4", "/gp4/"]
const telasLarguraTotal = ["prog/sequenciamento", "prod/serial", "prod/apontamento", "prod/ordemFabricacao", "prog/acompanhamentoOrdemProducao", "cad/linhaDeProducao/form", "prod/faturamento", "prog/recebimento", "prog/recebimento?erro=COM_ERRO"]
const telasSemHeaderFooter = ["prod/apontamento"]
const telasLarguraNormal = ["prod/apontamentoDeMaterial", "prod/apontamentosPendentes"]
class HeaderSider extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  state = {
    render: 1,
    switchRequisicaoSilenciosa: false,
    isCarregandoComponente: false,
    isSendingRequest: false,
    messageSpinner: null,
    usernameSearch: "",
    fullNameSearch: "",
    statusSearch: "",
    current: 'cad:user',
    selectedModule: '',
    usuario: {
      id: "",
      password: "",
      confirmePassword: "",
      fullname: "",
      email: "",
      perfis: [],
      loggedIn: false
    },
    errors: [],
    showModalUser: false,
    usernameUsuario: "",
    tituloPagina: "GP4.0",
    hasError: false,
    iconeLinguagem: "",
    idioma: "",
  };

  render() {
    const { Header, Content } = Layout;
    const isAsaichi = telasAsaichi.some(item => location.pathname === item);
    const isLarguraMaxima = this.props.menuItem.item && !(telasLarguraNormal.some(item => this.props.menuItem.item.includes(item))) && (telasLarguraTotal.some(item => this.props.menuItem.item.includes(item)))
    const isTelaSemHeaderFooter = this.props.menuItem.item && !(telasLarguraNormal.some(item => this.props.menuItem.item.includes(item))) && (telasSemHeaderFooter.some(item => this.props.menuItem.item?.includes(item)))
    if (this.state.hasError === true) {
      return <ErrorRender />;
    } else {
      return (
        <Router history={history}>
          <Fragment>
            <Layout>
              <Header className={`clearfix ${isTelaSemHeaderFooter && "semHeader"}`} id="header">
              <div>
                <Link to={CLIENT_URL} onClick={() => {
                  this.setState({render: this.state.render + 1})
                  this.props.menuItemRequest('')
                }}>
                  <div className="logo">
                    <img style={{ width: 160 }} src={require("../images/logo_home_gp4_0.png")} alt="Logo" />
                  </div>
                </Link>
              </div>
              <MenuPrincipal />
              </Header>
            </Layout>
            <Layout>
                <Content className={`${isTelaSemHeaderFooter ? 'conteudo-sem-hf' : 'conteudo'} conteudoTotal`} style={{ background: "#fff"}}>
                <div className={`container ${isLarguraMaxima ? "largura-maxima" : ""} ${isAsaichi ? 'asaichi' : ''}`}>
                  <br/>
                  <Routes />
                  <Spinner
                    isSendingRequest={this.state.isSendingRequest}
                    message={this.state.messageSpinner}
                  />
                </div>
              </Content>
                <Col className={`footer ${isTelaSemHeaderFooter && "semHeader"}`} span={24}>
                   <span className={"small"}>
                     Furukawa Electric - {ano}. Todos os direitos reservados
                   </span>
                  <span className={"small"} style={{float: "right"}}>
                    v {CLIENT_VERSION}
                  </span>
                </Col>
            </Layout>
          </Fragment>
        </Router>
      );
    }
  }

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  componentDidMount() {
    window.less.modifyVars({ "@primary-color": theme1.primaryColor });
    window.less.refreshStyles();
    if (!this.state.isCarregandoComponente) {
      let state = this.state;
      state.isCarregandoComponente = true;
      // state.isSelecionarRecurso = this.props.isSelecionarRecurso;
      this.setState(state);
    }

    this.props.listRequest()
  }
}

HeaderSider.propTypes = {
  intl: intlShape.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators({ logout, listRequest, setOrganizacao, menuItemRequest }, dispatch);

const mapStateToprops = store => ({
  idioma: store.sessaoReducer.language,
  organizacoes: store.organizacao.data.list || [],
  organizacao: store.organizacao.data.organizacao || "",
  menuItem: store.menuItem
});

export default injectIntl(
  connect(
    mapStateToprops,
    mapDispatchToProps,
  )(HeaderSider)
);

const ImgIdioma = styled.img`
  object-fit: cover;
  width: 40px;
  height: 35px;
  border: 4px solid white;

`;
