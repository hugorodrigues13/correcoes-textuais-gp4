import React, {useEffect} from 'react';
import {Button, Col, Form, Row} from "antd";
import {useDispatch} from "react-redux";
import {InputAnt} from "../../components/form/Input";
import {SelectAnt} from "../../components/form/SelectAnt";
import {getMessage} from "../../components/messages";
import {SelectFilter} from "../../components/form/SelectFilter";
import {
  transformacaoLoteAgruparRequest,
  transformacaoLotePesquisarLotesRequest, transformacaoLoteResetar
} from "../../store/modules/TransformacaoLote/action";
const minimoPesquisa = 2
const manterOpcoes = [
  {
    key: 'false',
    value: getMessage("transformacaoLote.agrupar.lote2.label")
  },
  {
    key: 'true',
    value: getMessage("transformacaoLote.agrupar.lote1.label"),
  }
]
function AgruparLotes(props) {

  const { lotesInfo, loading, visible } = props
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  useEffect(() => {
    resetar()
  }, [visible])

  function agrupar({lote1, lote2, manterLote1}){
    dispatch(transformacaoLoteAgruparRequest(lote1, lote2, manterLote1))
    resetar()
  }

  function resetar(){
    form.resetFields()
    dispatch(transformacaoLoteResetar())
  }

  return (
    <Form form={form} layout={"vertical"} onFinish={agrupar}>
      <Row gutter={24}>
        <Col span={6}>
          <SelectFilter
            isRequired
            nomeAtributo={"lote1"}
            label={getMessage("transformacaoLote.agrupar.lote1.label")}
            placeholder={getMessage("comum.digiteParaPesquisar.label")}
            onSearch={value => value.length >= minimoPesquisa && dispatch(transformacaoLotePesquisarLotesRequest(value, null))}
            list={lotesInfo?.lote1?.map(op => ({key: op, value: op}))}
          />

        </Col>
        <Col span={6}>
          <SelectFilter
            isRequired
            nomeAtributo={"lote2"}
            label={getMessage("transformacaoLote.agrupar.lote2.label")}
            placeholder={getMessage("comum.digiteParaPesquisar.label")}
            onSearch={value => value.length >= minimoPesquisa && dispatch(transformacaoLotePesquisarLotesRequest(null, value))}
            list={lotesInfo?.lote2?.map(op => ({key: op, value: op}))}
          />
        </Col>
        <Col span={4}>
          <SelectAnt
            isRequired
            nomeAtributo={"manterLote1"}
            label={getMessage("transformacaoLote.agrupar.manter.label")}
            list={manterOpcoes}
            initialValue={'true'}
          />
        </Col>
        <Col span={4}>
          <Button
            key="submit"
            type="primary"
            size="large"
            style={{marginTop: 30}}
            loading={loading}
            onClick={form.submit}
          >
            {getMessage("transformacaoLote.agrupar.label")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default AgruparLotes;
