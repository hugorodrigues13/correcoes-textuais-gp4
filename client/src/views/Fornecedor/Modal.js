import React, {useEffect, useState} from "react";
import {Modal, Button, Form, Row, Col, Input} from "antd";
import { injectIntl } from "react-intl";

function ModalCategory({
                         visible,
                         handleCancel,
                         loading,
                         intl,
                         entidade,
                         onSave,
                       }) {

  const [form] = Form.useForm()
  const [prefixo, setPrefixo] = useState("");
  const [endereco, setEndereco] = useState(null);

  useEffect(() => {
    setPrefixo("");
    if(entidade && entidade.prefixoProducao) {
      setPrefixo(entidade.prefixoProducao);
      setEndereco(entidade.endereco ? entidade.endereco : null);
    }
  }, [entidade])

  return (
    <Modal
      visible={visible}
      title={getMessage("prefixoProducaoFornecedor.title.modal.label")}
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
      <Form onFinish={onFinish} layout={"vertical"} form={form} >
      <Row gutter={24}>
        <Col md={24}>
          <Form.Item
            label={getMessage("prefixoProducaoFornecedor.tabela.prefixoProducao.label")}
          >
            <Input
              maxLength = {3}
              onChange={e => verifyText(e)}
              style={{textTransform: "uppercase"}}
              value={prefixo}
            />
          </Form.Item>
        </Col>
        <Col md={24}>
          <Form.Item
            label={getMessage("prefixoProducaoFornecedor.endereco.label")}
          >
            <Input
              name={"endereco"}
              onChange={e => setEndereco(e.target.value)}
              value={endereco}
            />
          </Form.Item>
        </Col>
      </Row>
      </Form>
    </Modal>
  );

  function verifyText(event){
    let str = event.target.value.replace(/[^\w-]/ig, '');
    setEndereco(str);
  }

  function getMessage(id) {
    return intl.formatMessage({ id });
  }

  function cadastrar() {
    form.submit()
  }

  function onFinish() {
    let newValueInput = prefixo.toUpperCase();
    onSave({prefixoProducao: newValueInput, id: entidade.id, endereco: endereco});
  }
}

export default injectIntl((ModalCategory));
