import * as React from 'react';
import {Button, Col, Modal, Row} from "antd";
import TabelaAnt from "../../../components/tabelaAnt/Tabela";
import {getMessage} from "../../../components/messages";
import {injectIntl} from "react-intl";

class MaterialItemModal extends React.Component {

  render(){
    return (
      <Modal
        visible={this.props.open}
        onCancel={() => this.props.setOpen(false)}
        width={980}
        footer={
          <Button type="primary" onClick={() => this.props.setOpen(false)}>
            {getMessage("comum.voltar.label")}
          </Button>
        }
        title={
          <>{this.getMessage("almoxarifado.controleMateriais.model.title.label", {recurso: this.props.item.recursoNome, chave: this.props.item.chavePrimaria})}</>
        }
      >
        <div className="almoxarifado-modal">
          <Row gutter={24}>
            <Col span={24}>
              <strong>{getMessage("almoxarifado.modal.local.label")}</strong>: {this.props.item.linha}
            </Col>
          </Row>
          <Row gutter={24} className="almoxarifado-row-table">
            <Col span={24}>
              <TabelaAnt configTable={this.configTable()}/>
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }

  configTable(){
    return {
      i18n: "almoxarifado.tabela.",
      size: "small",
      columns: [
        {
          key: "codigoProduto",
        },
        {
          key: "descricaoProduto",
        },
        {
          key: "quantidade",
        },
      ],
      data: this.props.item.itens,
    }
  }

  getMessage = (id, argumentos) => {
    return this.props.intl.formatMessage({id: id}, {...argumentos})
  };

}
export default injectIntl(MaterialItemModal)
