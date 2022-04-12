import React, { useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "antd";
import { injectIntl } from "react-intl";
import { SelectAnt } from "../../components/form/SelectAnt";
import { useDispatch } from "react-redux";

function ModalCategory({
                         visible,
                         entidade,
                         handleOk,
                         handleCancel,
                         loading,
                         intl,
                         onSave,
                         motivoParada,
                         listMotivo,
                       }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  return (
    <Modal
      visible={visible}
      title={getMessage("paradas.title.modal.label")}
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
      <Form onFinish={onFinish} layout={"vertical"} form={form}>
      <Row gutter={24}>
        <Col md={24}>
        <SelectAnt
          label={getMessage("paradas.tabela.motivo.label")}
          nomeAtributo="motivo"
          message={getMessage("comum.obrigatorio.campo.message")}
          isRequired
          list={listMotivo ? listMotivo.entities ? listMotivo.entities : [] : []}
        />
        </Col>
      </Row>
      </Form>
    </Modal>
  );

  function getMessage(id) {
    return intl.formatMessage({ id });
  }

  function cadastrar() {
    form.submit()
  }

  function onFinish(values) {
    onSave({...values, id: entidade.id});
  }
}



export default injectIntl((ModalCategory));
