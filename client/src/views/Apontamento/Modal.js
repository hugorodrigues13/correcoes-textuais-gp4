import React, {useEffect, useState} from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Divider,
  Popconfirm,
  Alert,
} from "antd";
import {FormattedMessage, injectIntl} from "react-intl";
import {SelectAnt} from "../../components/form/SelectAnt";
import {useSelector} from 'react-redux';
import {InputAnt} from "../../components/form/Input";
import "./style.css";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { AiOutlinePlus } from "react-icons/ai";

function ModalCategory({
                         visible,
                         handleHiddenModal,
                         handleCancel,
                         intl,
                         serial,
                         recurso,
                         onSave,
                         onLogin,
                         impressora,
                         changeFocusSerial,
                         dadosSerial,
                         apontarOF,
                         totalSeriais
                       }) {

  const [form] = Form.useForm();
  const [visibleSelect, setVisibleSelect] = useState("none");
  const [visibleLogin, setVisibleLogin] = useState(false);
  const {defeitos} = useSelector(state => state.apontamento || {});
  const [defeitoSelect, setDefeitoSelect] = useState([]);
  const [quantidadeDefeito, setQuantidadeDefeito] = useState()
  const [useToken, setUseToken] = useState(true);
  const [userToken, setUserToken] = useState("");
  const [userNome, setUserNome] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [defeitoSelecionado, setDefeitoSelecionado] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const camposDadosRastreaveis = [];
  const [defeitosTabela, setDefeitosTabela] = useState([])

  useEffect(() => {
    dadosSerial.camposRastreaveis?.length > 0 ? setIsSubmitDisabled(true) : setIsSubmitDisabled(false);
  }, [dadosSerial])

  useEffect(() => {
    if (defeitos) {
      let arr = [];
      defeitos.map(def => {
        arr.push({
          key: def.key,
          value: def.value
        })
      })
      setDefeitoSelect(arr)
    }
  }, [defeitos])


  function adicionaDefeitoTabela() {
    setDefeitosTabela([...defeitosTabela, {defeito: defeitoSelecionado, quantidade: quantidadeDefeito}])
    form.resetFields()
  }

  return (
    <Modal
      visible={visible}
      title={getMessage("apontamento.title.modal.label")}
      onCancel={handleCancel}
      destroyOnClose={true}
      width={800}
      afterClose={resetSelect}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {getMessage("comum.cancelar.label")}
        </Button>
      ]}
    >
      {renderCatalogo()}
      <br />
      {
        dadosSerial.camposRastreaveis?.length && <Form onFinish={onFinish} layout={"vertical"} form={form} size={"small"}>
          {renderCamposRastreaveis()}
          <br />
        </Form>
      }
      {
        apontarOF && defeitoSelect?.length ? <Form form={form} layout={"vertical"}>
          <Row gutter={24}>
            <Col span={8}>
              <SelectAnt
                placeholder={getMessage("apontamento.selecionarDefeito.label")}
                modo=""
                label={getMessage("apontamento.defeito.label")}
                list={defeitoSelect.filter(def => !defeitosTabela.some(deft => deft.defeito === def.key))}
                message={getMessage("comum.obrigatorio.campo.message")}
                nomeAtributo={"defeito"}
                onChange={handleSelectDefeito}
              />
            </Col>
            <Col span={8}>
              <InputAnt onChange={(e) => setQuantidadeDefeito(e.target.value)} nomeAtributo={"quantidade"} label={getMessage("apontamento.quantidade.label")} value={quantidadeDefeito} />
            </Col>
            <Col md={2}>
              <Button
                type="default"
                size={'large'}
                style={{
                  marginLeft: 10,
                  marginTop: 32
                }}
                onClick={adicionaDefeitoTabela}
              >
              <AiOutlinePlus size={"1.5em"}/>
            </Button>
            </Col>
          </Row>
        </Form> : null
      }
      {renderTabelaDefeitos()}
      {renderBotoes()}
      <br/>
      {visibleLogin && renderLogin()}
      <br />

        <div style={{display: visibleSelect, marginTop: 20}}>
          {renderDefeitos()}
        </div>
      {renderTabelaMps()}
    </Modal>
  );

  function renderCatalogo(){
    return (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <strong>{getMessage("apontamento.modal.modelo.label")}</strong>
            :&nbsp;
            {dadosSerial.modelo || getMessage("comum.nenhum.label")}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <strong>{getMessage("apontamento.modal.comprimento.label")}</strong>
            :&nbsp;
            {dadosSerial.comprimento  || getMessage("comum.nenhum.label")}
          </Col>
        </Row>
        {dadosSerial.dataPrevisaoFinalizacao && <Row gutter={24}>
          <Col span={24}>
            <strong>{getMessage("apontamento.modal.dataPrevisaoFinalizacao.label")}</strong>
            :&nbsp;
            {dadosSerial.dataPrevisaoFinalizacao}
          </Col>
        </Row>}
        {apontarOF && !defeitoSelect.length && <Row gutter={24}>
          <Col span={24}>
            <Alert message={getMessage("apontamento.of.nenhumDefeitoAssociadoAoGrupo.message")} type="warning"/>
          </Col>
        </Row> }
      </>
    )
  }

  function renderCamposRastreaveis() {
    return (<Row gutter={24}> {dadosSerial.camposRastreaveis?.map((campo, index) => {
      camposDadosRastreaveis.push({field: campo, name: 'rastreavel' + index});

      return <Col span={8}><InputAnt
        label={campo}
        autoFocus={index === 0}
        tabIndex={0}
        placeholder={campo}
        nomeAtributo={'rastreavel' + index}
        onChange={() => checaCamposVazios()}
        isRequired
      /></Col>
    })}</Row>)
  }

  function removeTableData(obj) {
    setDefeitosTabela(defeitosTabela.filter(deft => deft.defeito !== obj.defeito) || [])
  }

  function renderTabelaDefeitos(){
    function configTable(){
      return {
        i18n: "apontamento.modal.tabela.",
        size: "small",
        columns: [
          {
            key: "defeito",
            isSorteable: false,
            render: item => {
              return defeitoSelect.find(def => def.key === item)?.value
            }
          },
          {
            key: "quantidade",
            isSorteable: false,
          },
        ],
        scroll: {
          y: 500
        },
        data: defeitosTabela,
        acoes: {
          excluir: removeTableData,
          editModal: true
        }
      }
    }
    if(apontarOF && defeitoSelect?.length) {
      return (
        <>
          <strong>{getMessage("apontamento.modal.defeitosTabela.label")}</strong>
          <TabelaAnt configTable={configTable()}/>
        </>
      )
    }

    return null
  }

  function renderTabelaMps(){
    function configTable(){
      return {
        i18n: "apontamento.modal.tabela.",
        size: "small",
        columns: [
          {
            key: "codigo",
            isSorteable: false,
          },
          {
            key: "descricao",
            isSorteable: false,
          },
        ],
        scroll: {
          y: 500
        },
        data: dadosSerial.materiasPrimas,
      }
    }

    if(!apontarOF) {
      return (
        <>
          <strong>{getMessage("apontamento.modal.materiasPrimas.label")}</strong>
          <TabelaAnt configTable={configTable()}/>
        </>
      )
    }
  }

  function renderBotoes(){
    return (
      <>
        <Button
          type="primary"
          autoFocus
          onClick={aprovar}
          tabIndex={0}
          disabled={isSubmitDisabled}
          key="submit"
        >
          {getMessage("apontamento.aprovar.modal.label")}
        </Button>

        {defeitoSelect?.length && !apontarOF ? <Button
          type="primary"
          style={{marginLeft: 5}}
          disabled={isSubmitDisabled}
          onClick={reprocesso}
        >
          {getMessage("apontamento.reprocesso.modal.label")}
        </Button> : <></>}

        {!apontarOF && <> <Popconfirm
          cancelText={getMessage("comum.nao.label")}
          okText={getMessage("comum.sim.label")}
          title={getMessage("apontamento.apoio.confirmar.label")}
          onConfirm={apoio}
        >
          <Button
            type="primary"
            disabled={isSubmitDisabled}
            style={{ marginLeft: 5 }}
          >
            {getMessage("apontamento.apoio.modal.label")}
          </Button>
        </Popconfirm>

          <Button
          type="primary"
          style={{marginLeft: 5}}
          disabled={isSubmitDisabled}
          onClick={sucatear}
          >
            {getMessage("apontamento.sucatear.modal.label")}
          </Button>
        </>}
      </>
    )
  }

  function renderDefeitos(){
    return (
      <Form onFinish={onFinish} layout={"vertical"} form={form} size={"small"}>
        <SelectAnt
          placeholder={getMessage("apontamento.selecionarDefeito.label")}
          modo=""
          list={defeitoSelect}
          message={getMessage("comum.obrigatorio.campo.message")}
          style={{width: '100%'}}
          size={'medium'}
          nomeAtributo={"defeitoReprocesso"}
          onChange={handleIdReprocesso}
        />
      </Form>
    )
  }

  function renderLogin(){
    return (
      <div style={{marginTop: 20}}>
        <Row gutter={24}>
          <Col span={24}>
            <span className={"info-message-login"}>{getMessage("apontamento.loginSupervisorNecessario.label")}</span>
          </Col></Row>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={24}>
              <SelectAnt
                placeholder={getMessage("apontamento.selecionarDefeito.label")}
                list={defeitoSelect}
                message={getMessage("comum.obrigatorio.campo.message")}
                style={{width: '100%'}}
                nomeAtributo={"defeitoSucatear"}
                onChange={setDefeitoSelecionado}
              />
            </Col>
          </Row>
          {
            useToken ?
              <Row gutter={24}>
                <Col md={24}>
                  <InputAnt
                    type="password"
                    onChange={e => setUserToken(e.target.value)}
                    placeholder={getMessage("login.token.label")}
                    nomeAtributo={"token"}
                  />
                </Col>
              </Row>
              :
              <>
                <Row gutter={24}>
                  <Col md={24}>
                    <InputAnt
                      onChange={e => setUserNome(e.target.value)}
                      placeholder={getMessage("login.nomeDeUsuario.label")}
                      nomeAtributo={"username"}
                    />
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col md={24}>
                    <InputAnt
                      onChange={e => setUserPassword(e.target.value)}
                      type={"password"}
                      placeholder={getMessage("login.senha.label")}
                      nomeAtributo={"password"}
                    />
                  </Col>
                </Row>
              </>
          }

          <Row gutter={24}>
            <Col span={24}>
              <Button
                style={{width: "100%", height: 40, borderRadius: 5}}
                type={"primary"}
                onClick={handleSubmitLogin}
              >
                <FormattedMessage id="login.entrar.label"/>
              </Button>
            </Col>
          </Row>
          <Divider><FormattedMessage id={"login.ou.label"}/></Divider>
          <Row>
            <Col span={24}>
              <Button
                style={{width: "100%", height: 40, borderRadius: 5}}
                type={"secundary"}
                onClick={() => {
                  setUseToken(!useToken)
                }}>
                <FormattedMessage
                  id={!useToken ?
                    "login.acesar.token.label" :
                    "login.acesar.usuarioSenha.label"}
                />
              </Button>
            </Col>
          </Row>

        </Form>
      </div>
    )
  }

  function getMessage(id) {
    return intl.formatMessage({id});
  }

  async function aprovar() {
    setDefeitoSelecionado(null);
    changeFocusSerial(true);
    await setVisibleLogin(false);
    form.submit();
    form.setFieldsValue({
      defeitoReprocesso: "",
      defeitoSucatear: "",
    });
    handleHiddenModal();
  }

  function handleSubmitLogin() {
    form.submit();
  }

  async function handleIdReprocesso(id) {
    setVisibleSelect("")
    setVisibleLogin(false)
    await setDefeitoSelecionado(id);
    changeFocusSerial(true);
    form.submit();
    handleHiddenModal();
  }

  function handleSelectDefeito(id) {
    setDefeitoSelecionado(id)
  }

  async function apoio() {
    form.setFieldsValue({
      apoio: true,
    })
    await aprovar()
  }


  function reprocesso() {
    setVisibleSelect("")
    setVisibleLogin(false)
    setDefeitoSelecionado(null);
    form.setFieldsValue({
      defeitoReprocesso: "",
      defeitoSucatear: ""
    });
  }

  async function sucatear() {
    setVisibleSelect("none")
    await setVisibleLogin(true)
    setDefeitoSelecionado(null);
    form.setFieldsValue({
      defeitoReprocesso: "",
      defeitoSucatear: ""
    });
  }

  function resetSelect() {
    setVisibleSelect("none")
    setVisibleLogin(false)
    changeFocusSerial(true)
    form.setFieldsValue({
      apoio: false,
    })
  }

  function onFinish() {
    const camposRastreaveis = [];

    dadosSerial.camposRastreaveis?.forEach(campo => {
      camposRastreaveis.push({nome: campo, valor: form.getFieldValue(getNamePeloCampo(campo))});
    });

    if(visibleLogin) {
      useToken ?
          onLogin({token: userToken, serial: serial, recurso: recurso, defeito: defeitoSelecionado}) :
          onLogin({name: userNome, password: userPassword, serial: serial, recurso: recurso, defeito: defeitoSelecionado});
    } else {
      onSave({
        serial,
        defeitos: defeitosTabela,
        defeito: defeitoSelecionado,
        recurso,
        impressora,
        apoio: form.getFieldValue('apoio'),
        camposRastreaveis
      });

      setVisibleSelect("none")
      changeFocusSerial(true)
    }

    form.resetFields();
  }

  function getNamePeloCampo(campo) {
    return camposDadosRastreaveis.find(c => c.field === campo).name || null
  }

  function checaCamposVazios() {
    const campos = form.getFieldsValue()
    const algumCampoSemValor = Object.keys(campos)
      .filter(campo => campo.replaceAll(/\d/g, '') === 'rastreavel')
      .some(campo => !campos[campo])
    return algumCampoSemValor ? setIsSubmitDisabled(true) : setIsSubmitDisabled(false);
  }
}

export default injectIntl((ModalCategory));
