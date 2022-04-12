import React, {useEffect, useState} from "react";
import {Row, Form, Col, Spin} from "antd";
import { InputAnt } from "../../components/form/Input";
import { SwitchAnt } from "../../components/form/Switch";
import {useDispatch, useSelector} from "react-redux";
import * as ACOES from "../../store/modules/User/action";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import { SelectAnt } from "../../components/form/SelectAnt";

export const PerfilForm = ( props => {
  const [form] = Form.useForm()
  const { getMessage, setEntityInstance, listPlanejadores, entityInstance } = props;
  const [confirmDirty, setConfirmDirty] = useState(false);
  const requestManager = useSelector(state => state.requestManager);
  const dispatch = useDispatch();
  const loading = requestManager.loading;
  const [isRequiredPassword, setIsRequiredPassword] = useState(false)

  const linguagens = [{key: 'pt-BR', value: 'usuario.linguagem.portugues.label'},
    {key: 'en-US', value: 'usuario.linguagem.ingles.label'},
    {key: 'es-ES', value: 'usuario.linguagem.espanhol.label'}]
    .map(l => ({...l, value: getMessage(l.value)}));

  useEffect(() => {
    if(entityInstance) {
      form.setFieldsValue({
        fullname: entityInstance.fullname,
        email: entityInstance.email,
        alteraSenha: entityInstance.alteraSenha,
        planejadores:  entityInstance.planejadores || [],
        linguagem: entityInstance.linguagem,
      });
    }
  }, [entityInstance]);

  useEffect(() => {
    document.title = getMessage("usuario.logado.label");
  },[])

  return (
    <React.Fragment>
      <CabecalhoForm
        titulo={getMessage("usuario.logado.label")}
        onBack={"/"}
        onClickSalvar={handleSubmit}
      />
      <Spin spinning={loading} >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={24}>
            <Col span={12}>
              {/* Nome completo */}
              <InputAnt
                label={getMessage("usuario.nomeCompleto.label")}
                nomeAtributo="fullname"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired
              />
            </Col>
            <Col span={12}>
              {/* E-mail */}
              <InputAnt
                label={getMessage("usuario.email.label")}
                nomeAtributo="email"
              />
            </Col>
            <Col span={3}>
              <SwitchAnt
                label={getMessage("usuario.alterarSenha.label")}
                onChange={ limparCamposSenha }
                nomeAtributo={"alteraSenha"}
              />
            </Col>
            <Col span={7}>
              {/* Senha atual */}
              <InputAnt
                label={getMessage("usuario.senhaantiga.label")}
                nomeAtributo="oldpassword"
                message={getMessage("comum.obrigatorio.campo.message")}
                disabled={!isRequiredPassword}
                type="password"
                isRequired={isRequiredPassword}
              />
            </Col>
            <Col span={7}>
              {/* Nova senha */}
              <InputAnt
                label={getMessage("usuario.senhanova.label")}
                nomeAtributo="password"
                message={getMessage("comum.obrigatorio.campo.message")}
                disabled={!isRequiredPassword}
                validator={validateToNextPassword}
                type="password"
                handleConfirmBlur={handleConfirmBlur}
                isRequired={isRequiredPassword}
              />
            </Col>
            <Col span={7}>
              {/* Repetição da nova senha */}
              <InputAnt
                label={getMessage("usuario.senhaRepete.placeholder.label")}
                nomeAtributo="confirm"
                message={getMessage("usuario.senha.confirmacao.label")}
                disabled={!isRequiredPassword}
                validator={compareToFirstPassword}
                type="password"
                isRequired={isRequiredPassword}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              {/* Planejadores */}
              <SelectAnt
                label={getMessage("usuario.planejadores.label")}
                list={listPlanejadores || []}
                modo="multiple"
                nomeAtributo="planejadores"
              />
            </Col>
            <Col span={8}>
              <SelectAnt
                label={getMessage("usuario.linguagem.label")}
                list={linguagens}
                nomeAtributo="linguagem"
              />
            </Col>
          </Row>
        </Form>
      </Spin>
    </React.Fragment>
  );

  function limparCamposSenha( isChecked ) {
    if( !isChecked ) { form.resetFields(["oldpassword","password","confirm"]) }
    setIsRequiredPassword(isChecked)
  }

  function handleConfirmBlur(e) {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  }

  function compareToFirstPassword(_, value) {
    let newPassword = form.getFieldValue("password");
    let confirmPassword = value;
    if (newPassword !== confirmPassword) {
      return Promise.reject(getMessage("usuario.senha.naoConfere.label"));
    } else {
      return Promise.resolve();
    }
  }

  function validateToNextPassword(_, value) {
    let oldpassword = form.getFieldValue('oldpassword');
    let newpassword = form.getFieldValue('password');
    let isAlterarSenha = form.getFieldValue("alteraSenha");

    if(isAlterarSenha) {
      if (oldpassword === newpassword) {
        return Promise.reject(getMessage("usuario.senha.novaSenhaIgualAtual.label"));
      } else if (value && confirmDirty) {
        return Promise.resolve()
      }
    }
    return Promise.resolve()
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.submit()
  }

  function onFinish(values) {
    dispatch(
      ACOES.alterarDadosUsuarioRequest({ id: entityInstance.id, ...values })
    );
    setEntityInstance({
      ...values,
      alteraSenha: false,
      id: entityInstance.id
    });
  }
});
