import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux"
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import {Button, List as ListAnt, PageHeader, Popover} from "antd";
import history from "../../services/history";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { listClassePorPlanejadorRequest, deleteRequest } from "../../store/modules/ClassePorPlanejador/action";

class List extends React.Component {
  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: { style: { lineHeight: 1 } },
      margin: { marginTop: '10px' },
      layout: "vertical",
      prefix: "classePorPlanejador",
      campos: [
        { nome: "classeContabil", tipo: "text" },
        { nome: "planejador", tipo: "text" },
      ],
    },
    filtros: {
      nome: "",
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "classeContabil",
        order: "asc"
      }
    }
  };

  render() {
    const { loading } = this.props.requestManager;
    const data = this.props.classePorPlanejador;
    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"classePorPlanejador.listagem.label"} />}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/config/ClassePorPlanejador/form")}
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
          data={data || []}

        />
        <br />
        <TabelaAnt configTable={this.configTable()} loading={loading} />
      </>
    )
  }


  componentDidMount() {
    document.title = this.getMessage("classePorPlanejador.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      classeContabil: filtros ? filtros.classeContabil : "",
    }
  };

  configTable = () => {
    const { entities, total } = this.props.classePorPlanejador.data || {};

    return {
      i18n: "classePorPlanejador.tabela.",
      columns: [
        {
          key: "classeContabil",
          isSorteable: true,
          defaultSort: this.state.filtros.ordenacao.sort === "classeContabil"
        },
        {
          key: "planejadores",
          render: (value) => {
            if(entities) {
              let planejadores = "";
              planejadores += value.map((item) => item.value);
              planejadores = planejadores.replaceAll(",", ", ");
              if(planejadores.length < 130) {
                return (<div>{planejadores}</div>);
              } else {
                return <Popover content={this.contentPopover(value)} trigger={"hover"}>
                  {planejadores.slice(0, 130) + ("...")}
                </Popover>
              }
            }
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

  contentPopover = (value) => {
    return (
      <div style={{maxHeight: "50vh", overflow: "scroll"}}>
        <ListAnt
          header={
            <h4 style={{fontWeight: "bold"}}>
              {this.getMessage("classePorPlanejador.tabela.planejadores.label")}
            </h4>
          }
          dataSource={value}
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
    this.props.listClassePorPlanejadorRequest(filtros)
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
    return CLIENT_URL + "/config/classePorPlanejador/form/" + objeto.id;
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
  classePorPlanejador: store.classePorPlanejador,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ listClassePorPlanejadorRequest, deleteRequest }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
