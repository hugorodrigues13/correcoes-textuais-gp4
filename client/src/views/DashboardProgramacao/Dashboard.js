import React from "react";
import {Row, Spin, Col, Card} from "antd";
import { intlShape, injectIntl, FormattedMessage } from "react-intl";
import DashItem from "./DashItem";
import {AiFillExclamationCircle} from "react-icons/all";
import {bindActionCreators} from "redux";
import {listProgramacaoRequest} from "../../store/modules/DashboardProgramacao/action";
import {connect} from "react-redux";
import ModalProdutosSemGrupo from "../Sequenciamento/ModalProdutosSemGrupo";
import {
  buscarGruposRequest, buscarOrdensGrupoRequest, getOrdensDeProducaoProdutosAssociadoGrupoRequest,
  getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest
} from "../../store/modules/Sequenciamento/action";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import GraficoOPProgramada from "./GraficoOPProgramada";
import ModalOrdensAtrasadas from "./ModalOrdensAtrasadas";
import Filter from "../../components/filter/Filter";

class Dashboard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isModalVisible: false,
      isModalRecebimentosErro: false,
      isModalOrdensAtrasadasVisible: false,
      filtros: {
        grupoLinhas: "",
      },
      filterComp: {
        labelCol:{style: {lineHeight:1}},
        margin:{marginTop: '10px'},
        layout: "vertical",
        prefix: "dashboardProgramacao",
        campos: [
          { nome: "grupoLinhas", tipo: "selectFilter", seletor: "listGrupoLinhas", tratamento: true ,useMessage: false },
        ]
      },
    };
  }

  componentDidMount() {
    this.props.listProgramacaoRequest()
    this.props.buscarGruposRequest()
    this.props.getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest({})
  }

  showModal = (show, modal) => {
    if(modal === "MODAL_ORDENS_ATRASADAS"){
      this.setState({isModalOrdensAtrasadasVisible: show})
    } else if(modal === "MODAL_PRODUTOS_SEM_GRUPO") {
      this.setState({isModalVisible: show})
    } else if (modal === 'MODAL_RECEBIMENTOS_ERRO'){
      this.setState({isModalRecebimentosErro: show})
    }
  };

  handleOk = () => {
    const {grupoSelecionado} = this.props.sequenciamento;
    this.showModal(false, "MODAL_PRODUTOS_SEM_GRUPO")
    this.props.getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest({})
    if(grupoSelecionado) {
      this.props.buscarOrdensGrupoRequest(grupoSelecionado)
      this.props.getOrdensDeProducaoProdutosAssociadoGrupoRequest(grupoSelecionado)
    }
  };

  handleOkOrdensAtrasadas = () => {
    this.showModal(false, "MODAL_ORDENS_ATRASADAS")
  };

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  };

  handlePesquisar = async values => {
      let state = this.state;
      state.filtros = { ...this.state.filtros, ...values };
      await this.setState(state);
      this.props.listProgramacaoRequest(state.filtros);
  };

  mapPropsToFields () {
    return {
      grupoLinhas: this.state.filtros ? this.state.filtros.grupoLinhas : "",
    }
  }

  render() {
    const loading = this.props.requestManager.loading
    const {
      listaGrupos,
      ordensSemGrupo,
      LoadingOrdensSemGrupo,
      totalOrdensSemGrupoFiltradas,
    } = this.props.sequenciamento;
    const { listGrupoLinhas, ordensProgramadas } = this.props.dashboardProgramacao.data;
    const { opProgramadasParaHoje, opProgramadasParaAProximaSemana, opProgramadasParaOProximoMes } = ordensProgramadas

    return (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <h2 className="titulo-pagina ">
              <FormattedMessage id="menu.dashboardProgramacao.label" />
            </h2>
          </Col>
        </Row>
        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          mapPropsToFields={this.mapPropsToFields()}
          data={{ listGrupoLinhas: listGrupoLinhas || [] }}
          collapseProps={{defaultActiveKey: false}}
        />
        <br />
        <Row gutter={24}>
          <Col span={8}>
            <Card className="dash-prog-card-grafico">
              <h4 className="titulo-pagina ">
                {this.getMessage("dashboardProgramacao.ordensDeProducaoProgramadasHoje.label")}
              </h4>
              <GraficoOPProgramada
                quantidade={[opProgramadasParaHoje.quantidadePendente, opProgramadasParaHoje.quantidadeProduzida]}
                loadingGraficos={this.props.dashboardProgramacao.loading}
                getMessage={this.getMessage} />
            </Card>
          </Col>
          <Col span={8}>
            <Card className="dash-prog-card-grafico">
              <h4 className="titulo-pagina ">
                {this.getMessage("dashboardProgramacao.ordensDeProducaoProgramadasSeteDias.label")}
              </h4>
              <GraficoOPProgramada
                quantidade={[opProgramadasParaAProximaSemana.quantidadePendente, opProgramadasParaAProximaSemana.quantidadeProduzida]}
                loadingGraficos={this.props.dashboardProgramacao.loading}
                getMessage={this.getMessage} />
            </Card>
          </Col>
          <Col span={8}>
            <Card className="dash-prog-card-grafico">
              <h4 className="titulo-pagina ">
                {this.getMessage("dashboardProgramacao.ordensDeProducaoProgramadasTrintaDias.label")}
              </h4>
              <GraficoOPProgramada
                quantidade={[opProgramadasParaOProximoMes.quantidadePendente, opProgramadasParaOProximoMes.quantidadeProduzida]}
                loadingGraficos={this.props.dashboardProgramacao.loading}
                getMessage={this.getMessage} />
            </Card>
          </Col>
        </Row>
        <br />
        <Spin spinning={loading}>
          <Row gutter={24}>
            <DashItem
              body="dashboard.programacao.opnaoassociada.label"
              center={this.props.dashboardProgramacao.data.opsNaoAssociadas}
              buttonText="dashboard.programacao.botao.verodens.label"
              buttonHandler={() => this.showModal(true, "MODAL_PRODUTOS_SEM_GRUPO")}
            />
            <DashItem
              body={{
                id: "dashboard.programacao.errosidentificados.label",
                args: {erros: this.props.dashboardProgramacao.data.opsComErros}
              }}
              center={<AiFillExclamationCircle/>}
              buttonText="dashboard.programacao.botao.acompanharodens.label"
              buttonHandler={() => history.push(CLIENT_URL + "/prog/acompanhamentoOrdemProducao?status=ERRO_EXPORTACAO&statusOracle=LIBERADO&grupoLinhas=" + (listGrupoLinhas?.find(g => g.id == this.state.filtros.grupoLinhas)?.nome.replace(" ", "%20") || ""))}
            />
            <DashItem
              body="dashboard.programacao.opComAtraso.label"
              center={this.props.dashboardProgramacao.data.totalOPAtraso}
              buttonText="dashboard.programacao.botao.verodens.label"
              buttonHandler={() => this.showModal(true, "MODAL_ORDENS_ATRASADAS")}
            />
          </Row>
          <br />
          <Row gutter={24}>
            <DashItem
              body="dashboard.programacao.recebimentosErro.label"
              center={this.props.dashboardProgramacao.data.recebimentosErro}
              buttonText="dashboard.programacao.botao.verrecebimentos.label"
              buttonHandler={() => history.push(CLIENT_URL + "/prog/recebimento?erro=COM_ERRO")}
            />
          </Row>
        </Spin>
        <ModalProdutosSemGrupo
          getMessage={this.getMessage}
          totalOrdensSemGrupoFiltradas={totalOrdensSemGrupoFiltradas}
          isModalVisible={this.state.isModalVisible}
          handleOk={this.handleOk}
          listaGrupos={listaGrupos}
          handleCancel={this.handleOk}
          ordensSemGrupo={ordensSemGrupo}
          LoadingOrdensSemGrupo={LoadingOrdensSemGrupo}
        />
        <ModalOrdensAtrasadas
          getMessage={this.getMessage}
          isModalVisible={this.state.isModalOrdensAtrasadasVisible}
          handleOk={this.handleOkOrdensAtrasadas}
          handleCancel={this.handleOkOrdensAtrasadas}
          loadingOrdensAtrasadas={this.props.acompanhamentoOrdemProducao.loadingOrdensAtrasadas}
          ordensAtrasadas={this.props.acompanhamentoOrdemProducao.opAtrasadas}
          filtrosDashboard={this.state.filtros}
        />
      </>
    );
  }

}

Dashboard.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  dashboardProgramacao: store.dashboardProgramacao,
  requestManager: store.requestManager,
  sequenciamento: store.sequenciamento,
  acompanhamentoOrdemProducao: store.acompanhamentoOrdemProducao,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({listProgramacaoRequest,getOrdensDeProducaoProdutosAssociadoGrupoRequest,buscarOrdensGrupoRequest,buscarGruposRequest, getTotalOrdensDeProducaoProdutosSemGrupoAssociadoRequest}, dispatch);


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
