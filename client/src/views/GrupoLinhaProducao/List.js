import React from "react"
import {Button, List as ListAnt, PageHeader, Popover, Tooltip} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import {
  listGrupoLinhaProducaoRequest,
  deleteRequest,
  ativarOuDesativarRequest,
  grupoLinhaProducaoExportarRequest
} from "../../store/modules/GrupoLinhaProducao/action";
import {RiFileTextLine} from "react-icons/all";

class List extends React.Component {
  state = {
    entidades: [],
    totalCount: 0,
    silenciaLoading: false,
    filterComp: {
      labelCol:{style: {lineHeight:1}},
      margin:{marginTop: '10px'},
      layout: "vertical",
      prefix: "grupoLinhaProducao",
      campos: [
        {nome: "nome", tipo: "text"},
        {nome: "linhas", tipo: "text", label: "linhaDeProducao"},
        {nome: "produtos", tipo: "text"},
        {nome: "status", tipo: "select", ordenar: true, defaultValue: "ATIVO"}
        ],
    },
    dataFiltro: { status: ["TODOS", "ATIVO", "INATIVO"] },
    filtros: {
      nome: "",
      linhas: "",
      produtos: "",
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
          title={<FormattedMessage id={"grupoLinhaProducao.listagem.label"}/>}
          extra={[
            <Tooltip title={this.getMessage("grupoLinhaProducao.exportar.tooltip.label")}>
              <Button
                onClick={this.exportar}
                type="default"
                style={{height: 40}}
                className="page-header-ignored-button">
                <RiFileTextLine size={18} />
              </Button>
            </Tooltip>,
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/cad/grupoLinhaProducao/form")}
            >
              <FormattedMessage id="comum.novoRegistro.label" />
            </Button>
          ]}
        />

        <Filter
          filtros={this.state.filtros}
          filterComp={this.state.filterComp}
          mapPropsToFields={this.mapPropsToFields()}
          handlePesquisar={this.handlePesquisar}
          data={{...this.state.filterComp, ...this.state.dataFiltro}}
        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("grupoLinhaProducao.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      nome: filtros ? filtros.nome : "",
      linhas: filtros ? filtros.linhas : "",
      produtos : filtros ? filtros.produtos : "",
      status: filtros?.status || "ATIVO",
    };
  };

  configTable = () => {
    const { entities, total } = this.props.grupoLinhaProducao.data || {};
    return {
      i18n: "grupoLinhaProducao.tabela.",
      columns: [
        {
          key: "nome",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "nome"
        },
        {
          key: "linhas",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "linhas"
        },
        {
          key: "produtos",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "produtos",
          render: (value) => {
            if(entities) {
              let produtos = "";
              produtos += value.map((item) => item.codigo + (item.roteiro === null ? "" : ` - ${item.roteiro}`));
              produtos = produtos.replaceAll(",", ", ");
              if(produtos.length < 130) {
                return (<div>{produtos}</div>);
              } else {
                return <Popover content={this.contentPopover(value)} trigger={"hover"}>
                  {produtos.slice(0, 130) + ("...")}
                </Popover>
              }
            }
          }
        },
        {
          key: "status",
          isSorteable: false,
          ativarOuDesativar: this.ativarOuDesativar,
          statusLoading: this.props.grupoLinhaProducao.statusLoading
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
    return this.props.intl.formatMessage({ id: id })
  };

  contentPopover = (value) => {
    return (
      <div style={{maxHeight: "50vh", overflow: "scroll"}}>
        <ListAnt
          header={
            <h4 style={{fontWeight: "bold"}}>
              {this.getMessage("grupoLinhaProducao.tabela.produtos.label")}
            </h4>
          }
          dataSource={value}
          renderItem={
            item =>
              <ListAnt.Item>
                {item.codigo} {item.roteiro === null ? "" : `- ${item.roteiro}`}
              </ListAnt.Item>
          }
        />
      </div>
    )
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listGrupoLinhaProducaoRequest(filtros)
  };

  exportar = () => {
    const filtros = this.getFiltros();
    this.props.grupoLinhaProducaoExportarRequest(filtros)
  }

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState( state );
    this.getList()
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
    let url = CLIENT_URL + "/cad/grupoLinhaProducao/form/" + objeto.id;
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
    const {filtros} = this.state;
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
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  grupoLinhaProducao: store.grupoLinhaProducao,
  requestManager: store.requestManager
})

const mapDispatchToProps = dispatch =>
  bindActionCreators( {
    listGrupoLinhaProducaoRequest,
    deleteRequest,
    ativarOuDesativarRequest,
    grupoLinhaProducaoExportarRequest,
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
