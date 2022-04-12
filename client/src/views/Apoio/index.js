import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Col, Empty, PageHeader, Row, Select} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import SidebarProdutos from "./SidebarProdutos/index";
import AreaSequenciamento from "../Apoio/AreaSequenciamento";
import AreaApontamentos from "./AreaApontamentos";
import "./styles.css"
import {
  buscarGrupoLinhasDeProducaoRequest,
} from "../../store/modules/Apoio/action"
import AreaSucata from "./AreaSucata";

export default function Apoio({getMessage, gruposLinhasDeProducao}) {

  const {Option} = Select;
  const dispatch = useDispatch();
  const [isGrupoSelecionado, setIsGrupoSelecionado] = useState(false)

  return (
    <>
      <PageHeader
        className={"header-apoio"}
        ghost={false}
        onBack={() => history.push(CLIENT_URL)}
        title={getMessage("apoio.title.label")}
      />

      <Select
        style={{width: "100%", marginBottom: '15px'}}
        size={"large"}
        onChange={handleSelectGrupo}
        placeholder={getMessage("apoio.grupolinhaProducao.placeholder")}
      >
        {gruposLinhasDeProducao.map((grupo) => {
          return (
            <Option
              value={grupo.id}
              key={grupo.id}
            >{grupo.nome}</Option>
          )
        })}
      </Select>
        {
            gruposLinhasDeProducao && gruposLinhasDeProducao.length === 0 &&
            <Empty
                description={getMessage("apoio.nenhum.serial.label")}
            />
        }
      {
        isGrupoSelecionado ?
          <div layout={"vertical"}>
            <Row gutter={24}>
              <Col span={4}>
                <SidebarProdutos/>
              </Col>

              <Col span={20}>
                <Row gutter={24}>
                  <Col span={20}>
                    <AreaSequenciamento/>
                  </Col>
                  <Col span={4}>
                    <AreaSucata/>
                  </Col>
                </Row>

                <br/>

                <Row gutter={24}>
                  <Col span={24}>
                    <AreaApontamentos/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          : ""
      }
    </>
  )

  function handleSelectGrupo(id) {
    dispatch(buscarGrupoLinhasDeProducaoRequest(id))
    setIsGrupoSelecionado(true)
  }
}
