import React, {useState, useEffect} from "react"
import {useDrop} from "react-dnd";
import {ItemTypes} from "../ItemTypes";
import OrdemDeFabricacao from "../OrdemDeFabricacao";
import {Spin} from "antd";
import {useSelector} from "react-redux";
import {getMessage} from "../../../components/messages";
import {BiAddToQueue} from "react-icons/all";
import {Filtro} from "./Filtro"

export default function AreaSequenciamento({ordensDeFabricacao, setShowTrashCan, criando, grupoSelecionado, ordensIniciais, setOrdensIniciais, listStatusOrdemFabricacao}) {
  const { loadingOrdens } = useSelector(store => store.sequenciamento)
  const [ordensDeFabricacaoPesquisadas, setOrdensDeFabricacaoPesquisadas] = useState([])


  const [{canDrop, isOver}, drop] = useDrop({
    accept: [ItemTypes.PRODUTO, ItemTypes.ORDEM],
    drop: () => ({name: 'Sequenciamento'}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    setOrdensDeFabricacaoPesquisadas(ordensDeFabricacao)
  }, [ordensDeFabricacao])

  function renderArrastar(){
    return (
      <div className="criar-ordem-box">
        <p style={{color: "#2aabd2", textAlign: "center", fontSize: 24, marginBottom: 5}}>
          {getMessage("sequenciamento.arrasteParaCriar.label")}
        </p>
        <div style={{marginLeft: 'auto', marginRight: 'auto', width: 60}}>
          <BiAddToQueue
            className={"icon-remove-drag"}
            size={40}
            color={"#2aabd2"}/>
        </div>
      </div>
    )
  }

  function renderOF(ordem){
    const ordemInicial = ordensIniciais.find(o => o.id == ordem.id).ordem
    const setOrdemInicial = (novaOrdem) => {
      const newOrdens = [...ordensIniciais]
      const ordemIndex = newOrdens.findIndex(o => o.id == ordem.id)
      const newOrdem = {id: ordem.id, ordem: novaOrdem}
      newOrdens.splice(ordemIndex, 1, newOrdem)
      setOrdensIniciais(newOrdens)
    }
    return <OrdemDeFabricacao
      criando={criando}
      ordem={ordem}
      setShowTrashCan={setShowTrashCan}
      ordemInicial={ordemInicial}
      setOrdemInicial={setOrdemInicial}
    />
  }

  function renderOFs(){
    return (
      <div
        ref={ !ordensDeFabricacao.length ? drop : null }
        className={`area-sequenciamento area-sequenciamento-disponivel ${isOver && !criando && !ordensDeFabricacao.length ? 'on-drag-enter' : ""}`}
      >
          {ordensDeFabricacaoPesquisadas.map(renderOF)}
          {ordensDeFabricacao.length
            ? <div ref={criando ? undefined : drop} className={`area-drop-first ${isOver && !criando ? 'on-drag-enter' : ""}`}/> : null}
          {!ordensDeFabricacao.length && !isOver && !criando
            ? <div className={"info-drag-product-here"}>{getMessage("sequenciamento.infoDragHere.message")}</div> : null}
      </div>
    )
  }

  return (
    <Spin spinning={loadingOrdens}>
      <div ref={criando ? drop : undefined}>
        <div style={criando ? {border: '1px solid #2aabd2', borderStyle: 'dashed'} : {}}>
          <div style={{filter: criando ? 'blur(2px)' : ''}}>
            <Filtro grupoSelecionado={grupoSelecionado} ordensDeFabricacao={ordensDeFabricacao}  listStatusOrdemFabricacao={listStatusOrdemFabricacao} />
            {renderOFs()}
          </div>
        </div>
        {criando && renderArrastar()}
      </div>

    </Spin>
  )
}
