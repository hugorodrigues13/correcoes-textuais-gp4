import React, {useEffect, useState} from "react"
import {useDrop} from "react-dnd";
import {ItemTypes} from "../ItemTypes";
import {Spin} from "antd";
import {useSelector} from "react-redux";
import {BsTrash} from "react-icons/all";


export default function AreaSucata(props) {
  const { loadingSerial, serialSelecionado } = useSelector(store => store.apoio)
  const linhaSelecionada = serialSelecionado.linhaDeProducao || {}
  const [lixeira, setLixeira] = useState(require("../../../images/trash.png"))


  useEffect(() => {

  }, [linhaSelecionada])

  const [{canDropTrash, isOverTrash}, dropTrash] = useDrop({
    accept: ItemTypes.PRODUTO,
    drop: () => ({id: 'Trash',
      callback: () => setLixeira(require("../../../images/trash_(Full).png"))}),
  });


  return (
    <Spin spinning={loadingSerial}>
      <div className={"area-sucata"} >
        <div ref={dropTrash}>
          <img style={{ width: 100 }} src={lixeira} alt="Logo" />
        </div>
      </div>
    </Spin>
  )


  function descartar (){
    console.log("Dropou na Sucata")
    //dispatch(descartarSerialRequest)
  }

}
