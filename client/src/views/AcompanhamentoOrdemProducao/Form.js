import * as React from 'react';
import {Col, Form, Row} from "antd";
import {useEffect} from "react";
import {InputNumberAnt} from "../../components/form/InputNumber";
import {getMessage} from "../../components/messages";
import {DatePickerAnt} from "../../components/form/DatePicker";
import {SelectAnt} from "../../components/form/SelectAnt";
import moment from "moment";
import {InputAnt} from "../../components/form/Input";

function AcompanhamentoForm(props){

  const { form, entityInstance, listTipoStatusOracle, onFinish } = props

  useEffect(() => {
    form.setFieldsValue({
      quantidade: entityInstance.quantidade,
      statusOracle: entityInstance.statusOracle,
      dataPrometida: moment(entityInstance.dataPrometida, "DD/MM/YYYY"),
      codigoOrdem: entityInstance.codigoOrdem
    })
  }, [entityInstance])

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={6}>
          <InputAnt
              disabled
              nomeAtributo="codigoOrdem"
              label={getMessage("acompanhamentoOrdemProducao.edicao.codigoOrdem.label")}
              message={getMessage("comum.obrigatorio.campo.message")}
          />
        </Col>
        <Col span={6}>
          <DatePickerAnt
            isRequired
            nomeAtributo="dataPrometida"
            disabledDate={disabledDate}
            label={getMessage("acompanhamentoOrdemProducao.edicao.dataPrometida.label")}
            message={getMessage("comum.obrigatorio.campo.message")}
          />
        </Col>
        <Col span={6}>
          <InputNumberAnt
            isRequired
            nomeAtributo="quantidade"
            min={entityInstance.totalPecasSequenciadas}
            max={entityInstance.quantidade}
            label={getMessage("acompanhamentoOrdemProducao.edicao.quantidade.label")}
            message={getMessage("comum.obrigatorio.campo.message")}
          />
        </Col>
        <Col span={6}>
          <SelectAnt
            isRequired
            ordenar
            nomeAtributo="statusOracle"
            list={preparaStatusParaSelect()}
            label={getMessage("acompanhamentoOrdemProducao.edicao.statusOracle.label")}
            message={getMessage("comum.obrigatorio.campo.message")}
          />
        </Col>
      </Row>
    </Form>
  )

  function disabledDate(current) {
    return current && current.isBefore(moment().startOf('day'));
  }

  function preparaStatusParaSelect(){
    return listTipoStatusOracle.map(s => ({key: s, value: getMessage(s)}))
  }

}

export default AcompanhamentoForm
