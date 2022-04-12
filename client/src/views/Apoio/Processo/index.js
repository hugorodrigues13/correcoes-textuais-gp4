import React from "react";
import {useDrop} from "react-dnd";
import {ItemTypes} from "../ItemTypes";
import {Popconfirm} from "antd";



export default function Processo({processo}) {

  const [{canDrop, isOver}, drop] = useDrop({
    accept: [ItemTypes.PRODUTO],
    drop: () => ({id: processo.idProcesso, name: processo.value}),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });


  return (
    <div
      className={"processos"}
      ref={drop}
    >
      {processo.value}
    </div>
  )

}
