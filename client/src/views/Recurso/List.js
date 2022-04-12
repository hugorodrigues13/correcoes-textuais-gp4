import React from "react";
import { bindActionCreators } from "redux";
import {connect } from "react-redux"
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import {Button, PageHeader} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {listRecursoRequest, deleteRequest, ativarOuDesativarRequest} from "../../store/modules/Recurso/action";

class List extends React.Component {
  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "recurso",
      campos: [
        { nome: "nome", tipo: "text" },
        { nome: "metaOEE", tipo: "text" },
        { nome: "codigoOracle", tipo: "text" },
        { nome: "conector", tipo: "selectFilter", seletor: "listConectores", useMessage: false },
        {nome: "status", tipo: "select", ordenar: true, defaultValue: "ATIVO"}
      ],
    },
    dataFiltro: { status: ["TODOS", "ATIVO", "INATIVO"] },
    filtros: {
      nome: "",
      metaOEE: "",
      codigoOracle: "",
      conector: "",
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
    const data = this.props.recurso.data || [];

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"recurso.listagem.label"} />}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/cad/recurso/form")}
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
          data={{...data, ...this.state.filterComp, ...this.state.dataFiltro}}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("recurso.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      nome: filtros ? filtros.nome : "",
      descricao: filtros ? filtros.descricao : "",
      status: filtros?.status || "ATIVO"
    }
  };

  configTable = () => {
    const { entities, total } = this.props.recurso.data || {};
    let dados = entities?.map((item) => {
      return {
        id: item.id,
        nome: item.nome,
        metaOEE: item.metaOEE,
        codigoOracle: item.codigoOracle,
        isAtivo: item.isAtivo,
        conectores: item.conectores ? item.conectores.map((conector, index) => item.conectores.length - 1 !== index? `${conector.label}, ` : `${conector.label}`) : ""
      }
    });
    return {
      i18n: "recurso.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome"
        },
        {
          key: "metaOEE",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "metaOEE"
        },
        {
          key: "codigoOracle",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "codigoOracle"
        },
        {
          key: "conectores"
        },
        {
          key: "status",
          isSorteable: false,
          ativarOuDesativar: this.ativarOuDesativar,
          statusLoading: this.props.recurso.statusLoading
        }
      ],
      data: dados,
      acoes: {
        editar: this.criarUrlForm,
        excluir: this.deletar,
        clonar: this.criarUrlClonarForm
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

  ativarOuDesativar = (object) => {
    this.props.ativarOuDesativarRequest(object,  this.getFiltros())
  }

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id })
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listRecursoRequest(filtros)
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList();
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state  = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state)
  };

  deletar = objeto => {
    this.props.deleteRequest(objeto.id, this.getFiltros());
  };

  criarUrlForm = objeto => {
    return CLIENT_URL + "/cad/recurso/form/" + objeto.id;
  };

  criarUrlClonarForm = objeto => {
    return CLIENT_URL + "/cad/recurso/form/" + objeto.id + "?clonar=true";
  };

  paginacao = ( offs, sort, order ) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getList()
  }

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset ) * max;
    return offset
  }

  getFiltros = () => {
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order} = filtros.ordenacao;
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
  recurso: store.recurso,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators( { listRecursoRequest, deleteRequest, ativarOuDesativarRequest }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
