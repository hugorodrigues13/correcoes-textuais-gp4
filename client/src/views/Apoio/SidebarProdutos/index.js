import React from "react";
import {useSelector} from "react-redux";
import {Spin} from "antd";
import Produto from "../Produto";
import {getMessage} from "../../../components/messages";



export default function SidebarProdutos() {
  const { loadingGrupo, seriaisDefeituosos } = useSelector(store => store.apoio)


  return (
    <Spin spinning={loadingGrupo}>
      <div className={`sidebar-serial`}>
        <div className={"sidebar-label"}>
          {getMessage("apoio.sidebar.label")}
        </div>
        <div className={"lista-seriais"}>
          {seriaisDefeituosos?.length > 0 ?
            <>
              {
                seriaisDefeituosos.map((produto, idx) => {
                  return <Produto produto={produto} key={idx} />
                })
              }
            </>
            : ""}
        </div>
      </div>
    </Spin>
  )
}
