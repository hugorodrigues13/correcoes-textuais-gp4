import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { Button, PageHeader} from "antd";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import history from "../../services/history";
import {listRequest} from "../../store/modules/ApontamentoDeMaterial/action";
import {getMessage} from "../../components/messages";

class List extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    silenciaLoading: false,
    filterComp: {
      labelCol:{style: {lineHeight:1}},
      margin:{marginTop: '10px'},
      layout: "vertical",
      prefix: "apontamentoDeMaterial",
      campos: [
        { nome: "ordemDeProducao", tipo: "text" },
        { nome: "codigoProduto", tipo: "text" },
        { nome: "codigoLote", tipo: "text" },
        { nome: "tipo", tipo: "select", defaultValue: "TODOS" },
        { nome: "data", tipo: "rangeDate", colProps: {span: 8} },
        { nome: "usuario", tipo: "usuario" },
      ]
    },
    dataFiltro: { tipo: ["TODOS", "CONSUMO", "RETORNO"] },
    filtros: {
      ordemDeProducao: "",
      codigoProduto: "",
      codigoLote: "",
      data: "",
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

    console.log(this.state)
    const { loading } = this.props.requestManager;
    const data = this.props.apontamentoDeMaterial.data || [];

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="menu.apontamentoDeMaterial.label" />}
          onBack={() => history.push(CLIENT_URL + "/prod/apontamentoDeMaterial")}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/prod/apontamentoDeMaterial")}
            >
              <FormattedMessage id="comum.novoRegistro.label" />
            </Button>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={{...data, ...this.state.filterComp, ...this.state.dataFiltro}}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    );
  }

  componentDidMount() {
    document.title = this.getMessage("menu.apontamentoDeMaterial.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      ordemDeProducao: filtros ? filtros.ordemDeProducao : "",
      codigoProduto: filtros ? filtros.codigoProduto : "",
      codigoLote: filtros ? filtros.codigoLote : "",
      data: filtros ? filtros.data : "",
      tipo: filtros?.tipo || "TODOS",
    };
  };

  configTable = () => {
    const { entities, total } = this.props.apontamentoDeMaterial.data || {};

    return {
      i18n: "apontamentoDeMaterial.tabela.",
      columns: [
        {
          key: "ordemDeProducao",
          isSorteable: true,
        },
        {
          key: "codigoProduto",
          isSorteable: true,
        },
        {
          key: "codigoLote",
          isSorteable: true,
        },
        {
          key: "quantidade",
          isSorteable: true,
        },
        {
          key: "data",
          isSorteable: true,
          defaultSort: true,
          defaultSortOrder: 'descend'
        },
        {
          key: "usuario",
          isSorteable: true,
        },
        {
          key: "tipo",
          isSorteable: true,
          render: (value) => getMessage(`apontamentoDeMaterial.tipo.${value}`)
        },
      ],
      data: entities,
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

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listRequest(filtros);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList();
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
    this.getList();
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
    const { ordemDeProducao, codigoProduto, codigoLote, data, tipo } = this.state.filtros;
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      ordemDeProducao,
      codigoProduto,
      codigoLote,
      data,
      tipo,
      offset,
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
  apontamentoDeMaterial: store.apontamentoDeMaterial,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    listRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));

