import React from "react";
import { bindActionCreators } from "redux";
import {connect, useSelector} from "react-redux"
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import {Button, PageHeader, Popover, Checkbox, Row, Col, Spin, Tooltip} from "antd";
import { CLIENT_URL } from "../../config";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { AiFillFilter, AiOutlineReload, RiFileTextLine, FiEdit } from "react-icons/all";
import { getMessage } from "../../components/messages";
import {
  acompanhamentoOrdemProducaoListarRequest, alterarOPEmMassaRequest, atualizarRequest, exportarRequest,
  reexportarRequest,
} from "../../store/modules/AcompanhamentoOrdemProducao/action";
import * as queryString from "query-string";
import {withRouter} from "react-router-dom";
import FiltroAtivavel from "../../components/FiltroAtivavel";
import BotaoImportacaoComModal from "../../components/BotaoImportacaoComModal";


class List extends React.Component {

  oracleStatusProp = {
    mode: 'multiple',
    maxTagCount: 1,
    allowClear: false,
  }

  campos = [
    { key: "ordemDeProducao", nome: "ordemDeProducao", tipo: "text", visible: true, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.ordemDeProducao.label") },
    { key: "status", nome: "status", tipo: "select", seletor: "tiposStatus", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.status.label"), selectStatus: false, render: this.renderStatus },
    { key: "codigoProduto", nome: "codigoProduto", tipo: "text", visible: true, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.codigoProduto.label") },
    { key: "descricaoProduto", nome: "descricaoProduto", tipo: "text", visible: true, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.descricaoProduto.label") },
    { key: "lista", nome: "lista", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.lista.label") },
    { key: "roteiro", nome: "roteiro", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.roteiro.label") },
    { key: "fornecedor", nome: "fornecedor", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.fornecedor.label") },
    { key: "pedido", nome: "pedido", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.pedido.label") },
    { key: "quantidade", nome: "quantidade", tipo: "text", visible: true, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.quantidade.label") },
    { key: "quantidadeEntregue", nome: "quantidadeEntregue", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.quantidadeEntregue.label") },
    { key: "quantidadeRestante", nome: "quantidadeRestante", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.quantidadeRestante.label") },
    { key: "quantidadeTransito", nome: "quantidadeTransito", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.quantidadeTransito.label") },
    { key: "planejador", nome: "planejador", tipo: "select", seletor: "planejadores", visible: true, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.planejador.label"), ordenar: false, useMessage: false, allowClear: false, renderLabel: this.renderPlanejador },
    { key: "erroExportacao", nome: "erroExportacao", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.erroExportacao.label") },
    { key: "dataCriacao", nome: "dataCriacao", tipo: "rangeDate", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.dataCriacao.label") },
    { key: "dataPrevisaoFinalizacao", nome: "dataPrevisaoFinalizacao", tipo: "rangeDate", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.dataPrevisaoFinalizacao.label") },
    { key: "statusOracle", nome: "statusOracle", tipo: "select", seletor: "tiposStatusOracle", visible: true, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.statusOracle.label"), render: this.renderStatusOracle, props: this.oracleStatusProp  },
    { key: "codigoServico", nome: "codigoServico", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.codigoServico.label"), },
    { key: "totalSequenciado", nome: "totalSequenciado", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.totalSequenciado.label"), },
    { key: "totalPecasProducao", nome: "totalPecasProducao", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.totalPecasProducao.label"), },
    { key: "quantidadePendenteRomaneio", nome: "quantidadePendenteRomaneio", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.quantidadePendenteRomaneio.label") },
    { key: "totalPecasFinalizadas", nome: "totalPecasFinalizadas", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.totalPecasFinalizadas.label"), },
    { key: "release", nome: "release", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.release.label"), },
    { key: "justificativa", nome: "justificativa", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.justificativa.label"), },
    { key: "linha", nome: "linha", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.linha.label"), },
    { key: "modelo", nome: "modelo", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.modelo.label"), },
    { key: "comprimento", nome: "comprimento", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.comprimento.label"), },
    { key: "grupoLinhas", nome: "grupoLinhas", tipo: "text", visible: false, isSorteable: true, value: getMessage("acompanhamentoOrdemProducao.grupoLinhas.label"), },
  ]

  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: { style: { lineHeight: 1 } },
      margin: { marginTop: '10px' },
      campos: this.campos,

      layout: "vertical",
      prefix: "acompanhamentoOrdemProducao",

    },
    filtros: {
      ...Object.assign({},...this.campos.filter(c => c.visible).map(c => ({[c.key]: ""}))),
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        order: "asc"
      }
    }
  };

  render() {
    const { campos } = this.state.filterComp;
    const { loading } = this.props.requestManager;
    const { permissoes } = this.props.sessao.data

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"acompanhamentoOrdemProducao.listagem.label"} />}
          extra={
            <Tooltip title={getMessage("acompanhamentoOrdemProducao.exportar.tooltip.label")}>
              <Button
                onClick={this.exportarOps}
                type="default"
                className="page-header-ignored-button">
                <RiFileTextLine fontSize="1.5em" />
              </Button>
            </Tooltip>
          }
        />
        <Spin spinning={this.props.requestManager.loading}>
          <Filter
            filterComp={{...this.state.filterComp, campos: this.state.filterComp.campos.filter(c => c.visible)}}
            filtros={this.state.filtros}
            handlePesquisar={this.handlePesquisar}
            mapPropsToFields={this.mapPropsToFields()}
            data={this.props.acompanhamentoOrdemProducao}
          />
          <br />
          <Row gutter={24} className={"table-header-row"}>
            <Col md={22}>
              <FiltroAtivavel
                tipo="ACOMPANHAMENTO_DE_OP"
                setVisible={this.setVisible}
                campos={campos}
                selecionarTodos={true}
                toggleAll={this.toggleAll}
              />
            </Col>
            <BotaoImportacaoComModal
              titulo={getMessage("acompanhamentoOrdemProducao.edicaoEmMassa.label")}
              componenteBotao={this.componenteBotao}
              mensagem={getMessage("acompanhamentoOrdemProducao.importarModal.content.label")}
              onUpload={this.uploadArquivo}
              arquivoModelo={require("../../images/modelo_editar_em_massa_op.xls")}
            />
            {permissoes.includes("Atualizar OPs") && <Col md={1}>
              <Tooltip title={getMessage("faturamento.recarregar.tooltip.label")}>
                <Button style={{float: 'right'}} onClick={this.atualizarOPs}>
                  <AiOutlineReload size={15}/>
                </Button>
              </Tooltip>
            </Col>}
          </Row>
          <TabelaAnt configTable={this.configTable()} loading={loading} />
        </Spin>

      </>
    )
  };

  toggleAll = (visible) => {
    this.setState({
      filterComp: {
        ...this.state.filterComp, campos: this.state.filterComp.campos.map((c, idx) => {
          return {...c, visible: visible || idx === 0} //sempre deixar uma coluna visivel
        })
      }
    })
  }

  setVisible = (column) => {
    if (!column.visible || this.state.filterComp.campos.filter(c => c.visible).length > 1) {
    this.setState({
        filterComp: {
          ...this.state.filterComp, campos: this.state.filterComp.campos.map(c => {
            if (c.key === column.key) {
              c.visible = !column.visible
            }
            return c
          })
        }
      })
    }
  };

  async componentDidMount() {
    document.title = this.getMessage("acompanhamentoOrdemProducao.title.label");
    await this.checarParametros('status')
    await this.checarParametros('grupoLinhas')
    await this.checarParametros('statusOracle')
    this.getList();
  }

  checarParametros = async (prop) => {
    const params = queryString.parse(this.props.location.search);
    if (params[prop]) {
      const coluna = this.state.filterComp.campos.find(c => c.key === prop);
      this.setVisible(coluna);
      await this.setState({
        filtros: {
          ...this.state.filtros,
          [prop]: prop === 'statusOracle' ? [params[prop]] : params[prop],
        }
      })
    }
  }


  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
      nome: filtros ? filtros.nome : "",
      planejador: filtros.planejador || this.props.acompanhamentoOrdemProducao.defaultPlanejador,
      statusOracle: filtros.statusOracle || this.props.acompanhamentoOrdemProducao.tiposStatusOraclePadrao,
      status: filtros.status || "",
      grupoLinhas: filtros.grupoLinhas || "",
    }
  };

  configTable = () => {
    const { entities, total } = this.props.acompanhamentoOrdemProducao || {};
    return {
      i18n: "acompanhamentoOrdemProducao.tabela.",
      columns: (this.state.filterComp.campos.filter(c => c.visible) || []),
      data: entities,
      acoes: {
        exportar: this.exportar,
        editar: this.criarUrlForm,
        editarProps: (record) => ({
          disabled: record.statusOracle == null
        })
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

  exportar = (objeto) => {
    this.props.reexportarRequest(objeto.id)
  }

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id })
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.acompanhamentoOrdemProducaoListarRequest(filtros)
  };

  atualizarOPs = () => {
    const filtros = this.getFiltros();
    this.props.atualizarRequest(filtros)
  }

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
    return CLIENT_URL + "/prog/acompanhamentoOrdemProducao/form/" + objeto.id;
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

  renderStatus(status) {
    return getMessage(`${status}`);
  };
  renderStatusOracle(status) {
    return status ? getMessage(`${status}`) : null;
  };

  renderPlanejador(planejador) {
    if (planejador === 'todos' || planejador === 'padrao'){
      return getMessage(`comum.${planejador}.label`)
    }
    return planejador
  };

  exportarOps = () => {
    this.props.exportarRequest( {...this.getFiltros(), colunas: this.state.filterComp.campos.filter(c => c.visible).map(c => c.key)})
  };

  componenteBotao = (action) => {
    return (
      <Col md={1}>
        <Tooltip title={getMessage("acompanhamentoOrdemProducao.edicaoEmMassa.label")}>
          <Button style={{float: 'right'}} onClick={action}>
            <FiEdit size={15}/>
          </Button>
        </Tooltip>
      </Col>
    )
  }

  uploadArquivo = (formData) => {
    this.props.alterarOPEmMassaRequest(formData)
  }
}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  acompanhamentoOrdemProducao: store.acompanhamentoOrdemProducao,
  sessao: store.sessaoReducer,
  requestManager: store.requestManager
});

//MODIFICAR
const mapDispatchToProps = dispatch =>
  bindActionCreators({exportarRequest, acompanhamentoOrdemProducaoListarRequest, reexportarRequest, atualizarRequest, alterarOPEmMassaRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(List)))
