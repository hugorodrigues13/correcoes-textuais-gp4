import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux"
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { Button, PageHeader } from "antd";
import history from "../../services/history";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { listImpressoraRequest, deleteRequest } from "../../store/modules/Impressora/action";

class List extends React.Component {
  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: { style: { lineHeight: 1 } },
      margin: { marginTop: '10px' },
      layout: "vertical",
      prefix: "impressora",
      campos: [
        { nome: "nome", tipo: "text" },
        { nome: "apelido", tipo: "text" },
        { nome: "tipoImpressao", tipo: "select", useMessage: true },
      ],
    },
    filtros: {
      nome: "",
      apelido: "",
      tipoImpressao: "",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "nome",
        order: "asc"
      }
    }
  };

  render() {
    const { loading } = this.props.requestManager;
    const { data } = this.props.impressora;
    const lista = {
      ...data,
      tipoImpressao: data.tiposImpressao
    };
    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"impressora.listagem.label"} />}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/config/impressora/form")}
            >
              <FormattedMessage id={"comum.novoRegistro.label"} />
            </Button>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={lista}

        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    )
  }


  componentDidMount() {
    document.title = this.getMessage("impressora.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      nome: filtros ? filtros.nome : "",
    }
  };

  configTable = () => {
    const { entities, total } = this.props.impressora.data || {};
    return {
      i18n: "impressora.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome"
        },
        {
          key: "apelido",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "apelido"
        },
        {
          key: "tipoImpressao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "tipoImpressao",
          render: (value) => {
            return value ? this.getMessage(value) : null
          }
        },
      ],
      data: entities,
      acoes: {
        editar: this.criarUrlForm,
        excluir: this.deletar
      },
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      }
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id })
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listImpressoraRequest(filtros)
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
    this.setState(state)
  };

  deletar = objeto => {
    this.props.deleteRequest(objeto.id, this.getFiltros());
  };

  criarUrlForm = objeto => {
    return CLIENT_URL + "/config/impressora/form/" + objeto.id;
  };

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getList()
  }

  redefinePaginacaoPadrao = () => {
    let state = this.state;
    state.filtros.offset = 1;
    this.setState(state);
  };

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset
  }

  getFiltros = () => {
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      ...filtros,
      offset,
      max,
      sort,
      order
    }
  }
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  impressora: store.impressora,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ listImpressoraRequest, deleteRequest }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
