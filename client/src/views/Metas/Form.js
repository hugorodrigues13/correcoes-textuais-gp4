import React, { useEffect } from 'react';
import { getMessage } from "../../components/messages";
import { Col, Form, Row } from "antd";
import { SelectAnt } from "../../components/form/SelectAnt";
import { InputNumberAnt } from "../../components/form/InputNumber";
import moment from 'moment';
import {RangeDatePickerAnt} from "../../components/form/RangeDatePicker";

export default function MetasForm(props) {
  const { form, entityInstance, onFinish, linhasDeProducao } = props;

  useEffect(() => {
    form.setFieldsValue({
      linhaDeProducao: entityInstance.linhaDeProducao,
      metaReprocessos: entityInstance.metaReprocessos,
      metaHK: entityInstance.metaHK,
      vigencia: entityInstance.inicioVigencia
        && entityInstance.fimVigencia
        && [moment(entityInstance.inicioVigencia), moment(entityInstance.fimVigencia)],
    })
  }, [entityInstance])

  return (
    <Form form={form} layout={"vertical"} onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={8}>
          <SelectAnt
            isRequired
            nomeAtributo="linhaDeProducao"
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("meta.form.linhaDeProducao.label")}
            list={formataLinhasDeProducaoParaSelect()}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            min={0}
            max={100}
            formatter={value => `${value}%`}
            isRequired
            nomeAtributo="metaReprocessos"
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("meta.form.metaReprocessos.label")}
          />
        </Col>
        <Col span={8}>
          <InputNumberAnt
            min={0}
            max={100}
            formatter={value => `${value}%`}
            isRequired
            nomeAtributo="metaHK"
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("meta.form.metaHK.label")}
          />
        </Col>
        <Col span={8}>
          <RangeDatePickerAnt
            isRequired
            nomeAtributo="vigencia"
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("meta.form.vigencia.label")}
            dateFormat={'DD/MM/YYYY HH:mm'}
            showTime={true}
            onCalendarChange={console.log}
          />
        </Col>
      </Row>
    </Form>
  )

  function formataLinhasDeProducaoParaSelect() {
    return linhasDeProducao.map(linha => ({ key: linha.id, value: linha.nome }));
  }
}
