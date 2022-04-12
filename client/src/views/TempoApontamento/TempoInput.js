import * as React from 'react';
import {Button, Col, InputNumber, Popover, Row} from "antd";
import {useEffect, useState} from "react";
import {getMessage} from "../../components/messages";
import {useDispatch} from "react-redux";
import {tempoApontamentoEditRequest} from "../../store/modules/TempoApontamento/action";

function TempoInput(props) {

  const { record } = props
  const { tempoApontamento } = record
  const dispatch = useDispatch()
  const [aberto, setAberto] = useState(false)
  const [tempoInput, setTempoInput] = useState(0)

  useEffect(() => {
    setTempoInput(tempoApontamento)
  }, [tempoApontamento])

  function onCancel(){
    setAberto(false)
    setTempoInput(tempoApontamento)
  }

  function onConfirm(todos){
    setAberto(false)
    record.tempoApontamento = tempoInput
    dispatch(tempoApontamentoEditRequest([record.id], tempoInput, todos, props.filtros()))
  }

  function atualizarTodos(){
    onConfirm(true)
  }

  function criarNovo(){
    onConfirm(false)
  }

  function onChange(){
    if (tempoInput !== tempoApontamento){
      setAberto(true)
    }
  }

  function onClickOutside(b){
    if (!b){
      onCancel()
    }
  }

  return (
    <Popover
      visible={aberto}
      overlayStyle={{width: 320}}
      content={renderContent(onCancel, atualizarTodos, criarNovo)}
      onVisibleChange={onClickOutside}
      trigger="click"
    >
      <InputNumber
        value={tempoInput}
        onChange={setTempoInput}
        onBlur={onChange}
        onPressEnter={onChange}
        precision={0}
        disabled={record.vigenciaAte}
        min={1}
      />
    </Popover>

  )
}

export default TempoInput
export function renderContent(onCancel, atualizarTodos, criarNovo, extra, message="tempoApontamento.editarTempo.label"){
  return (
    <>
      <Row gutter={24}>
        <Col span={24} style={{marginBottom: 8}}>
          {getMessage(message)}
        </Col>
      </Row>
      {extra}
      <Row gutter={24}>
        <Col span={24} style={{textAlign: 'right'}}>
          <Button
            size="small"
            onClick={onCancel}
            style={{marginRight: 8}}
          >
            {getMessage("comum.nao.label")}
          </Button>
          <Button
            size="small"
            type="primary"
            style={{marginRight: 8}}
            onClick={atualizarTodos}
          >
            {getMessage("tempoApontamento.atualizarTodos.label")}
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={criarNovo}
          >
            {getMessage("tempoApontamento.criarNovo.label")}
          </Button>
        </Col>
      </Row>
    </>

  )
}
