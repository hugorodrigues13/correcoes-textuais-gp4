import React from "react"
import {Spin} from "antd";
import {useSelector} from "react-redux";
import Apontamento from "../Apontamento";
import "../styles.css"
import {BsFillReplyFill} from "react-icons/all";


export default function AreaApontamentos() {
  const { serialSelecionado, loadingSerial } = useSelector(store => store.apoio)
  const historico = serialSelecionado.historicoDeApontamentos || []


  return (
    <Spin spinning={loadingSerial}>
      <div className={"area-apontamentos"}>
        {
          historico.length > 0 ?
            historico.map((apontamento, idx) => {
              return (
                <>
                  <Apontamento apontamento={apontamento} key={idx}/>
                  {++idx < historico.length ? <BsFillReplyFill/> : ""}
                </>
              )
            })
          : ""
        }
      </div>
    </Spin>

  )
}
