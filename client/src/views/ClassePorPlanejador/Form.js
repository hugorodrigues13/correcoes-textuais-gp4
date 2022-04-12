import React, {useEffect} from 'react';
import {Form, Col, Row, Spin} from "antd";
import Alert from "react-s-alert";
import {useDispatch, useSelector} from "react-redux";
import {InputAnt} from "../../components/form/Input";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {retornaValidateStatus} from "../../utils/formatador";
import {salvarRequest, editarRequest} from "../../store/modules/ClassePorPlanejador/action";
import { getMessage } from "../../components/messages";
import {SelectAnt} from "../../components/form/SelectAnt";

const ClassePorPlanejadorForm = (props => {
  const [form] = Form.useForm();
  const {id, error, entityInstance, setEntityInstance, planejadores} = props;
  const requestManager = useSelector(state => state.requestManager);
  const dispatch = useDispatch();
  const loading = requestManager.loading;

  useEffect( () => {
    form.setFieldsValue( {
    classeContabil: entityInstance.classeContabil,
    planejadores: entityInstance.planejadores || [],
    })
  }, [entityInstance]);

  return(
    <Col>
      <CabecalhoForm
       isEdicao={id !== null}
       titulo={id ? getMessage("classePorPlanejador.editar.label") : getMessage("classePorPlanejador.cadastro.label")}
        onBack={"/config/classePorPlanejador"}
        onClickSalvar={handleSubmit}
        onclickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              {/* Classe Contabil */}
              <InputAnt
                label={getMessage("classePorPlanejador.classeContabil.label")}
                nomeAtributo={"classeContabil"}
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(error, "classeContabil")}
              />
            </Col>
            <Col span={12}>
              {/* Planejadores */}
              <SelectAnt
                label={getMessage("usuario.planejadores.label")}
                list={(planejadores || []).map((item, index)=>({key: item, value: item}))}
                modo="multiple"
                nomeAtributo="planejadores"
                isRequired={true}
                message={getMessage("comum.obrigatorio.campo.message")}
              />
            </Col>
          </Row>
        </Form>
      </Spin>
    </Col>
  );


  function handleSubmit( e ) {
    e.preventDefault();
    form.submit()
  }

  function onFinish(values) {
    if (values.classeContabil && values.classeContabil.length < 11) {
      setEntityInstance(values);
      if (id) {
        values.id = id;
        dispatch(editarRequest(values));
      } else {
        dispatch(salvarRequest(values));
      }
    } else {
      Alert.error(getMessage("classePorPlanejador.error.classeContabil"));
    }
  }

  function handleReset() {
    form.resetFields();
  }
});

export default ClassePorPlanejadorForm;
