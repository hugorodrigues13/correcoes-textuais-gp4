import React, {useEffect, useState} from "react";
import {Col, Form, Input, Row, Switch, Transfer, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {InputAnt} from "../../components/form/Input";
import {retornaValidateStatus} from "../../utils/formatador";
import {SelectAnt} from "../../components/form/SelectAnt";
import {SwitchAnt} from "../../components/form/Switch";
import * as ACOES from "../../store/modules/User/action";

export const UserForm = (props => {
  const [form] = Form.useForm()

  const {id, getMessage, listPerfil, listAcessos, listPlanejadores, errors, entityInstance, setEntityInstance} = props;
  const dispatch = useDispatch();
  const [targetKeys, setTargetKeys] = useState([]);
  const [targetKeysAcessos, setTargetKeysAcessos] = useState([]);
  const [alteraSenha, setAlteraSenha] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedKeysAcessos, setSelectedKeysAcessos] = useState([]);
  const isRequiredPassword = !id ? true : alteraSenha;
  const [confirmDirty, setConfirmDirty] = useState(false);
  const requestManager = useSelector(state => state.requestManager);
  const loading = requestManager.loading;

  const linguagens = [{key: 'pt-BR', value: 'usuario.linguagem.portugues.label'},
                      {key: 'en-US', value: 'usuario.linguagem.ingles.label'},
                      {key: 'es-ES', value: 'usuario.linguagem.espanhol.label'}]
                      .map(l => ({...l, value: getMessage(l.value)}));

  useEffect(() => {
    form.setFieldsValue({
      fullname:  entityInstance.fullname,
      email:  entityInstance.email,
      username:  entityInstance.username,
      valor:  entityInstance.valor,
      enabled:  entityInstance.enabled,
      matricula: entityInstance.matricula,
      perfil:  entityInstance.perfil || [],
      planejadores:  entityInstance.planejadores || [],
      token: entityInstance.token,
      linguagem: entityInstance.linguagem,
      acessos:  entityInstance.acessos || [],
    });

    form.resetFields(["password", "confirm"])

    setAlteraSenha(false);
    setTargetKeys(getTargetKeysOrdenada(listPerfil, entityInstance.perfil || []));
    setTargetKeysAcessos(getTargetKeysOrdenada(listAcessos, entityInstance.acessos || []));

  }, [entityInstance]);
// targetKeys, setTargetKeysAcessos


  return(
    <React.Fragment>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("usuario.editar.label") : getMessage("usuario.cadastro.label")}
        onBack={"/seg/user"}
        onClickSalvar={handleClickSalvar}
        onClickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} onFinish={handleSubmit} form={form}>
          <Row gutter={24}>
            <Col span={8}>
              {/* Nome Completo */}
              <InputAnt
                label={getMessage("usuario.nomeCompleto.label")}
                nomeAtributo="fullname"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
              />
            </Col>
            <Col span={8}>
              {/* Email */}
              <Form.Item label={"Email"} name={"email"} rules={[
                    {
                      type: "email",
                      message: getMessage("usuario.email.invalid")
                    }
                  ]
                } ><Input size={"large"} type="email" />
              </Form.Item>
            </Col>
            <Col span={8}>
              {/* Username */}
              <InputAnt
                label={getMessage("usuario.nomeDeUsuario.label")}
                nomeAtributo="username"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                disabled={!!id}
                validateStatus={retornaValidateStatus(errors, "username")}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              {/*Password*/}
              <Form.Item name={"matricula"} label={getMessage("usuario.matricula.label")} hasFeedback rules={[
                {
                  required: false
                }
              ]
              } ><Input size={"large"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              {/*Password*/}
              <Form.Item name={"password"} label={getMessage("usuario.senha.label")} hasFeedback rules={[
                {
                  required: isRequiredPassword,
                  message: getMessage("comum.obrigatorio.campo.message")
                }
              ]
              } ><Input.Password size={"large"} disabled={!isRequiredPassword} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={"confirm"}
                label={getMessage("usuario.senhaRepete.placeholder.label")}
                hasFeedback rules={[
                {
                  required: isRequiredPassword,
                  message: getMessage("usuario.senha.confirmacao.label")
                },
                {
                  validator: compareToFirstPassword
                }
              ]
              }>
                <Input.Password
                  size={"large"}
                  disabled={!isRequiredPassword}
                  onBlur={handleConfirmBlur}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={id ? 8 : 12}>
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
            <>
              <Col span={4}>
                <SwitchAnt
                  className='align-right'
                  label={getMessage("usuario.ativar.label")}
                  nomeAtributo={"enabled"}
                />
              </Col>

              {id && (
                <Col span={4}>
                  <Form.Item className="align-right" disable={true} name={"alteraSenha"} label={getMessage("usuario.alterarSenha.label")}>
                    <Switch
                      checked={alteraSenha}
                      onChange={() => {
                        setAlteraSenha(!alteraSenha);
                        if(!alteraSenha ){
                          form.resetFields(["password", "confirm"]);
                        }
                      }} />
                  </Form.Item>
                </Col>
              )}
            </>
          </Row>
          <Row gutter={24}>
            {/* Perfis */}
            <Col span={24}>
              <Form.Item name={"perfil"} label={getMessage("usuario.perfil.label")} rules={[
                    {
                      required: true,
                      message: getMessage("usuario.perfil.requerid.label")
                    }
                  ]
                }>
                  <Transfer
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    dataSource={ordenarItems(listPerfil)}
                    listStyle={{width: "100%"}}
                    locale={{
                      itemUnit: "",
                      itemsUnit: "",
                      notFoundContent: "",
                      selectAll: getMessage("defeito.grupoRecurso.transferOption.selectAll.label"),
                      selectCurrent: getMessage("defeito.grupoRecurso.transferOption.selectCurrent.label"),
                      selectInvert: getMessage("defeito.grupoRecurso.transferOption.selectInvert.label"),
                    }}
                    titles={["", getMessage("comum.selecionados.label")]}
                    render={item => `${item.name} - ${item.descricao}`}
                    onChange={(nextTargetKeys, direction, moveKeys) => {
                      handleChange(setTargetKeys, listPerfil, nextTargetKeys, direction, moveKeys)
                    }}
                    onSelectChange={(sourceSelectedKeys, targetSelectedKeys) =>
                      handleSelectChange(setSelectedKeys, sourceSelectedKeys, targetSelectedKeys )}
                  />
              </Form.Item>
            </Col>
          </Row>
          {/* Acessos */}
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name={"acessos"} label={getMessage("usuario.acessos.label")} rules={[
                {
                  required: true,
                  message: getMessage("usuario.acessos.required.label")
                }
              ]
              }>
                <Transfer
                  targetKeys={targetKeysAcessos}
                  selectedKeys={selectedKeysAcessos}
                  dataSource={ordenarItems(listAcessos)}
                  listStyle={{width: "100%"}}
                  locale={{
                    itemUnit: "",
                    itemsUnit: "",
                    notFoundContent: "",
                    selectAll: getMessage("defeito.grupoRecurso.transferOption.selectAll.label"),
                    selectCurrent: getMessage("defeito.grupoRecurso.transferOption.selectCurrent.label"),
                    selectInvert: getMessage("defeito.grupoRecurso.transferOption.selectInvert.label"),
                  }}
                  titles={["", getMessage("comum.selecionados.label")]}
                  render={item => item.value}
                  onChange={(nextTargetKeys, direction, moveKeys) => {
                    handleChange(setTargetKeysAcessos, listAcessos, nextTargetKeys, direction, moveKeys)
                  }}
                  onSelectChange={(sourceSelectedKeys, targetSelectedKeys) =>
                    handleSelectChange(setSelectedKeysAcessos, sourceSelectedKeys, targetSelectedKeys )}
                />
              </Form.Item>
            </Col>
          </Row>
          {
            entityInstance.id && (<Row gutter={24}>
              <Col span={24}>
                <Form.Item name={"token"} label={getMessage("usuario.token.label")}>
                  <Input size={"large"} disabled />
                </Form.Item>
              </Col>
            </Row>)
          }
        </Form>
      </Spin>
    </React.Fragment>
  );

  function handleClickSalvar(e) {
    e.preventDefault();

    form.submit()
  }

  function handleSubmit(values) {
    if (id) {
      values.id = id;
      dispatch(ACOES.editarRequest(values));
    } else {
      dispatch(ACOES.salvarRequest(values));
    }
    setEntityInstance(values);
    handleResetTargetKeysTransfer();
  }

  function handleResetTargetKeysTransfer(){
    setTargetKeys([]);
    setTargetKeysAcessos([]);
  }

  function handleReset() {
    form.resetFields();
    handleResetTargetKeysTransfer();
  }

  function ordenarItems(array) {
    return array.sort((a, b) =>
      (a.value||"").toLowerCase() > (b.value||"").toLowerCase() ? 1 : -1
    );
  }

  function handleChange(setFunction, list, nextTargetKeys, direction, moveKeys) {
    setFunction(getTargetKeysOrdenada(list, nextTargetKeys));
  }

  function getTargetKeysOrdenada(list, nextTargetKeys) {
    const filtered = list.filter(
      item => nextTargetKeys.indexOf(item.key) > -1
    );
    return ordenarItems(filtered).map(item => item.key);
  }

  function handleSelectChange(setFunction, sourceSelectedKeys, targetSelectedKeys) {
    setFunction([...sourceSelectedKeys, ...targetSelectedKeys]);
  }

  function validateToNextPassword(rule, value, callback) {
    if (value && confirmDirty) {
      form.validateFields(["confirm"]).then(r => console.log(r));
    }
    callback();
  }

  function compareToFirstPassword(rule, value, callback) {
    if (value && value !== form.getFieldValue("password")) {
      callback(getMessage("usuario.senha.naoConfere.label"));
    } else {
      callback();
    }
  }

  function handleConfirmBlur(e) {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  }
});
