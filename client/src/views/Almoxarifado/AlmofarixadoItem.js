import React, {Component} from 'react';
import {Button, Col, Modal, Popconfirm, Row, Tooltip} from "antd";
import "./style.css";
import {
  AiOutlineCheck,
  BsFileEarmarkPlus,
  MdAddCircleOutline,
  AiOutlineClockCircle
} from "react-icons/all";
import {bindActionCreators} from "redux";
import {listAlmoxarifadoRequest, setOpenAlmoxarifadoRequest} from "../../store/modules/Almoxarifado/action";
import {connect} from "react-redux";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import GeraXLS from "../../components/GeraXLS";
import Alert from "react-s-alert";
import moment from "moment";
import SetaItem from "./SetaItem";
import {gerarDadosXls, getCorSeta, getCorTexto, getCorTextoSecundaria} from "./commons";
import JustificativaPopover from "../Serial/JustificativaPopover";
import {InputAnt} from "../../components/form/Input";

class AlmofarixadoItem extends Component {

  state = {
    modalOpen: false,
    justificativaModalOpen: false,
    justificativa: null,
  }

  render() {
    return (
      <>
        <Col span={4}>
          {this.renderSeta()}
          {this.renderButtons()}
          {this.renderModal()}
          {this.renderJustificativaModal()}
        </Col>
      </>

    );
  }


  renderSeta() {
    let data = this.props.item.dataPrevisaoSeparacao ? moment(this.props.item.dataPrevisaoSeparacao, "DD/MM/YYYY HH:mm").format("D MMM HH:mm") : "";
    const corSeta = getCorSeta(this.props.item.dataPrevisaoSeparacao, this.props.almoxarifado.data.limiteSeparacaoEmHoras)
    const corTexto = getCorTexto(corSeta);
    const corTextoSecundaria = getCorTextoSecundaria(corSeta);
    return <SetaItem
      id={this.props.item.id}
      corSeta={corSeta}
      corTexto={corTexto}
      data={data}
      corSecundariaTexto={corTextoSecundaria}
      texto={this.props.item.codigo}
      ordemProducao={this.props.item.ordemProducao}
      dataPrevisaoFinalizacao={this.props.item.dataPrevisaoFinalizacao}
      tooltipTexto={"almoxarifado.tooltips.ordemFabricacao.label"}
      tooltipData={"almoxarifado.tooltips.dataPrevisaoSeparacao.label"}
    />
  }

  renderButtons() {
    return (
      <Row style={{ marginTop: '-25px', justifyContent: "space-evenly", width: '95%'}}>
        <Col span={4}>
          <Popconfirm placement="top" title={this.getMessage("almoxarifado.liberar.label")} onConfirm={this.setEmAberto}>
            <Button className="ghost-button" style={{color: "green"}}>
              <AiOutlineCheck size={20}/>
            </Button>
          </Popconfirm>
        </Col>
        <Col span={4}>
          <Tooltip placement="top" title={this.getMessage("almoxarifado.materiasPrimas.label")}>
            <Button className="ghost-button" onClick={this.openModal}>
              <MdAddCircleOutline size={20}/>
            </Button>
          </Tooltip>
        </Col>
        <Col span={4}>
          {this.props.item.materiasPrimas && this.props.item.materiasPrimas.length !== 0
            ? <GeraXLS
              nomeFolha={this.getMessage("almoxarifado.excel.tabela.label", {ordemDeFabricacao: this.props.item.codigo})}
              nomeArquivo={this.getMessage("almoxarifado.excel.arquivo.label", {ordemDeFabricacao: this.props.item.codigo})}
              dados={gerarDadosXls(this.props.item.materiasPrimas)}
              element={
                <Tooltip placement="top" title={this.getMessage("almoxarifado.exportar.label")}>
                  <Button className="ghost-button">
                    <BsFileEarmarkPlus size={20}/>
                  </Button>
                </Tooltip>
              }
            />
            : <Tooltip placement="top" title={this.getMessage("almoxarifado.exportar.label")}>
              <Button className="ghost-button" onClick={this.avisarNaoTemMp}>
                <BsFileEarmarkPlus size={20}/>
              </Button>
            </Tooltip>
          }
        </Col>
      </Row>
    );
  };

  avisarNaoTemMp = () => {
    Alert.error(this.getMessage("almoxarifado.excel.semmp.label"), {})
  };

  setEmAberto = () => {
    if (this.props.item.primeiroDoSequenciamento){
      this.props.setOpenAlmoxarifadoRequest(this.props.item.id)
    } else {
      this.setState({justificativaModalOpen: true})
    }
  };

  openModal = () => {
    this.setState({modalOpen: true})
  };

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  };

  renderModal = () => {
    const configTable = () => {
      return {
        i18n: "almoxarifado.tabela.",
        size: "small",
        columns: [
          {
            key: "codigoProduto",
            isSorteable: false,
          },
          {
            key: "descricaoProduto",
            isSorteable: false,
          },
          {
            key: "quantidade",
            isSorteable: false,
          },
        ],
        data: this.props.item.materiasPrimas,
      }
    }
    return (
      <Modal
        visible={this.state.modalOpen}
        onCancel={() => this.setState({modalOpen: false})}
        width={980}
        footer={
          <Button type="primary" onClick={() => this.setState({modalOpen: false})}>
            {this.getMessage("comum.voltar.label")}
          </Button>
        }
        title={
              <>{this.getMessage("almoxarifado.modal.listamateriaprima.label", {ordemDeFabricacao: this.props.item.codigo})}</>
        }
      >
        <div className="almoxarifado-modal">
          <Row gutter={24}>
            <Col span={24}>
              <strong>{this.getMessage("almoxarifado.modal.local.label")}</strong>: {this.props.item.linha ? this.props.item.linha : this.props.item.grupoLinha}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <strong>{this.getMessage("almoxarifado.modal.produto.label")}</strong>: {this.props.item.codigoProduto} - {this.props.item.descricaoProduto}
            </Col>
          </Row>
          <Row gutter={24} className="almoxarifado-row-table">
            <Col span={24}>
              <TabelaAnt configTable={configTable()}/>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  };

  renderJustificativaModal = () => {
    const liberar = () => {
      this.props.setOpenAlmoxarifadoRequest(this.props.item.id, this.state.justificativa)
      this.setState({
        justificativa: null,
        justificativaModalOpen: false
      })
    }
    return (
      <Modal
        visible={this.state.justificativaModalOpen}
        onCancel={() => this.setState({justificativaModalOpen: false})}
        title={this.getMessage("almoxarifado.justificativa.modal.title.label", {of: this.props.item.codigo})}
        okText={this.getMessage("almoxarifado.justificativa.modal.liberar.label")}
        onOk={liberar}
        okButtonProps={{disabled: !this.state.justificativa}}
      >
        <InputAnt
          nomeAtributo={"justificativa"}
          value={this.state.justificativa}
          placeholder={this.getMessage("almoxarifado.justificativa.modal.justificativa.label")}
          onChange={(e) => this.setState({justificativa: e.target.value})}
        />
      </Modal>
    )
  }


}

const mapStateToProps = store => ({
  almoxarifado: store.almoxarifado,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({listAlmoxarifadoRequest, setOpenAlmoxarifadoRequest}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AlmofarixadoItem)

