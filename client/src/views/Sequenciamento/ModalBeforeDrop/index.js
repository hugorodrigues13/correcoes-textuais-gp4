import {Col, Form, Modal, Row, Button, Checkbox, TimePicker, Input} from "antd";
import { DatePickerAnt } from "../../../components/form/DatePicker";
import { SelectAnt } from "../../../components/form/SelectAnt";
import { SwitchAnt } from "../../../components/form/Switch";
import TabelaAnt from "../../../components/tabelaAnt/Tabela";
import React, { useEffect, useState } from "react";
import { InputNumberAnt } from "../../../components/form/InputNumber";
import { formataListaParaSelect } from "../../../utils/formatador";
import {getMateriaPrimaOrdemProducaoRequest} from "../../../store/modules/Sequenciamento/action";
import {useDispatch} from "react-redux";
import dayjs from "dayjs";
import {TextAreaAnt} from "../../../components/form/TextArea";

export default function ModalBeforeDrop({ show, onConfirm, onCancel, quantidadeMaxima, linhas, quantidadePorPallet, produto, materiaPrima, materiaPrimaTotal, loadingMateriaPrima, getMessage }) {

  const dispatch = useDispatch();
  const [form] = Form.useForm()
  const [visible, setVisible] = useState("none")
  const [separacao, setSeparacao] = useState(false)
  const [comentarios, setComentarios] = useState(false)
  const [materiasPrimas, setMateriasPrimas] = useState([])
  const [materiasPrimasSelecionadas, setMateriasPrimasSelecionadas] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [multiplicador, setMultiplicador] = useState(1)

  const rowSelection = {
    selectedRowKeys,
    onChange: (e) => onSelectChange(e),
  };

  const configTable = {
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
    rowSelection: rowSelection
  }

  useEffect(() => {
    form.setFieldsValue({
      materiaPrima: materiasPrimasSelecionadas,
    })
  }, [materiasPrimasSelecionadas])

  useEffect(() => {
    form.setFieldsValue({
      multiplicador: multiplicador,
      total: multiplicador * form.getFieldValue('quantidade')
    })
  }, [multiplicador])

  useEffect(() => {
    form.setFieldsValue({
      separacao: separacao,
    })
  }, [separacao])

  useEffect(() => {
    form.setFieldsValue({
      comentarios: comentarios,
    })
  }, [comentarios])

  useEffect(() => {
    if (quantidadeMaxima % quantidadePorPallet === 0) {
      setVisible("none")
    } else {
      setVisible("inline-block")
    }

    form.setFieldsValue({
      quantidade: quantidadeMaxima,
      total: multiplicador * quantidadeMaxima
    })
  }, [quantidadeMaxima])

  useEffect(() => {
    setMateriasPrimasSelecionadas(materiasPrimas.filter(value => selectedRowKeys.includes(value.key)))
  }, [selectedRowKeys])

  useEffect(() => {
    setMateriasPrimas((materiaPrima || []).map((value, index) => {
      return {
        ...value,
        key: index + 1
      }
    }))
  }, [materiaPrima])

  useEffect(() => {
    setMateriasPrimasSelecionadas([])
    setSelectedRowKeys([])
    form.setFieldsValue({
      dataSeparacao: null,
      horaSeparacao: null,
    })
  }, [separacao])

  useEffect(() => {
    setSeparacao(false)
    setComentarios(false)
    setMultiplicador(1)
    form.setFieldsValue({
      comentario: '',
      linhaProducao: '',
      segregar: false,
    })
  }, [show])

  const handleSubmit = (e) => {
    e.preventDefault()
    form.submit()
  }

  const onChangeSeparacao = () => {
    setSeparacao(!separacao)
    if(!separacao){
      dispatch(getMateriaPrimaOrdemProducaoRequest(produto.ordemDeProducao));
    }
  }

  const onChangeComentarios = () => {
    setComentarios(!comentarios)
  }

  function changeQuantidade(e) {
    if (e % quantidadePorPallet === 0) {
      setVisible("none")
    } else {
      setVisible("inline-block")
    }
    form.setFieldsValue({
      total: multiplicador * form.getFieldValue('quantidade')
    })
  }

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys([...selectedRowKeys, selectedRowKeys]);
  };

  function disabledDate(current) {
    return current < dayjs().startOf("day");
  }

  function cancelModal(){
    form.setFieldsValue({
      linhaProducao: '',
    })
    onCancel()
  }
  return (
    <Modal width={separacao ? 900: 500} visible={show} onOk={handleSubmit} onCancel={cancelModal} maskClosable={false}>
      <Form form={form} onFinish={onConfirm}>
        <Row gutter={24} style={{ marginTop: "35px" }}>
          <Col span={12}>
            <label className={"customdrag-label-inputs-model"}>
              {getMessage("sequenciamento.modal.quantidade") + ":"}
            </label>
            <InputNumberAnt
              nomeAtributo={"quantidade"}
              size={"large"}
              min={1}
              max={quantidadeMaxima}
              message={getMessage("comum.obrigatorio.campo.message")}
              onChange={e => changeQuantidade(e)}
            />
            {quantidadePorPallet !== undefined ? <label className={"label-qtd-por-pallet"} >
              {`${getMessage("sequenciamento.quantidadePorPallet.message")}: ${quantidadePorPallet}`}
            </label> : ""}
          </Col>
          <Col span={12}>
            <label className={"customdrag-label-inputs-model"}>
              {getMessage("sequenciamento.modal.linhaProducao") + ":"}
            </label>
            <SelectAnt
              nomeAtributo={"linhaProducao"}
              list={formataListaParaSelect(linhas, "id", "nome")}
              allowClear
            />
          </Col>
          <Col span={24} style={{ display: visible }}>
            {quantidadePorPallet !== undefined ?<label className={"message-valor-nao-multiplo-qtd-por-pallet"}>
              {getMessage("sequenciamento.valorNaoMultiplo.message")}
            </label> : ""}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <label className={"customdrag-label-inputs-model"}>
              {getMessage("sequenciamento.modal.multiplicador") + ":"}
            </label>
            <InputNumberAnt
              nomeAtributo={"multiplicador"}
              size={"large"}
              min={1}
              message={getMessage("comum.obrigatorio.campo.message")}
              onChange={setMultiplicador}
              value={multiplicador}
              dependencies={['quantidade']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const max = Math.floor(quantidadeMaxima / getFieldValue('quantidade'))
                    if (!value || value <= max ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(getMessage("sequenciamento.modal.multiplicador.error.label", {maximo: max})));
                  },
                })
              ]}
            />
          </Col>
          <Col span={12}>
            <label className={"customdrag-label-inputs-model"}>
              {getMessage("sequenciamento.modal.total") + ":"}
            </label>
            <InputNumberAnt
              nomeAtributo={"total"}
              size={"large"}
              min={1}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <label>{getMessage("sequenciamento.model.comentarios")}</label>
            <SwitchAnt
              nomeAtributo={"comentarios"}
              onChange={onChangeComentarios}
            />
          </Col>
          <Col span={8}>
            <label>{getMessage("sequenciamento.model.segregar")}</label>
            <SwitchAnt
              nomeAtributo={"segregar"}
            />
          </Col>
          <Col span={8}>
            <label>{getMessage("sequenciamento.model.separacao")}</label>
            <SwitchAnt
              nomeAtributo={"separacao"}
              onChange={onChangeSeparacao}
            />
          </Col>
        </Row>
        {comentarios && <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="comentario"
            >
              <Input.TextArea
                maxLength={500}
                showCount
                placeholder={getMessage("sequenciamento.model.comentarios.placeholder")}
              />
            </Form.Item>
          </Col>
        </Row>}
        <Row gutter={24}>
          {separacao ? <Col>
            <label type="text">{getMessage("sequenciamento.dataSeparacao.label")} </label>
              <Row gutter={24}>
                <Col span={12}>
                  <DatePickerAnt
                    style={{ width: '100%' }}
                    nomeAtributo={"dataSeparacao"}
                    disabledDate={disabledDate} />
                </Col>
                <Col span={12}>
                  <Form.Item name="horaSeparacao">
                    <TimePicker
                        format="HH:mm"
                      style={{ width: '100%' }}
                      size={"large"}
                      />
                  </Form.Item>
              </Col>
            </Row>
          </Col>: ""}
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="materiaPrima">
            {separacao ?
              <TabelaAnt configTable={configTable} loading={loadingMateriaPrima} /> : ""
            }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
