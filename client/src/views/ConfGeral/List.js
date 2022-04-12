import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Row,PageHeader } from "antd";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import Filter from "../../components/filter/Filter";
import { listConfGeralRequest, updateValorRequest } from "../../store/modules/ConfiguracaoGeral/configGeralAction";
import Modal from "./Modal";
import TabelaAnt from "../../components/tabelaAnt/Tabela";


class List extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    classesAuditadas: [],
    silenciaLoading: false,
    showModal: false,
    valueEdit: null,
    filterComp:{
      labelCol:{style: {lineHeight:1}},
      layout: "vertical",
      margin:{marginTop: '10px'},
      prefix: "confGeral",
      campos: [
        { nome: "descricao", tipo: "text" },
        { nome: "valor", tipo: "text" },
        { nome: "tipoDeDado", tipo: "select", useMessage: false }
      ]
    },
    tipoDeDado: ['STRING', 'BOOLEAN', 'NUMERO'],
    filtros: {
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
    const { data } = this.props.confGeral || {};
    const lista = {
      ...data,
      tipoDeDado: this.state.tipoDeDado
    };
    return (
      <>
        <PageHeader
          title={<FormattedMessage id="confGeral.listagem.label" />}
        />

        <Filter
          filtros={this.state.filtros}
          filterComp={this.state.filterComp}
          data={lista}
          handlePesquisar={this.handlePesquisar}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading} />
        <Modal
          visible={this.state.showModal}
          handleCancel={this.handleHiddenModal}
          entidade={this.state.valueEdit}
          onSave={this.handleSaveValue}
        />
      </>
    );
  }

  componentDidMount() {
    document.title = this.getMessage("confGeral.title.label");
    this.getConfGeral();
  }

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };


  getConfGeral = () => {
    const filtros = this.getFiltros();
    this.props.listConfGeralRequest(filtros);
  };

  handlePesquisar = async values => {
    await this.setState({ filtros: { ...this.state.filtros, ...values } });
    this.getConfGeral();
  };

  configTable = () => {
    const { entities, total } = this.props.confGeral.data || {};
    return {
      i18n: "confGeral.tabela.",
      columns: [
        {key: "tipoDeDado", isSorteable: true},
        {key: "valor", isSorteable: true},
        {key: "descricao", isSorteable: true, defaultSort: true},
      ],
      data: entities,
      acoes: {
        editModal: true,
        editar: this.handleShowModal,
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
    this.getConfGeral();
  };

  redefinePaginacaoPadrao = () => {
    let state = this.state;
    state.filtros.offset = 1;
    this.setState(state);
  };

  getFiltros = () => {
    const { filtros } = this.state;
    const { offset, max } = filtros.paginacao;
    const isRedefinePaginacao = this.state.totalCount < offset - 1;
    const offsetBusca = (offset - 1) * max;
    const { sort, order } = filtros.ordenacao;

    if (isRedefinePaginacao) {
      this.redefinePaginacaoPadrao();
    }

    return { ...filtros, offset: offset, offsetBusca: offsetBusca, max, sort, order };
  };

  handleShowModal = async object => {
    const { id, valor } = object;
    await this.setState({ showModal: true, valueEdit: { id, valor } });
  };

  handleHiddenModal = () => {
    this.setState({ showModal: false });
  };

  handleSaveValue = ( objeto ) =>{
    this.props.updateValorRequest(objeto);
    this.handleHiddenModal()
  }
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  confGeral: store.confGeral,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ listConfGeralRequest, updateValorRequest }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
