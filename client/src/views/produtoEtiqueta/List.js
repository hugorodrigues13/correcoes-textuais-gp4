import React from 'react'
import { bindActionCreators } from "redux";
import {connect } from "react-redux"
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {Row, Tooltip, Button, List as ListAnt, PageHeader, Popover, Switch} from "antd";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {listProdutoEtiquetaRequest, deleteRequest} from "../../store/modules/produtoEtiqueta/action";
import { gerarRelatorioEtiquetaRequest } from "../../store/modules/produtoEtiqueta/action";
import { RiFileTextLine } from "react-icons/all";

class List extends React.Component {
  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "produtoEtiqueta",
      campos: [
        {nome: "codigoProduto", tipo: "text"},
        {nome: "quantidadeDeEtiquetas", tipo: "text"},
        {nome: "quantidadePorImpressao", tipo: "text"},
        {nome: "etiqueta", tipo: "text"},
        {nome: "grupo", tipo: "select", seletor: "listGrupoRecurso", tratamento:true, useMessage: false},
        {nome: "serial", tipo: "select", defaultValue: "TODOS"}
      ]
    },
    dataFiltro: { serial: ["SIM", "NAO", "TODOS"] },
    filtros: {
      codigoProduto: "",
      quantidadeDeEtiquetas: "",
      quantidadePorImpressao: "",
      etiqueta: "",
      grupo: "",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "codigoProduto",
        order: "asc"
      }
    }
  };

  render() {
    const {loading} = this.props.requestManager;
    const {data} = this.props.produtoEtiqueta;

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"produtoEtiqueta.listagem.label"}/>}
          extra={[<Row>
            <Tooltip title={this.getMessage("produtoEtiqueta.exportar.tooltip.label")}>
              <Button
                size="large"
                style={{marginRight: "10px"}}
                onClick={this.exportarEtiquetas}
                type="default"
                className="page-header-ignored-button">
                <RiFileTextLine fontSize="1.5em" />
              </Button>
            </Tooltip>
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/config/produtoEtiqueta/form")}
            >
              <FormattedMessage id={"comum.novoRegistro.label"}/>
            </Button></Row>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={({...data, ...this.state.dataFiltro} || [])}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("produtoEtiqueta.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const {filtros} = this.state;
    return {
      codigoProduto: filtros ? filtros.codigoProduto : "",
      quantidadeDeEtiquetas: filtros ? filtros.quantidadeDeEtiquetas : "",
      quantidadePorImpressao: filtros ? filtros.quantidadePorImpressao : "",
      etiqueta: filtros ? filtros.etiqueta : "",
      grupo: filtros ? filtros.grupo : ""
    }
  };

  configTable = () => {
    const {entities, total} = this.props.produtoEtiqueta.data || {};

    return {
      i18n: "produtoEtiqueta.tabela.",
      columns: [
        {
          key: "codigoProduto",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "codigoProduto"
        }, {
          key: "etiquetas",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "etiqueta"
        },{
          key: "quantidadeDeEtiquetas",
        },
        {
          key: "quantidadePorImpressao",
        },
        {
          key: "serial",
          render: (value) => this.getMessage(`comum.${value ? 'sim' : 'nao'}.label`)
        },
        {
          key: "grupo",
          render: (value) => {
            if (entities) {
              let grupoRecursos = "";
              grupoRecursos += value.map((item) => item.nome);
              grupoRecursos = grupoRecursos.replaceAll(",", ", ");
              if (grupoRecursos.length < 130) {
                return (<div>{grupoRecursos}</div>);
              } else {
                return <Popover content={this.contentPopover(value)} trigger={"hover"}>
                  {grupoRecursos.slice(0, 130) + ("...")}
                </Popover>
              }

            }
          }
        }
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

  contentPopover = (value) => {
    return (
      <div style={{maxHeight: "50vh", overflow: "scroll"}}>
        <ListAnt
          header={
            <h4 style={{fontWeight: "bold"}}>
              {this.getMessage("produtoEtiqueta.tabela.grupo.label")}
            </h4>
          }
          dataSource={value}
          renderItem={
            item =>
              <ListAnt.Item>
                {item.nome}
              </ListAnt.Item>
          }
        />
      </div>
    )
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.listProdutoEtiquetaRequest(filtros)
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState( state );
    this.getList()
  }

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state  = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state)
  };

  deletar = objeto => {
    this.props.deleteRequest(objeto.id, this.getFiltros());
  };

   criarUrlForm = objeto =>  {
     return CLIENT_URL + "/config/produtoEtiqueta/form/" + objeto.id
   };

  paginacao = ( offs, sort, order ) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getList()
  };

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset ) * max;
    return offset
  };

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

  exportarEtiquetas = () => {
    this.props.gerarRelatorioEtiquetaRequest(this.getFiltros())
  }
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  produtoEtiqueta: store.produtoEtiqueta,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators( {listProdutoEtiquetaRequest, deleteRequest, gerarRelatorioEtiquetaRequest}, dispatch );

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(List))
