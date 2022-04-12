import React, {useEffect} from "react";
import {Button, Col, Collapse, Form, Row} from "antd";
import {InputAnt} from "../../components/form/Input";
import {getMessage} from "../../components/messages";
import {FormattedMessage} from "react-intl";
import {listAlmoxarifadoRequest} from "../../store/modules/Almoxarifado/action";
import {useDispatch, useSelector} from "react-redux";
import {SelectFilter} from "../../components/form/SelectFilter";
import {formataListaDeStringsParaSelect} from "../../utils/formatador";
import {RangeDatePickerAnt} from "../../components/form/RangeDatePicker";

function Busca() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const almoxarifado = useSelector(store => store.almoxarifado)
  const { gruposLinhas, linhasProducao } = almoxarifado?.data

  function handleSearch() {
    dispatch(listAlmoxarifadoRequest(form.getFieldsValue()))
  }

  function onEnter(event){
    if (event.keyCode === 13) {
      form.submit()
    }
  }

  return (
    <Collapse style={{marginBottom: 10}} defaultActiveKey={1}>
      <Collapse.Panel header={getMessage("comum.filtro.label")} key={1}>
        <Form layout="vertical" onFinish={handleSearch} onKeyUp={onEnter} form={form}>
          <Row gutter={24}>
            <Col span={6}>
              <InputAnt nomeAtributo={"codigoProduto"} label={getMessage("almoxarifado.codigoDoProduto.label")}/>
            </Col>
            <Col span={6}>
              <InputAnt nomeAtributo={"ordemInterna"} label={getMessage("almoxarifado.ordemInterna.label")}/>
            </Col>
            <Col span={6}>
              <InputAnt nomeAtributo={"ordemProducao"} label={getMessage("almoxarifado.ordemProducao.label")}/>
            </Col>
            <Col span={6}>
              <InputAnt nomeAtributo={"codigoMp"} label={getMessage("almoxarifado.codigoMp.label")}/>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <SelectFilter
                nomeAtributo={"linhaProducao"}
                allowClear
                label={getMessage("almoxarifado.linhaProducao.label")}
                list={formataListaDeStringsParaSelect(linhasProducao || [])}
              />
            </Col>
            <Col span={6}>
              <SelectFilter
                nomeAtributo={"grupoLinhas"}
                allowClear
                label={getMessage("almoxarifado.grupoDeLinhas.label")}
                list={formataListaDeStringsParaSelect(gruposLinhas || [])}
              />
            </Col>
            <Col span={8}>
              <RangeDatePickerAnt
                nomeAtributo={"dataPrevisaoFinalizacao"}
                label={getMessage("almoxarifado.dataPrevisaoFinalizacao.label")}
              />
            </Col>
            <Col span={1}>
              <Button style={{marginTop: 30}} size={"large"} onClick={handleSearch} type={"primary"}>
                <FormattedMessage id={"comum.buscar.label"}/>
              </Button>
            </Col>
          </Row>
        </Form>
      </Collapse.Panel>
    </Collapse>
  )
}

export default Busca
