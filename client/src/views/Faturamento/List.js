import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {Button, PageHeader, Tooltip} from "antd";
import Filter from "../../components/filter/Filter";
import {getMessage} from "../../components/messages";
import {
  faturamentoListarRequest,
  envioLoteRomaneioRequest,
  fecharLoteIncompletoRequest,
  exportarLotesRequest,
  checarLoteRomaneioRequest,
  listImpressorasRequest,
  faturamento_abrir_lote_request,
  faturamentoExportarExcelRequest,
  concluirOPRequest
} from "../../store/modules/Faturamento/action";
import Modal from "./Modal";
import Tabela from "./Tabela";
import {AiOutlineFileExcel, RiFileTextLine} from "react-icons/all";
class List extends React.Component {
  campos = [
    {key: "lote", nome: "lote", tipo: "text", visible: true, value: getMessage("faturamento.lote.label")},
    {key: "codigoProduto", nome: "codigoProduto", tipo: "text", visible: true, value: getMessage("faturamento.codigoProduto.label")},
    {key: "descricao", nome: "descricao", tipo: "text", visible: true, value: getMessage("faturamento.descricao.label")},
    {key: "local", nome: "local", tipo: "text", visible: true, value: getMessage("faturamento.codigoProduto.label")},
    {key: "ordemFabricacao", nome: "ordemFabricacao", tipo: "text", visible: true, value: getMessage("faturamento.ordemFabricacao.label")},
    {key: "statusLote", nome: "statusLote", tipo: "select", visible: true, opcaoTodos: "TODOS", tratamento: true},
  ]

  state = {
    showModal: false,
    newStatus: null,
    dataFiltro: {
      statusLote: [
        {
          key: "ABERTO",
          nome: "Apenas Lotes Abertos"
        },
        {
          key: "FECHADO",
          nome: "Apenas Lotes Fechados"
        }]
    },
    entity: null,
    totalCount: 0,
    status: "",
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      campos: this.campos,
      layout: "vertical",
      prefix: "faturamento",

    },
    filtros: {
      ...Object.assign({}, ...this.campos.filter(c => c.visible).map(c => ({[c.key]: ""}))),
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        codigoProduto: "",
        order: "asc"
      }
    }
  };

  render() {
    const {loading} = this.props.requestManager;
    const {lotes = [], total, desativarRomaneio} = this.props.faturamentoProducao || {};

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"faturamento.listagem.label"}/>}
          ghost
          extra={
            <>
              <Tooltip title={getMessage("faturamento.exportar.tooltip.label")}>
                <Button
                  onClick={() => this.props.exportarLotesRequest()}
                  type="default"
                  className="page-header-ignored-button">
                  <RiFileTextLine fontSize="1.5em" />
                </Button>
              </Tooltip>
              <Tooltip title={getMessage("faturamento.exportar.tooltip.excel.label")}>
                <Button
                  onClick={() => this.props.faturamentoExportarExcelRequest({...this.getFiltros(), filtros: this.campos.map(c => c.key)})}
                  type="default"
                  className="page-header-ignored-button">
                  <AiOutlineFileExcel fontSize="1.5em" />
                </Button>
              </Tooltip>
            </>
          }
        />

        <Filter
          filterComp={{...this.state.filterComp, campos: this.state.filterComp.campos.filter(c => c.visible)}}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={this.state.dataFiltro}
        />
        <br/>
        <Tabela
          filtros={this.state.filtros}
          lotes={lotes}
          total={total}
          desativarRomaneio={desativarRomaneio}
          acoes={this.actionLote}
          abrirLote={this.abrirLote}
          enviarVariosLotesParaRomaneio={this.enviarVariosLotesParaRomaneio}
          concluirOPsVariosLotes={this.concluirOPsVariosLotes}
          filtro={{
            atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina,
            paginacao: this.paginacao
          }}
          getMessage={this.getMessage}
          loading={loading}/>
        {this.state.showModal && <Modal
          visible={this.state.showModal}
          handleCancel={this.handleHiddenModal}
          entidade={this.state.newStatus}
          onSave={this.handleSaveValue}
          loading={loading}
          entity={this.state.entity}
        />}
      </>
    )
  };

  componentDidMount() {
    document.title = this.getMessage("faturamento.title.label");
    this.getList();
  }

  mapPropsToFields = () => {
    const {filtros} = this.state;
    return {
      codigoProduto: filtros ? filtros.codigoProduto : "",
    }
  };

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  };

  getList = () => {
    const filtros = this.getFiltros();
    this.props.faturamentoListarRequest(filtros)
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = {...this.state.filtros, ...values};
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

  romaneio = lote => {
    const {id} = lote
    this.props.checarLoteRomaneioRequest({id: [id]})
    this.handleShowModal(lote);
  };

  fecharLote = lote => {
    this.props.listImpressorasRequest();
    this.handleShowModal(lote);
  };

  concluirOP = lote => {
    this.props.concluirOPRequest({lote})
  }

  actionLote = lote => {
    if(this.props.faturamentoProducao.desativarRomaneio) {
      this.concluirOP([lote.id])
    } else if (lote.statusLote === "ABERTO") {
      this.fecharLote(lote)
      this.setState({entity: lote})
    } else {
      this.romaneio(lote)
    }
  }

  enviarVariosLotesParaRomaneio = lote => {
    this.props.checarLoteRomaneioRequest({id: lote})
    this.setState({
      showModal: true,
      newStatus: {id: lote, statusLote: "FECHADO"}
    });
  }

  concluirOPsVariosLotes = lote => {
    this.concluirOP(lote)
  }

  handleSaveValue = (objeto) => {
    const {statusLote, id, justificativa, codigoLote, impressora} = objeto
    if (statusLote === "FECHADO") {
      this.props.envioLoteRomaneioRequest({id: [id]})
    } else {
      this.props.fecharLoteIncompletoRequest({id, codigoLote, statusLote, justificativa, impressora})
    }
    this.handleHiddenModal();
  };

  handleShowModal = (object) => {
    const {id, statusLote, agrupamento, quantidade, quantidadeMaxima, codigoLote, impressoesPendentes} = object
    this.setState({
      showModal: true,
      newStatus: {id: statusLote === "ABERTO" ? id : [id], statusLote, agrupamento, quantidade, quantidadeMaxima, codigoLote, impressoesPendentes}
    });
  };

  handleHiddenModal = () => {
    this.setState({showModal: false});
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

  abrirLote = (objeto) => {
    this.props.faturamento_abrir_lote_request(objeto.id)
  }

}

List.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  faturamentoProducao: store.faturamento,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({exportarLotesRequest, faturamentoListarRequest, checarLoteRomaneioRequest, envioLoteRomaneioRequest, fecharLoteIncompletoRequest, listImpressorasRequest, faturamento_abrir_lote_request, faturamentoExportarExcelRequest, concluirOPRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(List))
