import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form, PageHeader, Row} from "antd";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";

import {CLIENT_URL} from "../../config";
import Filter from "../../components/filter/Filter";
import {listLogOperacaoRequest} from "../../store/modules/LogOperacao/logOperacaoAction";
import Loading from "../../components/Spinner";
import history from "../../services/history";
import TabelaAnt from "../../components/tabelaAnt/Tabela";

class LogOperacao extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    classesAuditadas: [],
    silenciaLoading: false,
    filterComp: {
      labelCol:{style: {lineHeight:1}},
      layout: "vertical",
      margin:{marginTop: '10px'},
      prefix: "logOperacao",
      campos: [
        { nome: "usuario", tipo: "text" },
        { nome: "tipoLogOperacao", tipo: "select", seletor: "tipos" },
        { nome: "rangeDate", tipo: "rangeDate" },
        { nome: "valor", tipo: "text" },
        { nome: "tipoParametro", tipo: "select", seletor: "tiposParametro", useMessage: false, renderLabel: (tipo) => this.getMessage(`logOperacao.parametroLogOperacao.${tipo}.label`)},
      ]
    },
    filtros: {
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "data",
        order: "desc"
      }
    }
  };

  render() {
    const { data } = this.props.logOperacao || {};
    const { loading } = this.props.requestManager;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="logOperacao.listagem.label" />}
        />

        <Filter
          filtros={this.state.filtros}
          filterComp={this.state.filterComp}
          data={data}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields}
        />

        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    );
  }

  componentDidMount() {
    document.title = this.getMessage("logOperacao.title.label");
    this.getLogOperacoes();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      usuario: filtros ? filtros.usuario : "",
      tipoLogOperacao: filtros ? filtros.tipoLogOperacao : "",
      rangeDate: filtros ? filtros.rangeDate : "",
      date: filtros ? filtros.date : ""
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

  getLogOperacoes = () => {
    const filtros = this.getFiltros();
    this.props.listLogOperacaoRequest(filtros);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getLogOperacoes();
  };

  configTable = () => {
    const { entities, total } = this.props.logOperacao.data || {};
    const lista = (entities || []).map(item => ({
      ...item,
      tipoLogOperacao: this.getMessage(item.tipoLogOperacao)
    }));
    return {
      i18n: "logOperacao.tabela.",
      columns: [
        { key: "data", isSorteable: true, isDate: true, defaultSort: true },
        { key: "tipoLogOperacao", isSorteable: true },
        { key: "usuario", isSorteable: true}
      ],
      data: lista,
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

  handleView = id => {
    history.push(`${CLIENT_URL}/audit/logOperacao/${id}/show`);
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getLogOperacoes();
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
    const isRedefinePaginacao = this.state.totalCount < offset - 1;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;

    if (isRedefinePaginacao) {
      this.redefinePaginacaoPadrao();
    }

    return {
      ...filtros,
      offset,
      max,
      sort,
      order
    };
  };
}

LogOperacao.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  logOperacao: store.logOperacao,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ listLogOperacaoRequest }, dispatch);

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(LogOperacao)
);
