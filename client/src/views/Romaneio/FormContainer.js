import * as React from 'react';
import {Button, Col, Modal, PageHeader, Popconfirm, Row, Spin} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import {bindActionCreators} from "redux";
import {listAlmoxarifadoRequest} from "../../store/modules/Almoxarifado/action";
import {FormattedMessage, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {
  abrirRomaneioStatusRequest,
  cancelarRomaneioStatusRequest,
  prepareRomaneioEditRequest,
  exportarRomaneioRequest, gerarNffRequest, verificarStatusIntegracaoRequest, exportarRomaneioXlsxRequest,
} from "../../store/modules/Romaneio/action";
import RomaneioForm from "./Form";
import {DeleteOutlined} from "@ant-design/icons";
import EditarLotesModal from "./EditarLotesModal";
import { AiOutlineFileExcel } from 'react-icons/ai';

class RomaneioFormContainer extends React.Component {

  state = {
    lotesModalOpen: false
  }

  render(){
    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => history.push(CLIENT_URL + "/prod/romaneio")}
          title={getMessage("romaneio.dados.title.label")}
          extra={this.renderBotoes()}
        />
        <Spin spinning={this.props.romaneio.loading}>
          <RomaneioForm id={this.props.match.params.id} />
        </Spin>
        {this.renderModals()}
      </>
    )
  }

  renderBotoes = () => {
    const entity = this.props.romaneio.data?.entity || {}
    const status = entity.status
    const permissoes = JSON.parse(localStorage.getItem('user')).permissoes

    const gerarBotao = (code, primary, onClick) => (
      <Button
        onClick={onClick}
        type={primary ? "primary" : "default"}
        className="page-header-ignored-button">
        <FormattedMessage id={code}/>
      </Button>
    );
    const gerarPopconfirm = (code, title, primary, onClick) => (
      <Popconfirm title={getMessage(title)} onConfirm={onClick}>
        {gerarBotao(code, primary, () => {})}
      </Popconfirm>
    )
    const cancelarLote = () => {
      const { cancelarRomaneioStatusRequest } = this.props
      Modal.confirm({
        title: getMessage("romaneio.dados.cancelar.titulo.label"),
        icon: <DeleteOutlined />,
        okText: getMessage("comum.sim.label"),
        cancelText: getMessage("comum.voltar.label"),
        onOk() {
          cancelarRomaneioStatusRequest(entity)
        },
        onCancel() {
        },
      })
    };
    const abrirLote = () => {
      this.props.abrirRomaneioStatusRequest(entity)
    };
    const gerarNff = () => {
      this.props.gerarNffRequest(entity.id)
    };
    const exportarRomaneio = () => {
      this.props.exportarRomaneioRequest(entity.id)
    };
    const exportarXSLX = () => {
      this.props.exportarRomaneioXlsxRequest(entity.id)
    };
    const editarLotes = () => {
      this.setState({
        lotesModalOpen: true
      })
    };
    const verificarStatusIntegracao = () => {
      this.props.verificarStatusIntegracaoRequest(entity.romaneio)
    };
    const cancelar = gerarPopconfirm("romaneio.dados.botoes.cancelar.label", "romaneio.dados.botoes.cancelar.confirmar.label", false, cancelarLote)
    const gerar = gerarPopconfirm("romaneio.dados.botoes.gerar.label", "romaneio.dados.botoes.gerar.confirmar.label", status === "ABERTO", gerarNff)
    const exportar = gerarBotao("romaneio.dados.botoes.exportar.label", status === "FECHADO" || status === "AGUARDANDO_NFF", exportarRomaneio)
    const abrir = gerarPopconfirm("romaneio.dados.botoes.abrir.label", "romaneio.dados.botoes.abrir.confirmar.label", status === "FALHA_NFF", abrirLote)
    const verificarStatus = gerarBotao("romaneio.dados.botoes.verificarStatusIntegracao.label", false, verificarStatusIntegracao)
    const editar = gerarBotao("romaneio.dados.botoes.editar.label", false, editarLotes)
    const exportarXlsx = () => {
      return <Button
        onClick={exportarXSLX}
        className="page-header-ignored-button"
      >
        <AiOutlineFileExcel style={{ marginBottom: '-2px'}} size={16}/>
      </Button>
    }
    return (
      <>
        {status === "ABERTO" && <>
          {cancelar}
          {permissoes.includes('Exportar XLSX') && exportarXlsx()}
          {exportar}
          {editar}
          {gerar}
        </>}
        {status === "AGUARDANDO_NFF" && <>
          {permissoes.includes('Exportar XLSX') && exportarXlsx()}
          {exportar}
          {verificarStatus}
        </>}
        {status === "FECHADO" && <>
          {permissoes.includes('Exportar XLSX') && exportarXlsx()}
          {exportar}
        </>}
        {status === "FALHA_NFF" && <>
          {cancelar}
          {abrir}
          {verificarStatus}
        </>}
        {status === "CANCELADO" && <>
        </>}
      </>
    )
  };

  componentDidMount() {
    this.getModel()
  }

  getModel = async () => {
    const id = this.props.match.params.id
    this.props.prepareRomaneioEditRequest(id)
  }

  renderModals() {
    return <>
      <EditarLotesModal
        modalOpen={this.state.lotesModalOpen}
        setModalOpen={(b) => this.setState({lotesModalOpen: b})}
        entity={this.props.romaneio.data?.entity || {}}
      />
    </>
  }
}

const mapStateToProps = store => ({
  romaneio: store.romaneio,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({prepareRomaneioEditRequest, abrirRomaneioStatusRequest, cancelarRomaneioStatusRequest, exportarRomaneioRequest, gerarNffRequest, verificarStatusIntegracaoRequest, exportarRomaneioXlsxRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RomaneioFormContainer))
