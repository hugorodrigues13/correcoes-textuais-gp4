import React, {useEffect, useState} from 'react'
import {Form, Col, Row, Spin, Select, Button} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {InputAnt} from "../../components/form/Input";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {retornaValidateStatus} from "../../utils/formatador";
import {salvarRequest, editarRequest} from "../../store/modules/Recurso/action"
import {SelectFilter} from "../../components/form/SelectFilter";
import {SwitchAnt} from "../../components/form/Switch";
import {SelectAnt} from "../../components/form/SelectAnt";
import {InputNumberAnt} from "../../components/form/InputNumber";
import {AiOutlinePlus} from "react-icons/ai";
import TabelaAnt from "../../components/tabelaAnt/Tabela";

export const RecursoForm = (props => {

  const [form] = Form.useForm();
  const [testForm] = Form.useForm();
  const {id, getMessage, listConectores, error, entityInstance, setEntityInstance, tiposTeste} = props;
  const requestManager = useSelector(state => state.requestManager);
  const dispatch = useDispatch();
  const loading = requestManager.loading;
  const [ativarTestes, setAtivarTestes] = useState(false)
  const [testes, setTestes] = useState([])
  const [editando, setEditando] = useState(null)
  const [considerarPerdas, setConsiderarPerdas] = useState(false)

  useEffect( () => {
    console.log(entityInstance)
    setTestes(entityInstance.testes)
    setAtivarTestes(!!entityInstance.testes?.length)
    form.setFieldsValue( {
      nome: isClonar() ? null : entityInstance.nome,
      metaOEE: entityInstance.metaOEE,
      codigoOracle: entityInstance.codigoOracle,
      conectores: entityInstance.conectores || [],
      ativarTestes: !!entityInstance.testes?.length,
      considerarPerdas: entityInstance.considerarPerdas
    })
  }, [entityInstance]);

  return(
    <Col>
      <CabecalhoForm
        isEdicao={!isClonar() && id !== null}
        titulo={!isClonar() && id ? getMessage("recurso.editar.label") : getMessage("recurso.cadastro.label")}
        onBack={"/cad/recurso"}
        onClickSalvar={handleSubmit}
        onclickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={8}>
              {/* Nome */}
              <InputAnt
                label={getMessage("recurso.nome.label")}
                nomeAtributo={"nome"}
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(error, "nome")}
                autoFocus={isClonar()}
              />
            </Col>
            <Col span={8}>
              {/* Meta OEE */}
              <InputAnt
                label={getMessage("recurso.metaOEE.label")}
                nomeAtributo={"metaOEE"}
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(error, "metaOEE")}
              />
            </Col>
            <Col span={8}>
              {/* Codigo Oracle */}
              <InputAnt
                label={getMessage("recurso.codigoOracle.label")}
                nomeAtributo={"codigoOracle"}
                message={getMessage("comum.obrigatorio.campo.message")}
                validateStatus={retornaValidateStatus(error, "codigoOracle")}
              />
            </Col>
            <Col span={24}>
              {/* Conectores */}
                <SelectFilter
                  modo="multiple"
                  label={getMessage("recurso.conectores.label")}
                  list={listConectores}
                  isRequired={false}
                  message={getMessage("comum.obrigatorio.campo.message")}
                  style={{width: '100%'}}
                  size={'large'}
                  nomeAtributo={"conectores"}/>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={4}>
              <SwitchAnt
                label={getMessage("recurso.testes.label")}
                nomeAtributo="ativarTestes"
                checkedChildren={getMessage("comum.sim.label")}
                unCheckedChildren={getMessage("comum.nao.label")}
                value={ativarTestes}
                onChange={setAtivarTestes}
              />
            </Col>
          </Row>
          {ativarTestes && renderTestes()}
        </Form>
      </Spin>
    </Col>
  );

  function renderTestes(){
    function adicionarNaTabela(values){
      const { tipo, amostragem, considerarPerdas } = values
      const novoTeste = { tipo, amostragem, considerarPerdas }
      if (editando) {
        novoTeste.id = editando.id
        const novosTestes = [...testes]
        const index = novosTestes.findIndex(t => t.tipo === editando.tipo)
        novosTestes.splice(index, 1, novoTeste)
        setTestes(novosTestes)
        setEditando(null)
      } else {
        setTestes([...testes, novoTeste])
      }
      testForm.resetFields()
    }
    function deletar(objeto) {
      setTestes(testes.filter(t => t.tipo !== objeto.tipo))
    }
    function editar(objeto) {
      setEditando(objeto)
      testForm.setFieldsValue({
        tipo: objeto.tipo,
        amostragem: objeto.amostragem,
        considerarPerdas: objeto.considerarPerdas
      })
    }
    function configTable(){
      return {
        i18n: "recurso.testes.",
        columns: [
          {
            key: 'tipo',
          },
          {
            key: 'amostragem',
            render: (text) => `${text}%`
          },
          {
            key: 'considerarPerdas',
            render: (valor) => !!valor ? 'Sim' : 'Não'
          }
        ],
        acoes: {
          editModal: true,
          editar: editar,
          excluir: deletar
        },
        data: testes,
      }
    }
    return (
      <>
        <Form layout={"vertical"} form={testForm} onFinish={adicionarNaTabela}>
          <Row gutter={28}>
            <Col span={4}>
              <SelectAnt
                nomeAtributo="tipo"
                ordenar={false}
                isRequired
                label={getMessage("recurso.testes.tipo.label")}
                list={tiposTeste.map(formataListaParaSelect)}
                rules={[() => ({
                  validator(_, value) {
                    if (!value || editando?.tipo === value || !testes?.some(t => t.tipo === value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(getMessage("recurso.testes.jaAdicionado.label")));
                  },
                })]}
              />
            </Col>
            <Col span={4}>
              <InputNumberAnt
                nomeAtributo="amostragem"
                min={0}
                isRequired
                max={100}
                formatter={value => value ? `${value}%` : ''}
                parser={value => value.replace('%', '')}
                label={getMessage("recurso.testes.amostragem.label")}
              />
            </Col>
            <Col span={5}>
              <SwitchAnt
                label={getMessage("recurso.testes.considerarPerdas.label")}
                nomeAtributo="considerarPerdas"
                checkedChildren={getMessage("comum.sim.label")}
                unCheckedChildren={getMessage("comum.nao.label")}
                value={considerarPerdas}
                onChange={setConsiderarPerdas}
              />
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                key="submit"
                size="large"
                style={{marginTop: 29}}
                onClick={() => testForm.submit()}
              >
                <AiOutlinePlus size={"1.5em"} />
              </Button>
            </Col>
          </Row>
        </Form>
        <Row gutter={24}>
          <Col span={24}>
            <TabelaAnt configTable={configTable()}/>
          </Col>
        </Row>
      </>
    )
  }

  function formataListaParaSelect(tipo){
    return {
      key: tipo,
      value: tipo,
    }
  }

  function handleSubmit( e ) {
    e.preventDefault();
    form.submit()
  }

  function onFinish( values ) {
    values.testes = testes
    setEntityInstance(values);
    if(id && !isClonar()) {
      values.id = id;
      dispatch(editarRequest(values))
    } else {
      dispatch(salvarRequest(values))
    }
  }

  function handleReset() {
    form.resetFields();
    testForm.resetFields()
    setEditando(null)
  }

  function queryObj(param) {
    const result = {}, keyValuePairs = location.search.slice(1).split("&");
    keyValuePairs.forEach(function(keyValuePair) {
      keyValuePair = keyValuePair.split('=');
      result[decodeURIComponent(keyValuePair[0])] = decodeURIComponent(keyValuePair[1]) || '';
    });
    return param
      ? result[param]
      : result
  }

  function isClonar() { return !!queryObj('clonar') };
});
