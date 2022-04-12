import React, {useEffect, useState} from 'react'
import {Form, Col, Row, Spin, Select, Button, Input} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {InputAnt} from "../../components/form/Input";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {retornaValidateStatus} from "../../utils/formatador";
import {salvarRequest, editarRequest, prepararNovoRequest} from "../../store/modules/Impressora/action";
import { AiOutlinePlus } from 'react-icons/ai';
import {getMessage} from "../../components/messages";
import {SelectAnt} from "../../components/form/SelectAnt";
import {SelectFilter} from "../../components/form/SelectFilter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import Alert from "react-s-alert";

const ImpressoraForm = (props => {
  const [form] = Form.useForm();
  const {id, error, entityInstance, setEntityInstance, display} = props;
  const requestManager = useSelector(state => state.requestManager);
  const dispatch = useDispatch();
  const loading = requestManager.loading;
  const [displayIp, setDisplayIp] = useState(display);
  const [ip, setIp] = useState("");
  const [alterInput, setAlterInput] = useState(true);
  const [ipsTabela, setIpsTabela] = useState([]);
  const {tipoImpressaoList, impressorasList} = useSelector(state => state.impressora)

  useEffect(() => {
    setDisplayIp(display)
  },[display])

  useEffect(() => {
    form.setFieldsValue({
      nome: entityInstance.nome,
      apelido: entityInstance.apelido,
      tipoImpressao: entityInstance.tipoImpressao,
    })

    if (entityInstance.tipoImpressao === "AGENTE") {
      form.setFieldsValue({ips: entityInstance.ips.map(value => {return { id: value}})})
      setIpsTabela(entityInstance.ips.map(value => {return { ip: value}}))
      setDisplayIp(true)
      setAlterInput(true)
    } else if (entityInstance.tipoImpressao === "SERVIDOR") {
      form.setFieldsValue({ips: []})
      setAlterInput(false)

    }
  }, [entityInstance]);

  const nomesImpressorasParaSelect = (impressorasList || []).map(impressora => ({
      key: impressora,
      label: impressora,
      value: impressora
    }))

  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("impressora.editar.label") : getMessage("impressora.cadastro.label")}
        onBack={"/config/impressora"}
        onClickSalvar={handleSubmit}
        onclickLimparCampos={handleReset}
      />
      <br/>
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              {/* Impressora */}
              {alterInput ?
                <InputAnt
                  label={getMessage("impressora.nome.label")}
                  nomeAtributo={"nome"}
                  message={getMessage("comum.obrigatorio.campo.message")}
                  isRequired={true}
                  validateStatus={retornaValidateStatus(error, "nome")}
                />
                :
                <SelectFilter
                  nomeAtributo={"nome"}
                  label={getMessage("impressora.nome.label")}
                  message={getMessage("comum.obrigatorio.campo.message")}
                  style={{width: '100%'}}
                  size={'large'}
                  onChange={selectedOption}
                  isRequired
                  placeholder={getMessage("impressora.nome.select.placeholder")}
                  list={nomesImpressorasParaSelect}
                />
              }

            </Col>
            <Col span={12}>
              {/* Apelido */}
              <InputAnt
                label={getMessage("impressora.apelido.label")}
                nomeAtributo={"apelido"}
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(error, "apelido")}
              />
            </Col>
          </Row>
          <Col span={24}>
            <SelectAnt
              nomeAtributo={"tipoImpressao"}
              label={getMessage("impressora.tipoImpressao.label")}
              message={getMessage("comum.obrigatorio.campo.message")}
              style={{width: '100%'}}
              size={'large'}
              onChange={selectedOption}
              isRequired
              placeholder={getMessage("impressora.tipoImpressao.form")}
              list={(tipoImpressaoList || []).map(tipo => {
                return {
                  ...tipo,
                  key: tipo.tipoImpressao,
                  value: getMessage(`tipoImpressao.${tipo.tipoImpressao}.label`)
                }
              })}
            />
          </Col>
          {/* Ips */}
          {displayIp ? <>
              <Row gutter={24}>
                <Col span={8}>
                  {/* IP Impressora */}
                  <Form.Item
                    label={getMessage("impressora.ips.label")}
                  >
                    <Input
                      message={getMessage("comum.obrigatorio.campo.message")}
                      placeholder={getMessage("impressora.ips.placeholder.form")}
                      name={"ips"}
                      onChange={ onChangeIp }
                      autoFocus={false}
                      value={ip}
                      size={"large"}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Button
                    key="1"
                    type="primary"
                    size={"large"}
                    onClick={addValueTable}
                    style={{ marginTop: 29 }}
                  >
                    <AiOutlinePlus size={"1.5em"} />
                  </Button>
                </Col>
              </Row>
              <Col span={24}>
                <TabelaAnt
                  configTable={IpsColumns()}
                />
              </Col>
            </>: null}
        </Form>
      </Spin>
    </Col>
  );

  function addValueTable() {
    const produto = { ip: ip };

    if(produto.ip.length === 0){
      Alert.error("Por favor, informe o IP.");
      return
    }
    if ((ipsTabela || []).length === 0) {
      setIpsTabela([...ipsTabela || [], produto]);
    } else if (!verifyValue(ipsTabela, produto)) {
      setIpsTabela([...ipsTabela, produto]);
    } else {
      Alert.error("Registro já existe na tabela");
    }
    form.setFieldsValue({ip: ''})
    setIp('')
  }

  function verifyValue(produtos, produto) {
    let verify = produtos.some(prod => (prod.ip === produto.ip))

    return verify;
  }

  function removeTableData(object) {
    let ip = object.ip;

    setIpsTabela(ipsTabela.filter(prod => prod.ip !== ip));

  }

  function IpsColumns() {
    return {
      i18n: "impressora.tabela.",
      columns: [
        {
          key: 'ip',
        },
      ],
      data: ipsTabela,
      acoes: {
        excluir: removeTableData
      }
    }
  }

  function onChangeIp(e) {
    let { value } = e.target

    setIp(value)
  }

  function selectedOption(value) {
    if (value === 'AGENTE') {
      setDisplayIp(true)
      setAlterInput(true);
    } else if(value === 'SERVIDOR'){
      setAlterInput(false);
      setDisplayIp(false)
      form.setFieldsValue({ips: []})
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.submit()
  }

  function onFinish(values) {
    setAlterInput(true)
    if (values.tipoImpressao === "AGENTE") {
      values.ips = ipsTabela.map(item => { return item.ip })
    } else {
      values.ips = []
    }

    setEntityInstance(values);
    if (id) {
      values.id = id;
      dispatch(editarRequest(values))
    } else {
      dispatch(salvarRequest(values))
      form.resetFields();
      setDisplayIp(false)
    }
  }

  function handleReset() {
    form.resetFields();
  }
});

export default ImpressoraForm;
