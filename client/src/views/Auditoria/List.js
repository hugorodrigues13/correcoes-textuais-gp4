import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {PageHeader, Row, Form, Spin} from "antd";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";

import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import { listAuditoriaRequest } from "../../store/modules/Auditoria/auditoriaAction";
import Loading from "../../components/Spinner";
import history from "../../services/history";
import TabelaAnt from "../../components/tabelaAnt/Tabela";

class List extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    classesAuditadas: [],
    silenciaLoading: false,
    filterComp: {
      labelCol:{style: {lineHeight:1}},
      margin:{marginTop: '10px'},
      layout: "vertical",
      prefix: "auditoria",
      campos: [
        { nome: "username", tipo: "text" },
        { nome: "operacao", tipo: "select", useMessage: false },
        {
          nome: "entidade",
          tipo: "select",
          seletor: "classesAuditadas",
          tratamento: true
        },
        {nome: "propriedade", tipo: "text"},
        {nome: "valorAntigo", tipo: "text"},
        {nome: "valorNovo", tipo: "text"},
        {nome: "entidadeId", tipo: "number"},
        {nome: "periodoCriacao", tipo: "rangeDate"},
        {nome: "periodoAtualizacao", tipo: "rangeDate"},
      ]
    },
    operacao: ["INSERT", "UPDATE", "DELETE"],
    filtros: {
      tipo: "",
      username: "",
      operacao: "INSERT",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "date_Created",
        order: "desc"
      }
    }
  };

  render() {
    const { data } = this.props.auditoria || {};
    const { loading } = this.props.requestManager;
    const lista = {
      ...data,
      operacao: this.state.operacao
    };
    return (
      <>
        <PageHeader
          title={<FormattedMessage id="auditoria.listagem.label" />}
        />
        <Filter
          filtros={this.state.filtros}
          filterComp={this.state.filterComp}
          data={lista}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    );
  }

  componentDidMount() {
    document.title = this.getMessage("auditoria.title.label");
    this.getAuditLogs();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      username: filtros ? filtros.username : "",
      operacao: filtros ? filtros.operacao : "",
      entidade: filtros ? filtros.entidade : ""
    };
  };

  configTable = () => {
    const { entities, total } = this.props.auditoria.data || {};
    return {
      i18n: "auditoria.tabela.",
      columns: [
        { key: "persistedObjectId", isSorteable: false },
        { key: "actor", isSorteable: true },
        { key: "className", isSorteable: true },
        { key: "dateCreated", isSorteable: true, defaultSort: true, defaultSortOrder: 'descend' },
        { key: "eventName", isSorteable: true },
        { key: "lastUpdated", isSorteable: true },
        { key: "persistedObjectVersion", isSorteable: false }
      ],
      data: entities,
      acoes: {
        visualizar: this.handleView
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

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  handleInputChange = event => {
    const target = event.target;
    const valor = target.type === "checkbox" ? target.checked : target.value;
    const nome = target.id;

    let filtros = this.state.filtros;
    if (nome === "dataInicial" || nome === "dataFinal") {
      filtros["filtroPeriodo"][nome] = valor;
    } else {
      filtros[nome] = valor;
    }
    this.setState({ filtros: filtros });
  };

  getAuditLogs = () => {
    const filtros = this.getFiltros();
    this.props.listAuditoriaRequest(filtros);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getAuditLogs();
  };

  alteraSilentLoading = silenciaLoading => {
    let state = this.state;
    state.silenciaLoading = silenciaLoading;
    this.setState(state);
  };

  handleView = id => {
    history.push(`${CLIENT_URL}/audit/auditoria/${id}/show`);
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  criaUrlForm = objeto => {
    let query = "persistedObjectVersion=" + objeto.persistedObjectVersion;
    query += "&persistedObjectId=" + objeto.persistedObjectId;
    query += "&actor=" + objeto.actor;
    query += "&eventName=" + objeto.eventName;
    query += "&className=" + objeto.className;
    query += "&dateCreated=" + objeto.dateCreated;
    query += "&lastUpdated=" + objeto.lastUpdated;
    let url = CLIENT_URL + "/audit/auditoria/form?" + query;
    return url;
  };

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort === "dateCreated" ? "date_created" : sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getAuditLogs();
  };

  redefinePaginacaoPadrao = () => {
    let state = this.state;
    state.filtros.offset = 1;
    this.setState(state);
  };

  getoffset = (offset, max) => {
    offset = ( offset ? offset - 1 : offset ) * max;
    return offset;
  };

  getFiltros = () => {
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    //const offsetBusca = (offset - 1) * max;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;

    return {
      ...filtros,
      offset,
      //offsetBusca,
      max,
      sort,
      order
    };
  };
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  auditoria: store.auditoria,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ listAuditoriaRequest }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
