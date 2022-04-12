import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux"
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { Button, PageHeader } from "antd";
import history from "../../services/history";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { listPrefixoProducaoFornecedorRequest, updateValorRequest} from "../../store/modules/PrefixoProducaoFornecedor/action";
import Modal from "./Modal";
import Alert from "react-s-alert"

class List extends React.Component {
  state = {
    entity: [],
    totalCount: 0,
    showModal: false,
    valueEdit: null,
    filterComp: {
      labelCol: { style: { lineHeight: 1 } },
      margin: { marginTop: '10px' },
      layout: "vertical",
      prefix: "prefixoProducaoFornecedor",
      campos: [
        { nome: "nome", tipo: "text" },
        { nome: "prefixoProducao", tipo: "text" },
        { nome: "endereco", tipo: "text" },
      ],
    },
    filtros: {
      nome:"",
      prefixoProducao:"",
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
    let { data } = this.props.prefixoProducaoFornecedor || {};
    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"prefixoProducaoFornecedor.title.label"} />}
        />

        <Filter
          filtros={this.state.filtros}
          filterComp={this.state.filterComp}
          data={data}
          handlePesquisar={this.handlePesquisar}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
        <Modal
          visible={this.state.showModal}
          handleCancel={this.handleHiddenModal}
          entidade={this.state.valueEdit}
          onSave={this.handleSaveValue}
        />
      </>
    )
  }

  getoffset = (offset, max) => {
    offset = ( offset ? offset - 1 : offset ) * max;
    return offset;
  };

  componentDidMount() {
    document.title = this.getMessage("prefixoProducaoFornecedor.title.label");
    this.getList();
  }

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id })
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listPrefixoProducaoFornecedorRequest(filtros)
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList();
  };

  configTable = () => {
    const { total, entities } = this.props.prefixoProducaoFornecedor.data || {};
    return {
      i18n: "prefixoProducaoFornecedor.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome",
          width: "35%",
        },
        {
          key: "prefixoProducao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "prefixoProducao",
          width: "20%",
        },
        {
          key: "endereco",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "endereco",
          width: "45%",
        }
      ],
      data: entities,
      acoes: {
        editar: this.criarUrlForm,
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

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state)
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
    };
  };

  handleShowModal = async object => {
    const { id, prefixoProducao, endereco } = object;
    await this.setState({ showModal: true, valueEdit: { id, prefixoProducao, endereco } });
  };

  criarUrlForm = objeto => {
    return CLIENT_URL + "/config/fornecedor/form/" + objeto.id;
  };

  handleHiddenModal = () => {
    this.setState({ showModal: false });
  };

  handleSaveValue = ( objeto ) =>{
      this.props.updateValorRequest(objeto);
      this.handleHiddenModal();
  }
};

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  prefixoProducaoFornecedor: store.prefixoProducaoFornecedor,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ listPrefixoProducaoFornecedorRequest, updateValorRequest }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
