import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import { Button, PageHeader, Row} from "antd";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import history from "../../services/history";
import {listPerfilRequest, deleteRequest} from "../../store/modules/Perfil/action";

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
      prefix: "perfil",
      campos: [
        { nome: "nome", tipo: "text" },
        { nome: "descricao", tipo: "text" }
      ]
    },
    filtros: {
      nome: "",
      descricao: "",
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
    const { loading } = this.props.perfil;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="perfil.listagem.label" />}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/seg/perfil/form")}
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
    document.title = this.getMessage("perfil.listagem.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      nome: filtros ? filtros.nome : "",
      descricao: filtros ? filtros.descricao : ""
    };
  };

  configTable = () => {
    const { entities, total } = this.props.perfil.data || {};
    return {
      i18n: "perfil.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome"
        },
        {
          key: "descricao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "descricao"
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
    this.props.listPerfilRequest(filtros);
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
    this.props.deleteRequest(objeto.id, this.getFiltros());
  };

  criaUrlForm = objeto => {
    let url = CLIENT_URL + "/seg/perfil/form/" + objeto.id;
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
    const { descricao, nome } = this.state.filtros;
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      nome,
      descricao,
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
  perfil: store.perfil,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    listPerfilRequest,
    deleteRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
