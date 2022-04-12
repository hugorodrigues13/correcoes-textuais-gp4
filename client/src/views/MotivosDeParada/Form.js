import * as React from "react";
import {Col, Form, Row, Transfer} from "antd";
import {useEffect, useState} from "react";
import {InputAnt} from "../../components/form/Input";
import {getMessage} from "../../components/messages";
import {SelectAnt} from "../../components/form/SelectAnt";

function MotivosDeParadaForm(props) {

  const { form, entityInstance, tipos, onFinish, listGrupoRecurso } = props
  const [gruposRecurso, setGruposRecurso] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      motivo: entityInstance.motivo,
      tipo: entityInstance.tipo,
      gruposRecurso: entityInstance.gruposRecurso
    })
    if(entityInstance.gruposRecurso) {
      setGruposRecurso(entityInstance.gruposRecurso)
    } else {
      setGruposRecurso([])
    }
  }, [entityInstance])

  function prepareOnFinish(values){
    onFinish(values)
    setGruposRecurso([])
  }

  return (
    <Form form={form} layout={"vertical"} onFinish={prepareOnFinish}>
      <Row gutter={24}>
        <Col span={16}>
          <InputAnt
            isRequired
            nomeAtributo="motivo"
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("motivoDeParada.form.motivo.label")}
          />
        </Col>
        <Col span={8}>
          <SelectAnt
            isRequired
            nomeAtributo="tipo"
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("motivoDeParada.form.tipo.label")}
            list={formataTiposParaSelect()}
          />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label={getMessage("motivoDeParada.form.gruposRecurso.label")}
            name={"gruposRecurso"}
          >
            <Transfer
              dataSource={listGrupoRecurso}
              listStyle={{width: "100%"}}
              locale={{
                itemUnit: "",
                itemsUnit: "",
                notFoundContent: "",
                selectAll: getMessage("defeito.grupoRecurso.transferOption.selectAll.label"),
                selectCurrent: getMessage("defeito.grupoRecurso.transferOption.selectCurrent.label"),
                selectInvert: getMessage("defeito.grupoRecurso.transferOption.selectInvert.label"),
              }}
              titles={["", getMessage("comum.selecionados.label")]}
              render={item => item.nome}
              onChange={ (item) => setGruposRecurso(item) }
              targetKeys={gruposRecurso}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  function formataTiposParaSelect(){
    return tipos.map(tipo => ({key: tipo, value: getMessage(`motivoDeParada.tipo.${tipo}.label`)}))
  }

}

export default MotivosDeParadaForm;
