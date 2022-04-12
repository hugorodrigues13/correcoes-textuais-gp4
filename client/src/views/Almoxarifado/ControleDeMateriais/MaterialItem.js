import {Button, Col, Row, Tooltip} from "antd";
import React from "react";
import moment from "moment";
import SetaItem from "../SetaItem";
import {AiOutlineCheck, BsFileEarmarkPlus, MdAddCircleOutline} from "react-icons/all";
import GeraXLS from "../../../components/GeraXLS";
import Alert from "react-s-alert";
import {gerarDadosXls, getCorSeta, getCorTexto} from "../commons";
import {getMessage} from "../../../components/messages";
import MaterialItemModal from "./MaterialItemModal";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";

class MaterialItem extends React.Component {

  state = {
    openModal: false,
  }

  render(){
    return (
      <Col span={4}>
        {this.renderSeta()}
        {this.renderButtons()}
        {this.renderModal()}
      </Col>
    )
  }

  renderSeta() {
    let data = this.props.item.previsaoEntrega ? moment(this.props.item.previsaoEntrega, "DD/MM/YYYY HH:mm").format("D MMMM HH:mm") : "";
    const corSeta = getCorSeta(this.props.item.previsaoEntrega, this.props.almoxarifado.data.limiteSeparacaoEmHoras)
    const corTexto = getCorTexto(corSeta)
    return <SetaItem
      id={this.props.item.id}
      corSeta={corSeta}
      corTexto={corTexto}
      data={data}
      texto={this.props.item.recursoNome}
      tooltipTexto={"almoxarifado.tooltips.recurso.label"}
      tooltipData={"almoxarifado.tooltips.dataPrevisaoEntrega.label"}
    />
  }

  renderButtons() {
    return (
      <Row style={{ marginTop: '-25px', justifyContent: "space-evenly", width: '95%'}}>
        <Col span={4}>
          <Tooltip placement="top" title={getMessage("almoxarifado.materiasPrimas.label")}>
            <Button className="ghost-button" onClick={this.openModal}>
              <MdAddCircleOutline size={20}/>
            </Button>
          </Tooltip>
        </Col>
        <Col span={4}>
          <Tooltip placement="top" title={getMessage("almoxarifado.exportar.label")}>
            {this.props.item.itens && this.props.item.itens.length !== 0
              ? <GeraXLS
                nomeFolha={this.getMessage("almoxarifado.controleMateriais.excel.tabela.label", {recurso: this.props.item.recursoNome})}
                nomeArquivo={this.getMessage("almoxarifado.controleMateriais.excel.arquivo.label", {recurso: this.props.item.recursoNome})}
                dados={gerarDadosXls(this.props.item.itens)}
                element={
                  <Button className="ghost-button">
                    <BsFileEarmarkPlus size={20}/>
                  </Button>
                }
              />
              : <Button className="ghost-button" onClick={this.avisarNaoTemMp}>
                <BsFileEarmarkPlus size={20}/>
              </Button>
            }
          </Tooltip>
        </Col>
      </Row>
    );
  };

  renderModal = () => (
    <MaterialItemModal
      open={this.state.openModal}
      setOpen={(b) => this.setState({openModal: b})}
      item={this.props.item}
    />
  );

  openModal = () => {
    this.setState({openModal: true})
  };

  avisarNaoTemMp = () => {
    Alert.error(getMessage("almoxarifado.excel.semmp.label"))
  };

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  };

}
const mapStateToProps = store => ({
  almoxarifado: store.almoxarifado,
  requestManager: store.requestManager
});
export default injectIntl(connect(mapStateToProps)(MaterialItem))
