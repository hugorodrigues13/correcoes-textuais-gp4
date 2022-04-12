import Index from "../ArrowProgress";
import React, {useEffect, useState} from "react";
import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../ItemTypes";
import {
  alterarLinhaSequenciamentoRequest,
  alterarOrdemRequest,
  buscarCatalogoDoProdutoRequest,
  excluirRequest
} from "../../../store/modules/Sequenciamento/action";
import {useDispatch, useSelector} from "react-redux";
import {getMessage} from "../../../components/messages";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Badge, Input, InputNumber, Popover, Tooltip} from "antd";
import ModalExcluirOrdem from "./ModalExcluirOrdem";
import {formataListaParaSelect} from "../../../utils/formatador";
import {SelectAnt} from "../../../components/form/SelectAnt";
import "./style.css";

export default function OrdemDeFabricacao({ordem, setShowTrashCan, criando, ordemInicial, setOrdemInicial}) {
  const dispatch = useDispatch()
  const {grupoSelecionado, linhasGrupo} = useSelector(store => store.sequenciamento)
  const [mostrarModalExcluirOrdem, setMostrarModalExcluirOrdem] = useState(false)

  function excluirOrdemFabricacao(){
    dispatch(excluirRequest(ordem.id, grupoSelecionado))
    setMostrarModalExcluirOrdem(false)
  }

  function handleShowModal(codigoProduto, descricaoProduto) {
    dispatch(buscarCatalogoDoProdutoRequest(codigoProduto, descricaoProduto));
  }

  const [{ isDragging }, drag] = useDrag({
    item: { name: ordem.codigo, type: ItemTypes.ORDEM },
    begin: (monitor) => {
      setShowTrashCan(true)
    },
    end: (item, monitor) => {
      setShowTrashCan(false)
      const dropResult = monitor.getDropResult();
      const didDrop = monitor.didDrop();
      if(didDrop) {
        if (item && dropResult) {
          if(dropResult.name === "Trash") {
            setMostrarModalExcluirOrdem(true)
          } else if(dropResult.name !== "Sequenciamento") {
            dispatch(alterarOrdemRequest({...ordem, codigoOrdemAnterior: dropResult.name}, grupoSelecionado))
          } else {
            dispatch(alterarOrdemRequest(ordem, grupoSelecionado))
          }
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.PRODUTO, ItemTypes.ORDEM],
    drop: () => ({ name: ordem.codigo }),
    collect: (monitor) => ({
      isOver: monitor.isOver({shallow: true}),
      canDrop: monitor.canDrop(),
    }),
  });

  function mudarLinhaProducao(e){
    dispatch(alterarLinhaSequenciamentoRequest(ordem.id, e, grupoSelecionado))
  }

  function renderBadge(){
    return (
      <Input
        bordered={false}
        className="ant-scroll-number ant-badge-count ant-badge-multiple-words"
        value={ordemInicial}
        type="number"
        onBlur={(e) => isNaN(ordemInicial) && setOrdemInicial(0)}
        onChange={(e) => setOrdemInicial(parseInt(e.target.value))}
      />
    )
  }

  function getBorderColorPorStatus() {
    return ordem.status === 'ABERTA' ? '#1890ff'
      : ordem.status === 'EM_SEPARACAO' ? '#ff4d4f'
        : ordem.status === 'EM_ANDAMENTO' ? '#90ee90'
          : 'inherit';
  }

  return <>
    <ModalExcluirOrdem
      visible={mostrarModalExcluirOrdem}
      onOk={excluirOrdemFabricacao}
      ordem={ordem}
      onCancel={()=>{setMostrarModalExcluirOrdem(false)}}
    />
    <div ref={criando ? undefined : drop} className={`area-drop ${isOver && !criando ? 'on-drag-enter' : ""}`}/>
    <div ref={drag} className="ordem-de-fabricacao">
      <Badge className='mudarDirection' count={renderBadge()}>
        <Index
          entity={ordem}
          percent={ordem.quantidadeFinalizada / ordem.quantidadeTotal}
          ordemInicial={ordemInicial}
          setOrdemInicial={setOrdemInicial}
        />
      </Badge>
      <div className={"detalhes-ordem"}
        style={{
          borderColor: getBorderColorPorStatus(),
          borderWidth: 2
        }}
      >
        <div className={"detalhes-ordem-item"}>
          <label>{getMessage("sequenciamento.info.codigo")}:&nbsp;</label>
          <span className={"codigoProduto"}>{ordem.codigoProduto}</span>
          <Tooltip title="Catálogo do Produto">
            <InfoCircleOutlined className={"icon-catalogo-produto"} onClick={() => handleShowModal(ordem.codigoProduto, ordem.descricaoProduto)}/>
          </Tooltip>
        </div>
        <div className={"detalhes-ordem-item"}>
          <label>{getMessage("sequenciamento.info.ordemProducao")}:&nbsp;</label><br/>{ordem.ordemProducao}
        </div>
        <div className={"detalhes-ordem-item"}>
          <label>{getMessage("sequenciamento.info.lista")}:&nbsp;</label>{ordem.lista || "00"}
        </div>
        <div className={"detalhes-ordem-item"}>
          <label>{getMessage("sequenciamento.info.roteiro")}:&nbsp;</label>{ordem.roteiro || "00"}
        </div>
        <div className={"detalhes-ordem-item"}>
          <label>{getMessage("sequenciamento.info.modelo")}:&nbsp;</label>{ordem.modelo}
        </div>
        <div className={"detalhes-ordem-item"}>
          <label>{getMessage("sequenciamento.info.comprimento")}:&nbsp;</label>{ordem.comprimento}
        </div>
        {ordem.comentarios && <div className={"detalhes-ordem-item"}>
          <label>
            {getMessage("sequenciamento.info.comentarios")}:
            &nbsp;
          </label>
          {ordem.comentarios.length > 26
            ? <Popover title={getMessage("sequenciamento.info.comentarios")}
                       content={ordem.comentarios}
                       placement="top">
              {ordem.comentarios.substring(0,26)}...
            </Popover>
            : ordem.comentarios}
        </div> }
        <div className={"detalhes-ordem-item"}>
          <label>{getMessage("sequenciamento.info.linha")}:&nbsp;</label><br/>
          <SelectAnt
              nomeAtributo={"linhaProducao"}
              list={formataListaParaSelect(linhasGrupo, "id", "nome")}
              allowClear
              value={ordem.linhaProducao?.id}
              semFormItem
              dropdownMatchSelectWidth={false}
              size={"small"}
              onChange={mudarLinhaProducao}
              isDisabled={!ordem.podeTrocarLinha}
              className={'linha-select'}
              style={{width: '100%', fontSize: 14}}
          />
        </div>
      </div>
    </div>
  </>
}
