import * as React from 'react';
import {getMessage} from "../../components/messages";
import {Button, Col, PageHeader, Popconfirm, Popover, Row, Spin, Tooltip} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {bindActionCreators} from "redux";
import {FormattedMessage, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {
  listOrdemFabricacaoRequest,
  imprimirEtiquetaRequest,
  folhaImpressaoRequest,
  exportarRequest,
  materiasPrimasDaOFRequest,
  cancelarOFsRequest,
  folhaImpressaoDataRequest,
  listaHistoricoImpressaoRequest
} from "../../store/modules/OrdemDeFabricacao/action";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import FiltroAtivavel from "../../components/FiltroAtivavel";
import ImpressaoModal from "./ImpressaoModal";
import HistoricoModal from "./HistoricoModal";
import {AiOutlineHistory} from "react-icons/all";
import {RiFileTextLine} from "react-icons/all";
import SeparacaoModal from "./SeparacaoModal";
import "./style.css"
import QuantidadeInput from "./QuantidadeInput";
import FolhaImpressaoModal from "./FolhaImpressaoModal";

class List extends React.Component {

  statusProp = {
    mode: 'multiple',
    maxTagCount: 1,
    allowClear: false,
  }

  campos = [
    {
      key: "ordemFabricacao",
      nome: "ordemFabricacao",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.ordemFabricacao.label"),
      isSorteable: true
    },
    {
      key: "codigoProduto",
      nome: "codigoProduto",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.codigoProduto.label"),
      isSorteable: true
    },
    {
      key: "descricaoProduto",
      nome: "descricaoProduto",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.descricaoProduto.label"),
      isSorteable: true
    },
    {
      key: "comentarios",
      nome: "comentarios",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.comentarios.label"),
      isSorteable: true,
      render: (text) => {
        if(!text) return ""

        const limitedText = text.length > 60
          ? text.slice(0, 57).trim() + '...'
          : text

        return text.length > 60 ? (
          <Popover content={text} >
            {limitedText}
          </Popover>
        ) : text
      }
    },
    {
      key: "grupoLinhasProducao",
      nome: "grupoLinhasProducao",
      tipo: "text",
      seletor: "gruposLinhas",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.grupoLinhasProducao.label"),
      isSorteable: true
    },
    {
      key: "linhaProducao",
      nome: "linhaProducao",
      tipo: "text",
      seletor: "linhas",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.linhaProducao.label"),
      isSorteable: true
    },
    {
      key: "ordemProducao",
      nome: "ordemProducao",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.ordemProducao.label"),
      isSorteable: true
    },
    {
      key: "dataCriacao",
      nome: "dataCriacao",
      tipo: "rangeDate",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.dataCriacao.label"),
      isSorteable: true
    },
    {
      key: "justificativa",
      nome: "justificativa",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.justificativa.label"),
      isSorteable: true
    },
    {
      key: "ordemSequenciamento",
      nome: "ordemSequenciamento",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.ordemSequenciamento.label"),
      isSorteable: true,
      tabela: true
    },
    {
      key: "cliente",
      nome: "cliente",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.cliente.label"),
      isSorteable: true
    },
    {
      key: "comprimento",
      nome: "comprimento",
      tipo: "text",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.comprimento.label"),
      isSorteable: true
    },
    {
      key: "quantidadeProgramada",
      nome: "quantidadeProgramada",
      tipo: "number",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.quantidadeProgramada.label"),
      isSorteable: true,
      render: (text, record) => <QuantidadeInput record={record} getFiltros={this.getFiltros}/>
    },
    {
      key: "quantidadeProduzida",
      nome: "quantidadeProduzida",
      tipo: "number",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.quantidadeProduzida.label"),
      isSorteable: true
    },
    {
      key: "dataPrevisaoFinalizacao",
      nome: "dataPrevisaoFinalizacao",
      tipo: "rangeDate",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.dataPrevisaoFinalizacao.label"),
      isSorteable: true
    },
    {
      key: "status",
      nome: "status",
      tipo: "select",
      seletor: "status",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.status.label"),
      useMessage: false,
      render: this.renderLabel,
      renderLabel: this.renderLabel,
      props: this.statusProp,
      isSorteable: true
    },
    {
      key: "statusWIP",
      nome: "statusWIP",
      tipo: "select",
      seletor: "statusWIP",
      visible: true,
      value: getMessage("ordemFabricacao.filtro.statusWIP.label"),
      useMessage: false,
      render: this.renderStatusWIP,
      renderLabel: this.renderStatusWIP,
      props: this.statusProp,
      isSorteable: true
    },
  ]

  state = {
    entidade: null,
    openModal: false,
    openModalHistorico: false,
    openModalSeparacao: false,
    openModalFolhaImpressao: false,
    opcoesImpressao: [{key: "Gerar PDF", value: "Gerar PDF"}, {
      key: "Selecionar uma impressora",
      value: "Selecionar uma impressora"
    }],
    opcaoSelecionada: null,
    listaDeImpressoras: null,
    impressoraSelecionada: null,
    folhaParaImpressao: null,
    ofsSelecionadas: [],
    isImprimirEmMassa: false,
    selectedRowsImpressao: [],
    filterComp: {
      campos: this.campos,
      layout: "vertical",
      prefix: "ordemFabricacao.filtro",
    },
    filtros: {
      ...Object.assign({}, ...this.campos.filter(c => c.visible).map(c => ({[c.key]: ""}))),
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        ordemFabricacao: "",
        order: "asc"
      }
    }
  }

  componentDidMount() {
    document.title = getMessage("ordemFabricacao.title.label")
    this.getList()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let entities = this.props.ordemFabricacao?.data?.impressoras
    if (entities && !this.state.listaDeImpressoras) {
      let listaFormatada = entities.map((entity) => {
        return {
          key: entity.id,
          value: entity.apelido
        }
      });
      this.setState({listaDeImpressoras: listaFormatada});
    }
    if (prevState.opcaoSelecionada !== this.state.opcaoSelecionada) {
      this.setState({impressoraSelecionada: null});
    }
  }

  getList = () => {
    this.props.listOrdemFabricacaoRequest(this.getFiltros());
  };

  configTable = () => {
    const {entities, total} = this.props.ordemFabricacao.data || {};
    return {
      i18n: "ordemFabricacao.filtro.",
      columns: (this.state.filterComp.campos.filter(c => c.visible) || []),
      rowSelection: {
        type: "checkbox",
        selectedRowKeys: this.state.selectedRowsImpressao.map(o => o.id),
        onChange: (rows, records) => {
          this.setState({
            ofsSelecionadas: !records.some(o => ['CANCELADA', 'FINALIZADA', 'EM_ANDAMENTO'].includes(o.status)) ? records : [],
            selectedRowsImpressao: records,
            isImprimirEmMassa: rows.length > 1
          })
        },
      },
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      },
      data: entities,
      acoes: {
        impressao: this.openModal,
        folhaImpressao: this.openModalFolhaImpressao,
        historico: this.openModalHistorico,
        separacao: this.openModalSeparacao,
        historicoProps: (record) => ({
          disabled: false,
          icone: <AiOutlineHistory size={18}/>
        }),
        separacaoProps: (record) => ({
          disabled: record.status !== 'ABERTA' && record.status !== 'EM_ANDAMENTO',
          className: record.status !== 'ABERTA' && record.status !== 'EM_ANDAMENTO' ? 'deixa-disabled' : 'deixa-azul'
        })
      }
    }
  }

  mapPropsToFields = () => {
    const {filtros} = this.state;
    const {data} = this.props.ordemFabricacao
    return {
      ordemFabricacao: filtros ? filtros.ordemFabricacao : "",
      status: filtros.status || data.filtroStatusPadrao,
      statusWIP: filtros.statusWIP || (data.statusWIP || []),
    }
  };

  render() {
    const {loading} = this.props.requestManager
    const {campos} = this.state.filterComp;
    const {materiasPrimas} = this.props.ordemFabricacao
    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => history.push(CLIENT_URL + "/")}
          title={getMessage("ordemFabricacao.title.label")}
          extra={
            <Tooltip title={getMessage("ordemFabricacao.exportar.tooltip.label")}>
              <Button
                onClick={this.exportarOfs}
                type="default"
                className="page-header-ignored-button">
                <RiFileTextLine fontSize="1.5em"/>
              </Button>
            </Tooltip>
          }
        />
        <Spin spinning={loading}>
          <Filter
            filterComp={{...this.state.filterComp, campos: this.state.filterComp.campos.filter(c => c.visible)}}
            filtros={this.state.filtros}
            data={this.props.ordemFabricacao.data}
            handlePesquisar={this.handlePesquisar}
            mapPropsToFields={this.mapPropsToFields()}
          />
          <br/>
          <Row gutter={24} className={"table-header-row"}>
            {!!this.state.ofsSelecionadas.length && <Col span={2}>
              <Popconfirm title={getMessage("ordemFabricacoa.cancelar.confirmar.label")} onConfirm={this.cancelar}>
                <Button type={"primary"}>
                  {getMessage("comum.cancelar.label")}
                </Button>
              </Popconfirm>
            </Col>}
            {this.state.isImprimirEmMassa && <Col md={3}>
              <Button size="medium" htmlType="submit" type="primary"
                      onClick={() => this.folhaImpressao(this.state.selectedRowsImpressao)}>
                <FormattedMessage id={"comum.folhaImpressao.label"}/>
              </Button>
            </Col>}
            <Col md={19}>
              <FiltroAtivavel
                tipo="ORDEM_FABRICACAO"
                setVisible={this.setVisible}
                campos={campos}
                selecionarTodos={true}
                toggleAll={this.toggleAll}
              />
            </Col>
          </Row>
          <TabelaAnt configTable={this.configTable()} loading={this.props.requestManager.loading}/>
        </Spin>
        <ImpressaoModal
          visible={this.state.openModal}
          setVisible={(b) => this.setState({openModal: b})}
          entidade={this.state.entidade}
          impressoraSelecionada={this.state.impressoraSelecionada}
          listaDeImpressoras={this.state.listaDeImpressoras}
          setImpressoraSelecionada={this.impressoraSelecionada}
          getFiltros={this.getFiltros}
        />
        <HistoricoModal
          visible={this.state.openModalHistorico}
          setVisible={(b) => this.setState({openModalHistorico: b})}
          entidade={this.state.entidade}
        />
        <SeparacaoModal
          visible={this.state.openModalSeparacao}
          setVisible={(b) => this.setState({openModalSeparacao: b})}
          entidade={this.state.entidade}
          materiasPrimas={materiasPrimas}
          loading={loading}
          getFiltros={this.getFiltros}
        />
        <FolhaImpressaoModal
          visible={this.state.openModalFolhaImpressao}
          setVisible={(b) => this.setState({openModalFolhaImpressao: b})}
          data={{...this.props.ordemFabricacao.folhaImpressao?.entity, id: this.state.folhaParaImprimir?.id} || {}}
          imprimirFolha={this.folhaImpressao}
          loading={loading}
        />
      </>
    )
  }

  cancelar = () => {
    this.props.cancelarOFsRequest(this.state.ofsSelecionadas.map(o => o.id), this.getFiltros())
    this.setState({ofsSelecionadas: []})
  }


  toggleAll = (visible) => {
    this.setState({
      filterComp: {
        ...this.state.filterComp, campos: this.state.filterComp.campos.map((c, idx) => {
          return {...c, visible: visible || idx === 0} //sempre deixar uma coluna visivel
        })
      }
    })
  }

  openModal = (object) => {
    this.setState({entidade: object, openModal: true});
  }

  openModalHistorico = (object) => {
    this.props.listaHistoricoImpressaoRequest(object.id)
    this.setState({entidade: object, openModalHistorico: true});
  }

  openModalSeparacao = (object) => {
    this.props.materiasPrimasDaOFRequest(object.ordemProducao)
    this.setState({entidade: object, openModalSeparacao: true});
  }

  openModalFolhaImpressao = (object) => {
    this.props.folhaImpressaoDataRequest(object)
    this.setState({folhaParaImprimir: object, openModalFolhaImpressao: true});
  }

  folhaImpressao = (object) => {
    !object.length
      ? this.props.folhaImpressaoRequest([object])
      : this.props.folhaImpressaoRequest(object);
  }

  opcaoSelecionada = (key) => {
    this.setState({opcaoSelecionada: key});
  }

  impressoraSelecionada = (key) => {
    this.setState({impressoraSelecionada: key});
  }

  setVisible = (column) => {
    if (!column.visible || this.state.filterComp.campos.filter(c => c.visible).length > 1) {
      this.setState({
        filterComp: {
          ...this.state.filterComp, campos: this.state.filterComp.campos.map(c => {
            if (c.key === column.key) {
              c.visible = !c.visible
            }
            return c
          })
        }
      })
    }
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

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = {...this.state.filtros, ...values};
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList()
  };

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
    };
  };

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset
  }

  renderLabel(status) {
    return status ? getMessage(`ordemFabricacao.filtro.status.${status}.label`) : null;
  }

  renderStatusWIP(statusWIP) {
    return statusWIP ? getMessage(`ordemFabricacao.filtro.statusWIP.${statusWIP}.label`) : null;
  }

  renderStatus(status) {
    return status ? getMessage(`${status}`) : null;
  };

  exportarOfs = () => {
    this.props.exportarRequest({
      ...this.getFiltros(),
      colunas: this.state.filterComp.campos.filter(c => c.visible).map(c => c.key)
    })
  };
}

const mapStateToProps = store => ({
  ordemFabricacao: store.ordemFabricacao,
  requestManager: store.requestManager,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    listOrdemFabricacaoRequest,
    imprimirEtiquetaRequest,
    folhaImpressaoRequest,
    exportarRequest,
    materiasPrimasDaOFRequest,
    cancelarOFsRequest,
    folhaImpressaoDataRequest,
    listaHistoricoImpressaoRequest
  }, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))

