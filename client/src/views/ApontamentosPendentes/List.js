import * as React from 'react';
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getMessage} from "../../components/messages";
import {Alert, Button, PageHeader, Tooltip} from "antd";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {apontamentosPendentesListRequest, apontamentosPendentesExportarRequest} from "../../store/modules/ApontamentosPendentes/action";
import { RiFileTextLine } from 'react-icons/ri';

class ApontamentosPendentesList extends React.Component {

  state = {
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "apontamentosPendentes",
      campos: [
        {nome: "data", tipo: "text", isSorteable: true, tabela: true},
        {nome: "periodo", tipo: "rangeDate", showTime: true, dateFormat: "DD/MM/YYYY HH:mm", filtro: true, colProps: {span: 10}},
        {nome: "serial", tipo: "text", isSorteable: true},
        {nome: "linhaDeProducao", tipo: "text", isSorteable: true},
        {nome: "recurso", tipo: "text", isSorteable: true},
        {nome: "grupoRecurso", tipo: "text", isSorteable: true},
        {nome: "operador", tipo: "text", isSorteable: true},
        {nome: "erroTransacao", tipo: "text", isSorteable: true},
        {nome: "status", tipo: "select", renderLabel: this.renderStatus, useMessage: false, render: this.renderStatusTabela},
      ],
      status: ["TODOS", "COM_ERRO", "SEM_ERRO"]
    },
    filtros: {
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "serial",
        order: "asc"
      }
    }
  };

  componentDidMount() {
    document.title = getMessage("apontamentosPendentes.title.label");
    this.getList()
  }

  render(){
    const { loading } = this.props.requestManager

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"apontamentosPendentes.title.label"}/>}
          extra={
            <Tooltip title={getMessage("apontamentosPendentes.exportar.tooltip.label")}>
                <Button
                    onClick={this.exportarApontamentosPendentes}
                    type="default"
                    className="page-header-ignored-button">
                    <RiFileTextLine fontSize="1.5em"/>
                </Button>
            </Tooltip>
        }
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          data={this.state.filterComp}
          mapPropsToFields={this.mapPropsToFields()}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  configTable = () => {
    const { entities, total } = this.props.apontamentosPendentes.data
    return {
      i18n: "apontamentosPendentes.",
      columns: this.state.filterComp.campos.filter(c => !c.filtro).map(c => ({...c, key: c.nome})),
      data: entities,
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      },
    }
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.apontamentosPendentesListRequest(filtros)
  };

  renderStatus(value) {
    return getMessage(`apontamentosPendentes.status.${value}.label`)
  }

  renderStatusTabela(text, record) {
    return record.erroTransacao
      ? <Alert message={getMessage("apontamentosPendentes.status.erro.label")} type="error" showIcon />
      : <Alert message={getMessage("apontamentosPendentes.status.pendente.label")} type="warning" showIcon />

  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      status: filtros?.status || "TODOS"
    };
  };

  // boilerplate abaixo

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
  
  exportarApontamentosPendentes = () => {
    this.props.apontamentosPendentesExportarRequest({
      ...this.getFiltros(),
      colunas: this.state.filterComp.campos.map(c => c.nome)
    })
  }
}


ApontamentosPendentesList.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  apontamentosPendentes: store.apontamentosPendentes,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    apontamentosPendentesListRequest, 
    apontamentosPendentesExportarRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ApontamentosPendentesList))
