import * as React from 'react';
import {useEffect, useState} from "react";
import {FaSort, MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/all";
import {Button, Checkbox, Col, Divider, Popconfirm, Popover, Row, Spin, Tooltip} from "antd";
import {getMessage} from "../../../components/messages";
import {DndProvider, useDrop} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import OrdenarSelect from "./OrdenarSelect";
import {useDispatch} from "react-redux";
import {ordenacaoRapidaRequest} from "../../../store/modules/Sequenciamento/action";
import Alert from "react-s-alert";

const tipos = ["codigoProduto", "dataPrometida", "comprimento", "cliente", "ordemFabricacao"]

function OrdenarBotao(props){

  const { grupoSelecionado } = props
  const [visible, setVisible] = useState()
  const [ordens, setOrdens] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    resetarOrdens()
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <Popover
        trigger="click"
        onVisibleChange={setVisible}
        visible={visible}
        placement="topLeft"
        content={renderContent()}
      >
        <Tooltip title={getMessage("sequenciamento.ordenar.tooltip.label")}>
          <FaSort className={"icon-area-sequenciamento"}/>
        </Tooltip>
      </Popover>
    </DndProvider>
  )

  function renderContent(){
    return (
      <div style={{width: 220}}>
        <Divider style={{margin: '2px 0'}}/>
        {renderSelects()}
        {renderBotoes()}
      </div>
    )
  }

  function renderSelects(){
    return (
      <>
        {ordens.map((ordem, index) => (
          <OrdenarSelect
            key={ordem.tipo}
            ordem={ordem}
            index={index}
            mudarOrdem={mudarOrdemSelecao}
            reordenar={mudarOrdemPosicao}
          />
        ))}
      </>
    )
  }

  function renderBotoes(){
    return (
      <Row justify="end">
        <Button size="small" style={{marginTop: 5, marginRight: 5}} onClick={cancelar}>
          {getMessage("comum.cancelar.label")}
        </Button>
        <Popconfirm title={getMessage("sequenciamento.ordem.confirmar.label")} onConfirm={salvarOrdens}>
          <Button size="small" style={{marginTop: 5}} type="primary">
            {getMessage("comum.salvar.label")}
          </Button>
        </Popconfirm>
      </Row>
    )
  }

  function mudarOrdemSelecao(ordem){
    const index = ordens.findIndex(o => o.tipo === ordem.tipo)
    ordem.selecao = getProximaSelecao(ordem.selecao)
    const novasOrdens = [...ordens]
    novasOrdens.splice(index, 1, ordem)
    setOrdens(novasOrdens)
  }

  function mudarOrdemPosicao(dragIndex, hoverIndex){
    const novasOrdens = [...ordens]
    const dragCard = novasOrdens[dragIndex];
    novasOrdens.splice(dragIndex, 1)
    novasOrdens.splice(hoverIndex, 0, dragCard)
    setOrdens(novasOrdens)
  }

  function salvarOrdens(){
    if (ordens.every(o => o.selecao == null)){
      Alert.error(getMessage("sequenciamento.ordem.confirmar.erro.label"))
      return
    }
    const ordensTratadas = ordens.filter(o => o.selecao != null).map((o, index) => ({...o, prioridade: index}))
    dispatch(ordenacaoRapidaRequest(grupoSelecionado, ordensTratadas))
    cancelar()
  }

  function cancelar(){
    resetarOrdens()
    setVisible(false)
  }

  function resetarOrdens(){
    const ordensPadrao = tipos.map((t, index) => ({
      tipo: t,
      selecao: null,
    }))
    setOrdens(ordensPadrao)
  }

  function getProximaSelecao(selecao){
    if (selecao == null){
      return "asc"
    } else if (selecao === "asc"){
      return "desc"
    } else {
      return null
    }
  }

}

export default OrdenarBotao
