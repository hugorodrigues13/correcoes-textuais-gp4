import React, {useEffect, useState} from "react";
import {Col, Form, Input, Row} from "antd";
import {injectIntl} from "react-intl";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {useDispatch} from "react-redux";
import {updateValorRequest} from "../../store/modules/PrefixoProducaoFornecedor/action";

export const FormFornecedor = ({entityInstance, getMessage, desabilitarPrefixo}) => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [prefixo, setPrefixo] = useState("");
  const [endereco, setEndereco] = useState(null);

  useEffect(() => {
    setPrefixo("");
    if (entityInstance) {
      setPrefixo(entityInstance.prefixoProducao);
      setEndereco(entityInstance.endereco);
    }
  }, [entityInstance])

  function verifyText(event) {
    let str = event.target.value.replace(/[^\w-]/ig, '');
    setPrefixo(str);
  }

  function cadastrar() {
    form.submit()
  }

  function onFinish() {
    let newValueInput = prefixo
    if(prefixo) {
      newValueInput = prefixo.toUpperCase();
    }

    dispatch(updateValorRequest({prefixoProducao: newValueInput, id: entityInstance.id, endereco: endereco}));
  }

  return (
    <>
      <CabecalhoForm
        titulo={getMessage("prefixoProducaoFornecedor.title.modal.label")}
        onBack={"/config/fornecedor"}
        onClickSalvar={cadastrar}
      />
      <Form onFinish={onFinish} layout={"vertical"} form={form}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={getMessage("prefixoProducaoFornecedor.nome.label")}
            >
              <Input
                name={"nome"}
                value={entityInstance.nome}
                disabled={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={getMessage("prefixoProducaoFornecedor.tabela.prefixoProducao.label")}
            >
              <Input
                maxLength={3}
                onChange={e => verifyText(e)}
                style={{textTransform: "uppercase"}}
                disabled={desabilitarPrefixo}
                value={prefixo}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
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
    </>
  )
}

export default injectIntl((FormFornecedor));
