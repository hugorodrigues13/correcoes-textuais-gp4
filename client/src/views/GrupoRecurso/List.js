import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import {Button, List as ListAnt, PageHeader, Popover, Row} from "antd";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import history from "../../services/history";
import {
  grupoRecursoListRequest,
  grupoRecursoDeletarRequest,
  ativarOuDesativarRequest
} from "../../store/modules/GrupoRecurso/action";

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
      prefix: "gruporecurso",
      campos: [
        { nome: "nome", tipo: "text" },
        { nome: "operacao", tipo: "text" },
        { nome: "recurso", tipo: "text" },
        { nome: "tempoPadrao", tipo: "number" },
        { nome: "tempoMaximoSemApontamento", tipo: "number" },
        {nome: "status", tipo: "select", ordenar: true, defaultValue: "ATIVO"}
      ],
    },
    dataFiltro: { status: ["TODOS", "ATIVO", "INATIVO"] },
    filtros: {
      nome: "",
      operacao: "",
      recurso: "",
      status: "ATIVO",
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

    return (
      <>
        <PageHeader
          title={<FormattedMessage id="gruporecurso.listagem.label" />}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/cad/grupoRecurso/form")}
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
          data={{...this.state.filterComp, ...this.state.dataFiltro}}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    );
  }

  componentDidMount() {
    document.title = this.getMessage("gruporecurso.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      nome: filtros ? filtros.nome : "",
      operacao: filtros ? filtros.operacao : "",
      recurso: filtros ? filtros.recurso : "",
      status: filtros?.status || "ATIVO"
    };
  };

  configTable = () => {
    const { entities, total } = this.props.grupoRecurso.data || {};
    return {
      i18n: "gruporecurso.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome"
        },
        {
          key: "operacao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "operacao"
        },
        {
          key: "recursos",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "recursos",
          render: (value, record) => {
            if(entities) {
              let recursos = "";
              recursos += value.map(item => item.value);
              recursos = recursos.replaceAll(",", ", ");
              if(recursos.length < 130) {
                return (<div>{recursos}</div>);
              } else {
                return <Popover content={this.contentPopover(record)} trigger={"hover"}>
                  {recursos.slice(0, 130) + ("...")}
                </Popover>
              }
            }
          }
        },
        {
          key: "tempoPadrao",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "operacao",
          width: '10%',

        },
        {
          key: "tempoMaximoSemApontamento",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "tempoMaximoSemApontamento",
          width: '10%',
        },
        {
          key: "status",
          isSorteable: false,
          ativarOuDesativar: this.ativarOuDesativar,
          statusLoading: this.props.grupoRecurso.statusLoading
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

  ativarOuDesativar = (object) => {
    this.props.ativarOuDesativarRequest(object,  this.getFiltros())
  }

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  contentPopover = (value) => {
    return (
      <div style={{maxHeight: "50vh", overflow: "scroll"}}>
        <ListAnt
          header={
            <h4 style={{fontWeight: "bold"}}>
              {this.getMessage("gruporecurso.tabela.recursos.label")}
            </h4>
          }
          dataSource={value.recursos}
          renderItem={
            item =>
              <ListAnt.Item>
                {item.value}
              </ListAnt.Item>
          }
        />
      </div>
    )
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.grupoRecursoListRequest(filtros);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList();
  };

  getFiltros = () => {
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      ...this.state.filtros,
      offset,
      max,
      sort,
      order
    };
  };

  getoffset = (offset, max) => {
    offset = ( offset ? offset - 1 : offset ) * max;
    return offset;
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

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  deletar = objeto => {
    this.props.grupoRecursoDeletarRequest(objeto.id, this.getFiltros());
    this.getList();
  };

  criaUrlForm = objeto => {
    let url = CLIENT_URL + "/cad/grupoRecurso/form/" + objeto.id;
    return url;
  };
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  grupoRecurso: store.grupoRecurso,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    grupoRecursoListRequest,
    grupoRecursoDeletarRequest,
    ativarOuDesativarRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List));
