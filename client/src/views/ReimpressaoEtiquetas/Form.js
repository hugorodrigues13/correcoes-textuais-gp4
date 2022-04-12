import * as React from 'react';
import {Button, Col, Form, Radio, Row} from "antd";
import {InputAnt} from "../../components/form/Input";
import {InputNumberAnt} from "../../components/form/InputNumber";
import {getMessage} from "../../components/messages";
import {useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import {AiFillPrinter} from "react-icons/all";
import {SelectFilter} from "../../components/form/SelectFilter";
import {
  reimpressaoEtiquetasPesquisarDadosRequest
} from "../../store/modules/ReimpressaoEtiquetas/action";
import { useDispatch } from "react-redux";
const minimoPesquisa = 2;

function ReimpressaoForm(props){

  const dispatch = useDispatch()
  const { impressoras, dadosLotes } = props
  const [form] = Form.useForm()
  const [tipo, setTipo] = useState("pdf")
console.log(dadosLotes)
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={8}>
          <SelectFilter
            nomeAtributo="lote"
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("reimpressaoEtiquetas.lote.label")}
            maxTagCount={2}
            allowClear
            onSearch={value => value.length >= minimoPesquisa && dispatch(reimpressaoEtiquetasPesquisarDadosRequest(value))}
            list={dadosLotes.map(l => ({key: l, value: l}))}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            nomeAtributo="numeroCaixa"
            min={1}
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("reimpressaoEtiquetas.numeroCaixa.label")}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            nomeAtributo="copias"
            isRequired
            min={1}
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("reimpressaoEtiquetas.copias.label")}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="tipo"
            initialValue="pdf"
            label={getMessage("reimpressaoEtiquetas.tipo.label")}
            rules={[{required: true}]}
          >
            <Radio.Group value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <Radio value="impressora">{getMessage("reimpressaoEtiquetas.tipo.impressora.label")}</Radio>
              <Radio value="pdf">{getMessage("reimpressaoEtiquetas.tipo.pdf.label")}</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {tipo === 'impressora' && <Col span={8}>
          <SelectFilter
            label={getMessage("reimpressaoEtiquetas.tipo.impressora.label")}
            list={(impressoras || []).map(imp => {
              return {
                key: imp.id,
                value: imp.nome
              }
            })}
            isRequired
            nomeAtributo={"impressora"}
            suffixIcon={<AiFillPrinter size={20} style={{marginTop: '-4px', marginLeft: '-4px'}}/>}
          />
        </Col>}
        <Col span={3}>
          <Button style={{marginTop: 30, width: '100%'}} size="large" type="primary" htmlType="submit">
            <FormattedMessage id={tipo === 'pdf' ? "reimpressaoEtiquetas.tipo.gerar.pdf.label" : "reimpressaoEtiquetas.tipo.gerar.impressora.label"}/>
          </Button>
        </Col>
      </Row>
    </Form>
  )

  function onFinish(values){
    props.onFinish(values)
  }

}

export default ReimpressaoForm
