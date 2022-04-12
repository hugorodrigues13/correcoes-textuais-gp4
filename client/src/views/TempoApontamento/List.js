import * as React from 'react';
import {Button, Col, InputNumber, PageHeader, Popover, Row} from "antd";
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {getMessage} from "../../components/messages";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {tempoApontamentoEditRequest, tempoApontamentoListRequest} from "../../store/modules/TempoApontamento/action";
import {CLIENT_URL} from "../../config";
import {selecionarOrdensRequest} from "../../store/modules/GeracaoOrdemDeProducao/action";
import TempoInput, {renderContent} from "./TempoInput";

class TempoApontamentoList extends React.Component {

  state = {
    entity: [],
    totalCount: 0,
    popoverAberto: false,
    popoverTempo: 1,
    selectedRows: [],
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "tempoApontamento",
      campos: [
        {nome: "codigoProduto", colProps: {span: 8}, tipo: "text", isSorteable: true},
        {nome: "tempoApontamento", tipo: "number", min:1, isSorteable: true, width: '5%', colProps: {span: 6}, render: (text, record) => <TempoInput record={record} filtros={this.getFiltros}/>},
        {nome: "vigencia",  colProps: {span: 10}, tipo: "rangeDate", isSorteable: true, showTime: true, dateFormat: "DD/MM/YYYY HH:mm", filtro: true},
        {nome: "vigenciaDe", tipo: "rangeDate", isSorteable: true, showTime: true, tabela: true},
        {nome: "vigenciaAte", tipo: "rangeDate", isSorteable: true, showTime: true, tabela: true},
        {nome: "grupoRecurso", tipo: "text", isSorteable: true},
        {nome: "status", tipo: "select", renderLabel: this.renderStatus, useMessage: false, filtro: true},
      ],
      status: ["TODOS", "VIGENCIA", "NAO_VIGENCIA"]
    },
    filtros: {
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

  componentDidMount() {
    document.title = getMessage("tempoApontamento.title.label");
    this.getList()
  }

  render(){
    const { loading } = this.props.requestManager

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"tempoApontamento.title.label"}/>}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          data={this.state.filterComp}
          mapPropsToFields={this.mapPropsToFields()}
        />
        <br/>
        {this.state.selectedRows.length >= 2 && this.renderAtualizarVarios()}
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  renderAtualizarVarios = () => {
    const onConfirm = (todos) => {
      const ids = this.state.selectedRows.map(t => t.id)
      const tempo = this.state.popoverTempo
      this.setState({popoverAberto: false})
      this.props.tempoApontamentoEditRequest(ids, tempo, todos, this.getFiltros())
    };
    const onCancel = () => {
      this.setState({popoverAberto: false})
    }
    const atualizarTodos = () => {
      onConfirm(true)
    }
    const criarNovo = () => {
      onConfirm(false)
    }
    const renderExtra = () => {
      return (
        <Row gutter={24}>
          <Col span={24} style={{marginBottom: 8}}>
            <InputNumber
              min={1}
              value={this.state.popoverTempo}
              onChange={(value) => this.setState({popoverTempo: value})}
            />
          </Col>
        </Row>
      )
    }
    return (
      <Popover
        visible={this.state.popoverAberto}
        overlayStyle={{width: 320}}
        placement="topRight"
        onVisibleChange={(b) => !b ? this.setState({popoverAberto: false}) : null}
        content={renderContent(onCancel, atualizarTodos, criarNovo, renderExtra(), "tempoApontamento.editarTempos.label")}
        trigger="click"
      >
        <Button
          type="primary"
          onClick={() => this.setState({popoverAberto: true})}
        >
          {getMessage("tempoApontamento.atualizar.label")}
        </Button>
      </Popover>

    )
  };

  configTable = () => {
    const { entities, total } = this.props.tempoApontamento.data
    return {
      i18n: "tempoApontamento.",
      columns: this.state.filterComp.campos.filter(c => !c.filtro).map(c => ({...c, key: c.nome})),
      data: entities,
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      },
      rowSelection: {
        selectedRowKeys: this.state.selectedRows.map(t => t.id),
        type: 'checkbox',
        getCheckboxProps: (record) => ({
          disabled: record.vigenciaAte
        }),
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            selectedRows: selectedRows,
          })
        },
      },
    }
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.tempoApontamentoListRequest(filtros)
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

  renderStatus(value) {
    return getMessage(`tempoApontamento.status.${value}.label`)
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      status: filtros?.status || "VIGENCIA"
    };
  };

}

TempoApontamentoList.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  tempoApontamento: store.tempoApontamento,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({tempoApontamentoListRequest, tempoApontamentoEditRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TempoApontamentoList))
