import * as React from 'react';
import {Button, Col, InputNumber, Popconfirm, Popover, Row} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {alterarQuantidadeOFRequest} from "../../store/modules/OrdemDeFabricacao/action";
import {getMessage} from "../../components/messages";

function QuantidadeInput(props) {

  const { record } = props
  const { quantidadeProgramada } = record
  const dispatch = useDispatch()
  const [aberto, setAberto] = useState(false)
  const [quantidade, setQuantidade] = useState(0)

  useEffect(() => {
    setQuantidade(quantidadeProgramada)
  }, [quantidadeProgramada])

  function cancelar(){
    setAberto(false)
    setQuantidade(quantidadeProgramada)
  }

  function confirmar(){
    setAberto(false)
    record.quantidadeProgramada = quantidade
    dispatch(alterarQuantidadeOFRequest(record.id, quantidade, props.getFiltros()))
  }

  function onChange(){
    if (quantidade !== quantidadeProgramada){
      setAberto(true)
    }
  }

  function onClickOutside(b){
    if (!b){
      cancelar()
    }
  }

  return (
    <Popconfirm
      visible={aberto}
      overlayStyle={{width: 320}}
      onCancel={cancelar}
      onConfirm={confirmar}
      onVisibleChange={onClickOutside}
      trigger="click"
      title={getMessage("ordemFabricacao.confirmar.alterarQuantidade.label")}
    >
      <InputNumber
        value={quantidade}
        onChange={setQuantidade}
        onBlur={onChange}
        onPressEnter={onChange}
        precision={0}
        min={1}
        max={quantidadeProgramada}
      />
    </Popconfirm>

  )
}

export default QuantidadeInput
