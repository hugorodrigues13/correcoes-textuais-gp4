import * as React from 'react';
import {Button, Col, Form, Popover, Row} from "antd";
import {useEffect, useState} from "react";
import {getMessage} from "../../components/messages";
import {useDispatch} from "react-redux";
import { SelectAnt } from "../../components/form/SelectAnt";
import {
  listRequest,
  updateMotivoRequest
} from "../../store/modules/Parada/action";

function PopoverComponent(props) {

  const { record, listMotivo } = props
  const [aberto, setAberto] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  function onFinish(values) {
    dispatch(updateMotivoRequest({...values, id: record.id}))
    dispatch(listRequest())
    setAberto(false)
  }

  function onCancel(){
    setAberto(false)
  }

  function onClickOutside(b){
    if (!b){
      onCancel()
    }
  }

  function contentPopover () {

    return(<Form onFinish={onFinish} layout={"vertical"} form={form}>
        <Row gutter={24}>
         <Col span={24}>
           <SelectAnt
             label={getMessage("paradas.tabela.motivo.label")}
             nomeAtributo="motivo"
             message={getMessage("comum.obrigatorio.campo.message")}
             isRequired
             list={listMotivo ? listMotivo.entities ? listMotivo.entities : [] : []}
           />
           <Form.Item >
             <Button type="primary" htmlType="submit">
               {getMessage("paradas.button.atualizarMotivo.label")}
             </Button>
           </Form.Item>
         </Col>
        </Row>
      </Form>
    )
  }

  return (
    <Popover
      visible={aberto}
      overlayStyle={{width: 320}}
      content={contentPopover}
      onVisibleChange={onClickOutside}
      trigger="click"
    >
      <div onClick={() => setAberto(true)}>{record.value}</div>
    </Popover>

  )
}

export default PopoverComponent
