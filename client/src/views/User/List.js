import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import Filter from "../../components/filter/Filter";
import { CLIENT_URL } from "../../config";

import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { Button, PageHeader } from "antd";
import history from "../../services/history";
import {
  getUserAllRequest,
  deleteUserRequest,
  ativarOuDesativarRequest
} from "../../store/modules/User/action";

var validationState = 0;
class List extends React.Component {
  state = {
    usuarios: [],
    totalCount: "",
    silenciaLoading: false,
    usuario: {},
    filterComp: {
      labelCol:{style: {lineHeight:1}},
      margin:{marginTop: '10px'},
      layout: "vertical",
      prefix: "usuario",
      campos: [
        { nome: "fullname", tipo: "text" },
        { nome: "username", tipo: "text" },
        { nome: "matricula", tipo: "text" },
        { nome: "perfil", tipo: "text" },
        { nome: "acesso", tipo: "text" },
        { nome: "status", tipo: "select", ordenar: true, defaultValue: "ATIVO" }
      ]
    },
    dataFiltro: { status: ["TODOS", "ATIVO", "INATIVO"] },
    filtros: {
      username: "",
      fullname: "",
      perfil: "",
      acesso: "",
      status: "ATIVO",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "username",
        order: "asc"
      }
    }
  };

  render() {
    const { loading } = this.props.users;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="usuario.listagem.label" />}
          extra={[
            <Button key="1" type="primary" onClick={this.novo}>
              <FormattedMessage id="comum.novoRegistro.label" />
            </Button>
          ]}
        />
        <Filter
          filtros={this.state.filtros}
          filterComp={this.state.filterComp}
          data={this.state.dataFiltro}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
        />

        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    );
  }

  async componentDidMount() {
    if (validationState !== 0) {
      await this.setSearchable();
    }

    document.title = this.getMessage("usuario.listagem.label");
    await this.getUsuarios();
  }

  novo = () => {
    history.push(CLIENT_URL + "/seg/user/form");
    this.setFlagSaveStateURL();
  };

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      fullname: filtros ? filtros.fullname : "",
      perfil: filtros ? filtros.perfil : "",
      matricula: filtros ? filtros.matricula : "",
      acesso: filtros ? filtros.acesso : "",
      status: filtros ? filtros.status : "",
      username:filtros ? filtros.username : ""
    };
  };

  setSearchable = async () => {
    if (this.props.location.state)
      await this.setState({ filtros: { ...this.props.location.state } });
  };

  configTable = () => {
    const { entities, total } = this.props.users.data || {};
    const lista = (entities || []).map(item => ({
      ...item,
      status: item.enabled ? "ATIVO" : "INATIVO"
    }));
    return {
      i18n: "usuario.tabela.",
      columns: [
        { key: "fullname", isSearchable: false, isSorteable: true },
        { key: "username", isSearchable: false, isSorteable: true, defaultSort: true},
        { key: "email", isSearchable: false, isSorteable: true },
        { key: "matricula", isSearchable: false, isSorteable: true },
        { key: "perfil", isSearchable: false, isSorteable: false },
        { key: "status", isSearchable: false, isSorteable: false, ativarOuDesativar: this.ativarOuDesativar, statusLoading: this.props.users.statusLoading }
      ],
      data: lista,
      acoes: {
        editar: this.criaUrlForm,
        excluir: this.deletar,
        infoAudit: true,
        width: '20%'
      },
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      }
    };
  };

  getUsuarios = () => {
    const { pathname } = this.props.location;
    const filtros = this.getFiltros();
    this.props.history.replace({ pathname, state: { ...filtros } });
    this.props.getUserAllRequest(filtros);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    await this.getUsuarios();
  };

  getoffset = (offset, max) => {
    offset = ( offset ? offset - 1 : offset ) * max;
    return offset;
  };

  getFiltros = () => {
    const { filtros } = this.state;
    let { offset, max } = this.state.filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = this.state.filtros.ordenacao;

    return {
      ...filtros,
      offset,
      max,
      sort,
      order
    };
  };

  criaUrlForm = objeto => {
    let url = CLIENT_URL + "/seg/user/form/" + objeto.id;
    this.setFlagSaveStateURL();
    return url;
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  ativarOuDesativar = objeto => {
    this.props.ativarOuDesativarRequest(objeto, this.getFiltros())
  };

  setFlagSaveStateURL = () => {
    validationState++;
  };

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getUsuarios();
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  deletar = objeto => {
    this.props.deleteUserRequest(objeto.id, this.getFiltros());
  };
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  users: store.users,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getUserAllRequest, deleteUserRequest, ativarOuDesativarRequest }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
