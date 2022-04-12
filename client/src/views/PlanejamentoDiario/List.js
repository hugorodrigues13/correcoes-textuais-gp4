import React, {Component} from 'react';
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getMessage} from "../../components/messages";
import {CLIENT_URL} from "../../config";
import {Button, PageHeader, Popconfirm, Tooltip} from "antd";
import history from "../../services/history";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {
  planejamentoDiarioDeletarRequest, planejamentoDiarioExportarRequest,
  planejamentoDiarioListarRequest
} from "../../store/modules/PlanejamentoDiario/action";
import {RiFileTextLine} from "react-icons/all";

class PlanejamentoDiarioList extends Component {

  state = {
    selectedRows: [],
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "planejamentoDiario",
      campos: [
        {nome: "data", tipo: "rangeDate", isSorteable: true},
        {nome: "linhaDeProducao", tipo: "text", isSorteable: true},
        {nome: "grupoLinhaDeProducao", tipo: "text", isSorteable: true},
        {nome: "turno", tipo: "text", isSorteable: true},
        {nome: "quantidadePlanejadaPecas", tipo: "number", isSorteable: true},
        {nome: "quantidadePlanejadaPessoas", tipo: "number", isSorteable: true},
        {nome: "quantidadePessoasPresentes", tipo: "number", isSorteable: true},
      ],
    },
    filtros: {
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "data",
        order: "asc"
      }
    }
  };

  render(){
    const { loading } = this.props.requestManager
    const { data } = this.props.planejamentoDiario

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"planejamentoDiario.title.label"}/>}
          extra={[
            <Tooltip title={getMessage("planejamentoDiario.exportar.tooltip.label")}>
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
              onClick={() => history.push(CLIENT_URL + "/prog/planejamentoDiario/form")}
            >
              <FormattedMessage id={"comum.novoRegistro.label"} />
            </Button>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          data={data}
          mapPropsToFields={this.mapPropsToFields()}
        />
        <br/>
        {this.state.selectedRows.length >= 1 && this.renderDeletarVarios()}
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  exportar = () => {
    this.props.planejamentoDiarioExportarRequest({...this.getFiltros(), colunas: this.state.filterComp.campos.map(c => c.nome)})
  };

  renderDeletarVarios = () => {
    return (
      <Popconfirm title={getMessage("comum.excluir.confirmar.label")} onConfirm={this.deletarVarios} placement="right">
        <Button style={{marginBottom: 15}} type="danger">
          {getMessage("comum.excluir.label")}
        </Button>
      </Popconfirm>
    )
  }

  deletarVarios = () => {
    this.props.planejamentoDiarioDeletarRequest(this.state.selectedRows.map(r => r.id), this.getFiltros());
    this.setState({selectedRows: []})
  }

  componentDidMount() {
    document.title = getMessage("planejamentoDiario.title.label");
    this.getList()
  }

  configTable = () => {
    const { entities, total } = this.props.planejamentoDiario.data
    return {
      i18n: "planejamentoDiario.",
      columns: this.state.filterComp.campos.filter(c => !c.filtro).map(c => ({...c, key: c.nome})),
      data: entities,
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      },
      acoes: {
        editar: this.criaUrlForm,
        excluir: this.deletar
      },
      rowSelection: {
        selectedRowKeys: this.state.selectedRows.map(t => t.id),
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            selectedRows: selectedRows,
          })
        },
      },
    }
  };

  deletar = objeto => {
    this.props.planejamentoDiarioDeletarRequest(objeto.id, this.getFiltros());
  };

  criaUrlForm = objeto => {
    return CLIENT_URL + "/prog/planejamentoDiario/form/" + objeto.id;
  };

  // abaixo boilerplate

  getList = () => {
    const filtros = this.getFiltros();
    this.props.planejamentoDiarioListarRequest(filtros)
  };

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

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getList()
  }


  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset
  }

  getFiltros = () => {
    const {filtros} = this.state;
    let {offset, max} = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const {sort, order} = filtros.ordenacao;
    return {
      ...filtros,
      offset,
      max,
      sort,
      order
    }
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {

    };
  };

}

PlanejamentoDiarioList.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  planejamentoDiario: store.planejamentoDiario,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({planejamentoDiarioListarRequest, planejamentoDiarioExportarRequest, planejamentoDiarioDeletarRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PlanejamentoDiarioList))
