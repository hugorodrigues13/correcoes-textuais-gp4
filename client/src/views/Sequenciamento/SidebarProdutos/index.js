import AgrupamentoProdutos from "../AgrupamentoProdutos";
import React from "react";
import {useSelector} from "react-redux";
import {Spin} from "antd";
import {useDrop} from "react-dnd";
import {ItemTypes} from "../ItemTypes";
import {BsTrash2} from "react-icons/bs";
import {getMessage} from "../../../components/messages";

export default function SidebarProdutos({produtos, isProdutosSemGrupo, ordensDeFabricacao, grupoSelecionado, showTrashCan, setCriando}) {
  const { LoadingOrdensComGrupo } = useSelector(store => store.sequenciamento)
  const trashCan = ordensDeFabricacao.length && showTrashCan
  const [{canDropTrash, isOverTrash}, dropTrash] = useDrop({
    accept: ItemTypes.ORDEM,
    drop: () => ({name: 'Trash'}),
    collect: (monitor) => ({
      isOverTrash: monitor.isOver(),
      canDropTrash: monitor.canDrop(),
    }),
  });
  return (
    <Spin spinning={LoadingOrdensComGrupo}>
      <div
        className={`sidebar-produtos`}
        style={trashCan ? {border: '1px solid #2aabd2', borderStyle: 'dashed'} : {}}
        ref={trashCan ? dropTrash : undefined}
      >
        <AgrupamentoProdutos grupoSelecionado={grupoSelecionado} produtos={produtos} isProdutosSemGrupo={isProdutosSemGrupo} blur={trashCan} setCriando={setCriando}/>
        {trashCan ? (
          <div className="deletar-ordem-box">
            <p style={{color: "#2aabd2", textAlign: "center", fontSize: 16}}>
              {getMessage("sequenciamento.arrasteParaDeletar.label")}
            </p>
            <div className={"remove-item-div-drag"}>
              <BsTrash2
                className={"icon-remove-drag"}
                size={50}
                color={"#2aabd2"}/>
            </div>
          </div>
        ): null}
      </div>
    </Spin>
  )
}
