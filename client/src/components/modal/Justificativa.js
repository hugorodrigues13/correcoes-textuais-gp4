import React from "react";
import { Modal, Button, Form, Row } from "antd";
import { injectIntl } from "react-intl";
import { TextAreaAnt } from "../../components/form/TextArea/index";

function ModalJustificativa({
  visible,
  handleCancel,
  loading,
  intl,
  form,
  entidade,
  onSave,
  message
}) {
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={visible}
      title={message ? message : getMessage("comum.justificativa.label")}
      onOk={cadastrar}
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
          onClick={cadastrar}
        >
          {getMessage("comum.salvar.label")}
        </Button>
      ]}
    >
      <Row>
        <TextAreaAnt
          label={getMessage("sequenciaDeCores.justificativa.label")}
          nomeAtributo="justificativa"
          message={getMessage("comum.obrigatorio.campo.message")}
          getFieldDecorator={getFieldDecorator}
          isRequired
        />
      </Row>
    </Modal>
  );

  function getMessage(id) {
    return intl.formatMessage({ id });
  }

  function cadastrar() {
    form.validateFields((err, values) => {
      if (!err) {
        onSave({
          ...values,
          id: entidade.id,
          justificativa: values.justificativa
        });
      }
    });
  }
}

export default injectIntl(
  Form.create({
    name: "modal_justificativa",
    mapPropsToFields(props) {
      return {
        valor: Form.createFormField({
          value: props.entidade ? props.entidade.valor : ""
        })
      };
    }
  })(ModalJustificativa)
);
