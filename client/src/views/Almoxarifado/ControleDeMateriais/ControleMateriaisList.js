import * as React from 'react';
import {Button, Col, Empty, Form, Pagination, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {listAlmoxarifadoRequest, listarMateriaisRequest} from "../../../store/modules/Almoxarifado/action";
import {InputAnt} from "../../../components/form/Input";
import {getMessage} from "../../../components/messages";
import {FormattedMessage} from "react-intl";
import {useEffect, useState} from "react";
import AlmofarixadoItem from "../AlmofarixadoItem";
import MaterialItem from "./MaterialItem";
import {renderEmpty} from "../commons";

function ControleMateriaisList() {

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const almoxarifado = useSelector(store => store.almoxarifado)
  const materiais =  almoxarifado.materiais || {}
  const [paginationPage, setPaginationPage] = useState(1)
  const [paginationSize, setPaginationSize] = useState(12)

  function getList(){
    dispatch(listarMateriaisRequest({
      ...form.getFieldsValue(),
      max: paginationSize,
      offset: paginationSize * (paginationPage - 1),
    }))
  }

  useEffect(() => {
    getList()
  }, [paginationPage, paginationSize])

  function onEnter(event){
    if (event.keyCode === 13) {
      form.submit()
    }
  }

  function renderBusca() {
    return (
      <Form layout="vertical" onFinish={getList} onKeyUp={onEnter} form={form}>
        <Row gutter={24}>
          <Col span={5}>
            <InputAnt nomeAtributo="recurso" label={getMessage("almoxarifado.controleMateriais.filtro.recurso.label")}/>
          </Col>
          <Col span={5}>
            <InputAnt nomeAtributo="linhaProducao" label={getMessage("almoxarifado.controleMateriais.filtro.linhaProducao.label")}/>
          </Col>
          <Col span={5}>
            <InputAnt nomeAtributo="codigoProduto" label={getMessage("almoxarifado.controleMateriais.filtro.codigoProduto.label")}/>
          </Col>
          <Col span={6}>
            <InputAnt nomeAtributo="descricaoProduto" label={getMessage("almoxarifado.controleMateriais.filtro.descricaoProduto.label")}/>
          </Col>
          <Col span={1}>
            <Button style={{marginTop: 30}} size={"large"} onClick={getList} type={"primary"}>
              <FormattedMessage id={"comum.buscar.label"}/>
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

  function renderLista() {
    const {entities, total} = materiais
    function renderItems() {
      return (
        entities.map(item => <MaterialItem item={item}/>)
      )
    }

    return (
      <>
        <div style={{borderRadius: '2px', border: '1px solid #d9d9d9', padding: '30px'}}>
          <Row gutter={[24, 48]}>
            {
              entities && entities.length !== 0
                ? renderItems()
                : renderEmpty()
            }
          </Row>
        </div>
        <Pagination
          showSizeChanger
          total={total}
          current={paginationPage}
          pageSize={paginationSize}
          pageSizeOptions={[12,24,36,48]}
          onChange={onChangePage}
          style={{float: 'right', marginTop: '10px'}}
        />
      </>
    )
  }

  return (
    <>
      {renderBusca()}
      {renderLista()}
    </>
  )

  function onChangePage(page, pageSize) {
    setPaginationPage(page)
    setPaginationSize(pageSize)
  }


}

export default ControleMateriaisList
