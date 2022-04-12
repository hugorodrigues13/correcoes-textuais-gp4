import React from "react";
import {Col, Row} from "antd";
import "../styles.css"

export default function Apontamento({apontamento}) {


  return (
    <div className={"apontamento"}>
      <Col span={6}>
        <Row gutter={6} className={"apontamento-data"}>
          {apontamento.data}
        </Row>

        <Row gutter={6} className={"apontamento-recurso"}>
          {apontamento.recurso}
        </Row>

        <Row gutter={6} className={"apontamento-defeito"}>
          {apontamento.defeito}
        </Row>
      </Col>
    </div>
  )
}
