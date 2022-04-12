import * as React from 'react';
import {Col, Form, Input, Modal, Row, Spin} from "antd";
import {getMessage} from "../../components/messages";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {AiOutlineHistory} from "react-icons/all";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {enviarSeparacaoOFRequest} from "../../store/modules/OrdemDeFabricacao/action";
import {DatePickerAnt} from "../../components/form/DatePicker";
import {disabledDate} from "../../components/utils";

function SeparacaoModal(props){

  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [materiasPrimasSelecionadas, setMateriasPrimasSelecionadas] = useState([])
  const { visible, setVisible, loading, entidade, materiasPrimas, getFiltros } = props

  useEffect(() => {
    form.resetFields()
    setMateriasPrimasSelecionadas([])
  }, [visible])

  function fechar(){
    setVisible(false)
  }

  function finalizar(values){
    dispatch(enviarSeparacaoOFRequest({ordemFabricao: entidade.id, ...values, materiasPrimasSelecionadas}, getFiltros()))
    fechar()
  }

  function configTable(){
    return {
      i18n: "sequenciamento.tabela.",
      columns: [
        {
          key: 'codigoProduto',
        },
        {
          key: "descricaoProduto",
        },
      ],
      data: materiasPrimas,
      scroll: {
        y: 300
      },
      rowSelection: {
        type: "checkbox",
        selectedRowKeys: materiasPrimasSelecionadas.map(mp => mp.key),
        onChange: (keys, records) => {
          setMateriasPrimasSelecionadas(records)
        },
      }
    }
  }

  function renderCampos(){
    return <>
      <Row gutter={24}>
        <Col span={24}>
          <DatePickerAnt
            label={getMessage("ordemFabricacao.modal.separacao.form.dataSeparacao.title")}
            nomeAtributo={"dataSeparacao"}
            showTime
            message={getMessage("comum.obrigatorio.campo.message")}
            dateFormat={"DD/MM/YYYY HH:mm"}
            disabledDate={disabledDate}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name={"justificativa"}
            label={getMessage("comum.justificativa.label")}
            rules={[{required: true, message: getMessage("comum.obrigatorio.campo.message")}]}
          >
            <Input.TextArea
              placeholder={getMessage("comum.justificativa.label")}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name={"materiasPrimas"}
            label={getMessage("ordemFabricacao.modal.separacao.form.materiasPrimas.title")}
            rules={[{required: true, message: getMessage("comum.obrigatorio.campo.message"), validator: (rule, value, callback) => {materiasPrimasSelecionadas.length === 0 ? callback('erro') : callback()}}]}
          >
            <TabelaAnt configTable={configTable()}/>
          </Form.Item>
        </Col>
      </Row>
    </>
  }

  return (
    <Modal
      title={getMessage("ordemFabricacao.modal.separacao.title")}
      visible={visible}
      onCancel={fechar}
      onOk={form.submit}
      width={700}
    >
      <Spin spinning={loading}>
        <Form form={form} layout={"vertical"} onFinish={finalizar}>
          {renderCampos()}
        </Form>
      </Spin>
    </Modal>
  )
}

export default SeparacaoModal
