import React from "react";
import {Modal, Button, Form, Row, Alert} from "antd";
import { injectIntl } from "react-intl";

function ConfirmacaoLinguagem({
  visible,
  handleOk,
  handleCancel,
  loading,
  intl,
}) {
  return (
    <Modal
      visible={visible}
      title={getMessage("idioma.navbar.confirmacao.titulo.label")}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {getMessage("comum.cancelar.label")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          {getMessage("comum.sim.label")}
        </Button>
      ]}
    >
      <Row gutter={24}>
        <Alert
          message={getMessage("idioma.navbar.confirmacao.mensagem.label")}
          type="warning"
          showIcon
        />
      </Row>
    </Modal>
  );

  function getMessage(id) {
    return intl.formatMessage({ id });
  }
}

export default injectIntl(ConfirmacaoLinguagem);
