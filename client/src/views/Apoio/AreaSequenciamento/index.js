import React from "react"
import {Space, Spin} from "antd";
import {useSelector} from "react-redux";
import Processo from "../Processo";
import {BsArrowRight} from "react-icons/all";



export default function AreaSequenciamento() {
  const { loadingSerial, serialSelecionado } = useSelector(store => store.apoio)
  const linhaSelecionada = serialSelecionado.linhaDeProducao || {}
  return (
    <Spin spinning={loadingSerial}>
      <div className={"area-reprocesso-apoio"} >
        <Space direction={"horizontal"} size={10}>

          {linhaSelecionada.processos?.length > 0 ?
            <>
              <div className={"area-reprocesso-apoio-titulo"}>
                {linhaSelecionada.nome}
                <div style={{marginLeft: '5px'}} className={"apoio-versao-select"}>V{linhaSelecionada.versao}</div>
              </div>
              {
                linhaSelecionada.processos.map((processo, idx) => {
                  return (
                    <>
                      <Processo processo={processo} key={processo.idProcesso}/>
                      {++idx < linhaSelecionada.processos.length ? <BsArrowRight /> : ""}
                    </>
                  )
                })
              }
            </>
            : ""
          }

        </Space>
      </div>
    </Spin>
  )
}
