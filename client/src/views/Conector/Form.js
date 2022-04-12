import React, {useEffect} from 'react';
import {Form, Col, Row, Spin, InputNumber} from "antd";
import {useDispatch, useSelector} from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {InputAnt} from "../../components/form/Input";
import {conectorEditarRequest, conectorSalvarRequest} from "../../store/modules/Conector/action";

export const ConectorForm = (props => {
  const dispatch = useDispatch();
  const [form] = Form.useForm()
  const {getMessage, id, entityInstance, error: errors} = props;
  const requestManager = useSelector(state => state.requestManager);
  const loading = requestManager.loading;

  useEffect(() => {
    form.setFieldsValue({
      descricao:  entityInstance.descricao,
      linhaForecast:  entityInstance.linhaForecast,
      formacao:  entityInstance.formacao,
    });
  }, [entityInstance]);

  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("conector.editar.label") : getMessage("conector.cadastro.label")}
        onBack={"/config/conector"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading} >
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={8}>
              {/*Descrição*/}
              <InputAnt
                 label={getMessage("conector.descricao.label")}
                 nomeAtributo="descricao"
                 message={getMessage("comum.obrigatorio.campo.message")}
                 isRequired={true}
               />
            </Col>
            <Col span={8}>
              {/* Linha Forecast */}
              <InputAnt
                label={getMessage("conector.linhaForecast.label")}
                nomeAtributo="linhaForecast"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
              />
            </Col>
            <Col span={8}>
              {/* Formação */}
              <Form.Item name="formacao" label={getMessage("conector.formacao.label")}
              rules={[{required: true, message: getMessage("comum.obrigatorio.campo.message")}]}>
                <InputNumber size="large" min={1} />

              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Col>
  );


  async function handleSubmit(e) {
    e.preventDefault();
    await form.submit()
  }

  function handleReset() {
    form.resetFields();
  }

  function onFinish(values) {
    if (id) {
      values.id = id;
      dispatch(conectorEditarRequest(values));
    } else {
      dispatch(conectorSalvarRequest(values));
    }
  }
})

export default ConectorForm;
