import React, {useState} from "react";
import {useDrag} from "react-dnd";
import {ItemTypes} from "../ItemTypes";
import {Tooltip} from 'antd';
import {
  buscarCatalogoDoProdutoRequest,
  cancelaDrop,
  setOrdemPosAnterior,
  setProdutoSelecionado
} from "../../../store/modules/Sequenciamento/action";
import {useDispatch} from "react-redux";
import {InfoCircleOutlined} from "@ant-design/icons";

export default function Produto({produto, canDrag, setCriando}) {
  const name = `${produto.codigoProduto}-${produto.ordemDeProducao}`
  const dispatch = useDispatch()

  const [{ isDragging }, drag] = useDrag({
    item: { name, type: ItemTypes.PRODUTO },
    begin: () => {
      setCriando(true)
    },
    end: (item, monitor) => {
      setCriando(false)
      const dropResult = monitor.getDropResult();
      const didDrop = monitor.didDrop();
      if(!didDrop) {
        dispatch(cancelaDrop())
      } else if (item && dropResult) {
        dispatch(setProdutoSelecionado(produto))
        if(dropResult.name !== "Sequenciamento") {
          dispatch(setOrdemPosAnterior(dropResult.name))
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  function handleShowModal() {
    dispatch(buscarCatalogoDoProdutoRequest(produto.codigoProduto, produto.descricaoProduto));
  }

  return (
    <>
    <div className={"linha-produto"}>
      <Tooltip placement="right" title={produto.descricaoProduto}>
        <div
          className={`draggable-product ${canDrag ? '' : 'not-draggable'}`}
          ref={canDrag ? drag : null}
        >
          {`${produto.ordemDeProducao} - ${produto.codigoProduto} (${produto.quantidade})`}
        </div>

      </Tooltip>
      <Tooltip title="Catálogo do Produto">
        <InfoCircleOutlined onClick={handleShowModal}/>
      </Tooltip>
    </div>
    </>
  )
}
