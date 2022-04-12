import * as React from 'react';
import {Button, Col, Modal, Row, Upload} from "antd";
import {getMessage} from "../../components/messages";
class ImportModal extends React.Component {

  render(){
    return (
      <Modal
        visible={this.props.visible}
        onCancel={() => this.props.setVisible(false)}
        width={400}
        title={getMessage("grupoLinhaProducao.import.modal.title.label")}
        footer={
          <Button onClick={() => this.props.setVisible(false)}>
            {getMessage("comum.cancelar.label")}
          </Button>
        }
      >
        <Row gutter={24}>
          <Col span={24}>
            <p>{getMessage("grupoLinhaProducao.import.modal.content.label")}</p>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={6} style={{marginRight: 48, marginLeft: 32}}>
            <Button
              href={require("../../images/modelo gldp.xls")}
            >
              {getMessage("grupoLinhaProducao.import.modal.baixar.label")}
            </Button>
          </Col>
          <Col span={6}>
            <Upload
              name="file"
              multiple={false}
              beforeUpload={this.props.addFile}
              fileList={false}
              showUploadList={false}
            >
              <Button>
                {getMessage("grupoLinhaProducao.import.modal.importar.label")}
              </Button>
            </Upload>
          </Col>
        </Row>
      </Modal>
    )
  }

}

export default ImportModal;
