import React, {useEffect} from "react";
import {Modal, Button, Form, Row, Col} from "antd";
import { injectIntl } from "react-intl";
import {InputAnt} from "../../components/form/Input";

function ModalCategory({
                         visible,
                         handleOk,
                         handleCancel,
                         loading,
                         intl,
                         entidade,
                         onSave
                       }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if(entidade && entidade.valor) {
      form.setFieldsValue({
        valor: entidade.valor
      })
    }
  }, [entidade])

  return (
    <Modal
      visible={visible}
      title={getMessage("confGeral.title.modal.label")}
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
        <InputAnt
          label={getMessage("confGeral.tabela.valor.label")}
          nomeAtributo="valor"
          message={getMessage("comum.obrigatorio.campo.message")}
          isRequired
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
