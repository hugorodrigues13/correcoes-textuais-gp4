import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { Button, PageHeader} from "antd";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import history from "../../services/history";

import { listConectorRequest, conectorDeletarRequest } from "../../store/modules/Conector/action";

class List extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    silenciaLoading: false,
    filterComp: {
      labelCol:{style: {lineHeight:1}},
      margin:{marginTop: '10px'},
      layout: "vertical",
      prefix: "conector",
      campos: [
        { nome: "descricao", tipo: "text" },
        { nome: "linhaForecast", tipo: "text" },
        { nome: "formacao", tipo: "number", min: 1 },
      ]
    },
    filtros: {
      descricao: "",
      linhaForecast: "",
      formacao: "",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "descricao",
        order: "asc"
      }
    }
  };

  render() {
    const { loading } = this.props.requestManager;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="conector.listagem.label" />}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/config/conector/form")}
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
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    );
  }

  componentDidMount() {
    document.title = this.getMessage("conector.listagem.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      linhaForecast: filtros ? filtros.linhaForecast : "",
      descricao: filtros ? filtros.descricao : "",
      formacao: filtros ? filtros.formacao : ""
    };
  };

  configTable = () => {
    const { entities, total } = this.props.conector.data || {};

    return {
      i18n: "conector.tabela.",
      columns: [
        {
          key: "descricao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "descricao"
        },
        {
          key: "linhaForecast",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "linhaForecast"
        },
        {
          key: "formacao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "formacao"
        }
      ],
      data: entities,
      acoes: {
        editar: this.criaUrlForm,
        excluir: this.deletar
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

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listConectorRequest(filtros);
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

  deletar = objeto => {
    this.props.conectorDeletarRequest(objeto.id, this.getFiltros());
  };

  criaUrlForm = objeto => {
    let url = CLIENT_URL + "/config/conector/form/" + objeto.id;
    return url;
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
    const { descricao, linhaForecast, formacao } = this.state.filtros;
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      descricao,
      linhaForecast,
      formacao,
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
  conector: store.conector,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    listConectorRequest,
    conectorDeletarRequest
    //listPerfilRequest,
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));

