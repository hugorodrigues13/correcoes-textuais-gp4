import React, {useEffect, useState} from 'react';
import {Form, Col, Row, Spin} from "antd";
import Alert from "react-s-alert";
import {useDispatch, useSelector} from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import TreeView from "react-simple-jstree";
import {InputAnt} from "../../components/form/Input";
import {perfilEditarRequest, perfilSalvarRequest} from "../../store/modules/Perfil/action";
import {retornaValidateStatus} from "../../utils/formatador";

export const PerfilForm = (props => {
  const [form] = Form.useForm()
  const {listPermissoes, getMessage, id, setEntityInstance, entityInstance, error: errors} = props;
  const dispatch = useDispatch();
  const [selectedPermissoes, setSelectedPermissoes] = useState([]);
  const requestManager = useSelector(state => state.requestManager);
  const loading = requestManager.loading;

  useEffect(() => {
    form.setFieldsValue({
      descricao:  entityInstance.descricao,
      nome:  entityInstance.nome,
      permissoes:  entityInstance.permissoes,
    });
  }, [entityInstance]);

  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("perfil.editar.label") : getMessage("perfil.cadastro.label")}
        onBack={"/seg/perfil"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              {/* Role */}
              <InputAnt
                label={getMessage("perfil.nome.label")}
                nomeAtributo="nome"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(errors, "nome")}
              />
            </Col>
            <Col span={12}>
              {/* Descricao */}
              <InputAnt
                type="email"
                label={getMessage("perfil.descricao.label")}
                nomeAtributo="descricao"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
              />
            </Col>
          </Row>
          {listPermissoes.core.data && listPermissoes.core.data.length > 0 && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item rules={[{
                  required: false
                },
                  {
                    validator: callbackPermissao
                  }]} label={getMessage("role.permissoes.label")}>
                    <TreeView
                      treeData={listPermissoes || {}}
                      onChange={handleTreeChange}
                    />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Spin>
    </Col>
  );

  function handleSubmit(e) {
    e.preventDefault();
    form.submit()
  }

  function onFinish(values) {
    if (selectedPermissoes.length > 0) {
      values.permissoes = selectedPermissoes;
      setEntityInstance(values);
      if (id) {
        values.id = id;
        dispatch(perfilEditarRequest(values));
      } else {
        dispatch(perfilSalvarRequest(values));
      }
    } else {
      callbackPermissao();
    }
  }

  function callbackPermissao(rule, value, callback) {
    if (!selectedPermissoes.length) {
      Alert.error(getMessage("perfil.permissoes.required.message"));
    } else {
      callback();
    }
  }

  function handleReset() {
    form.resetFields();
  }
  function handleTreeChange(e, data) {
    setSelectedPermissoes(data.selected);
  }

});
