import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Form, Row, Col, Spin, Select, Switch} from "antd";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {retornaValidateStatus} from "../../utils/formatador";
import {InputAnt} from "../../components/form/Input";
import {editarRequest, salvarRequest} from "../../store/modules/produtoEtiqueta/action";
import {SelectFilter} from "../../components/form/SelectFilter";
import {InputNumberAnt} from "../../components/form/InputNumber";

export const ProdutoEtiquetaForm = (props => {
  const [form] = Form.useForm();
  const requestManager = useSelector(state => state.requestManager);
  const dispatch = useDispatch();
  const loading = requestManager.loading;
  const {id, getMessage, listGrupoRecurso, error, entityInstance, setEntityInstance} = props;
  const [serial, setSerial] = useState(false)
  const [gruposFiltrados, setGruposFiltrados] = useState([])
  const [mostrarTodos, setMostrarTodos] = useState(false)

  useEffect(() => {
    setSerial(entityInstance.serial)
    form.setFieldsValue({
      codigoProduto: entityInstance.codigoProduto,
      quantidadeDeEtiquetas: entityInstance.quantidadeDeEtiquetas,
      quantidadePorImpressao: entityInstance.quantidadePorImpressao,
      etiquetas: entityInstance.etiquetas || [],
      grupos: entityInstance.grupos || [],
      serial: entityInstance.serial
    })
    setGruposFiltrados(listGrupoRecurso.filter(g => g.codigosProdutos.includes(entityInstance.codigoProduto)))
  }, [entityInstance]);

  function onCodigoChange(e){
    setGruposFiltrados(listGrupoRecurso.filter(g => g.codigosProdutos.includes(e.target.value)))
  }

  useEffect(() => {
    form.setFieldsValue({
      grupos: form.getFieldValue('grupos').filter(id => gruposFiltrados.map(g => g.id).includes(id))
    })
  }, [gruposFiltrados])

  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("produtoEtiqueta.editar.label") : getMessage("produtoEtiqueta.cadastro.label")}
        onBack={"/config/produtoEtiqueta"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br/>
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={6}>
              <InputAnt
                label={getMessage("produtoEtiqueta.codigoProduto.label")}
                nomeAtributo={"codigoProduto"}
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                onChange={onCodigoChange}
                validateStatus={retornaValidateStatus(error, "codigoProduto")}
              />
            </Col>
            <Col span={6}>
              <InputNumberAnt
                label={getMessage("produtoEtiqueta.quantidadePorImpressao.label")}
                nomeAtributo={"quantidadePorImpressao"}
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(error, "quantidadePorImpressao")}
                min={0}
              />
            </Col>
            <Col span={4}>
              <InputNumberAnt
                label={getMessage(serial ? "produtoEtiqueta.agrupamento.label" : "produtoEtiqueta.quantidadeDeEtiquetas.label")}
                nomeAtributo={"quantidadeDeEtiquetas"}
                isRequired
                message={getMessage("comum.obrigatorio.campo.message")}
                validateStatus={retornaValidateStatus(error, "quantidadeDeEtiquetas")}
                min={0}
              />
            </Col>
            <Col span={4}>
              <Form.Item
                label={getMessage("produtoEtiqueta.etiquetas.label")}
                name={"etiquetas"}
                validateStatus={retornaValidateStatus(error, "etiquetas")}
                rules={[
                  {
                    required: true,
                    message: getMessage("comum.obrigatorio.campo.message")
                  }
                ]}
              >
                <Select
                  mode={"tags"}
                  size={"large"}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={getMessage("produtoEtiqueta.serial.label")}
                name={"serial"}
              >
                <Switch
                  onChange={setSerial}
                  checked={serial}
                  checkedChildren={getMessage("comum.sim.label")}
                  unCheckedChildren={getMessage("comum.nao.label")}
                />
              </Form.Item>
            </Col>
          </Row>
          {!serial && <Row gutter={24}>
            <Col span={20}>
              <SelectFilter
                isRequired={true}
                label={getMessage("produtoEtiqueta.grupos.label")}
                nomeAtributo={"grupos"}
                modo={"multiple"}
                placeholder={getMessage("produtoEtiqueta.grupos.placeholder")}
                size={"large"}
                list={(mostrarTodos ? listGrupoRecurso : gruposFiltrados).map(grupoRecurso => {
                  return {key: grupoRecurso.id, value: grupoRecurso.nome, disabled: !grupoRecurso.codigosProdutos.includes(form.getFieldValue('codigoProduto'))}
                })}
              />
            </Col>
            <Col span={4}>
              <Form.Item
                label={getMessage("produtoEtiqueta.mostrarTodos.label")}
                name={"mostrarTodos"}
                tooltip={getMessage("produtoEtiqueta.grupos.apenasDoCodigoProduto.label")}
              >
                <Switch
                  onChange={setMostrarTodos}
                  checked={mostrarTodos}
                  checkedChildren={getMessage("comum.sim.label")}
                  unCheckedChildren={getMessage("comum.nao.label")}
                />
              </Form.Item>
            </Col>
          </Row>}
        </Form>
      </Spin>
    </Col>
  );

  function handleSubmit(e) {
    e.preventDefault();
    form.submit()
  }

  function onFinish(values) {
    values.etiquetas = values.etiquetas.map(e => e.trim())
    if (id) {
      values.id = id;
      dispatch(editarRequest(values))
    } else {
      dispatch(salvarRequest(values))
    }
  }

  function handleReset() {
    form.resetFields()
  }
});
