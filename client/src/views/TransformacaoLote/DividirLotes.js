import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Row, Transfer} from "antd";
import {SelectFilter} from "../../components/form/SelectFilter";
import {
  transformacaoLoteBuscarCaixasRequest, transformacaoLoteDividirLoteRequest,
  transformacaoLotePesquisarLotesRequest, transformacaoLoteResetar
} from "../../store/modules/TransformacaoLote/action";
import {injectIntl} from "react-intl";
const minimoPesquisa = 2
function DividirLotes(props) {

  const [caixasSelecionadas, setCaixasSelecionadas] = useState([])
  const { lotesInfo, loading, visible } = props
  const { caixas } = useSelector(store => store.transformacaoLote)
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  useEffect(() => {
    resetar()
  }, [visible])

  useEffect(() => {
    setCaixasSelecionadas([])
  }, [caixas])

  function dividir({lote, caixas}){
    dispatch(transformacaoLoteDividirLoteRequest(lote, caixas))
    resetar()
  }

  function buscarCaixas(lote){
    dispatch(transformacaoLoteBuscarCaixasRequest(lote))
  }

  function resetar(){
    setCaixasSelecionadas([])
    form.resetFields()
    dispatch(transformacaoLoteResetar())
  }
  return (
    <Form form={form} layout={"vertical"} onFinish={dividir}>
      <Row gutter={24}>
        <Col span={6}>
          <SelectFilter
            isRequired
            nomeAtributo={"lote"}
            label={getMessage("transformacaoLote.dividir.lote.label")}
            placeholder={getMessage("comum.digiteParaPesquisar.label")}
            onChange={buscarCaixas}
            onSearch={value => value.length >= minimoPesquisa && dispatch(transformacaoLotePesquisarLotesRequest(value, null))}
            list={lotesInfo?.lote1?.map(op => ({key: op, value: op}))}
          />
        </Col>
        <Col span={4}>
          <Button
            key="submit"
            type="primary"
            size="large"
            style={{marginTop: 30}}
            loading={loading}
            disabled={!caixas?.length}
            onClick={form.submit}
          >
            {getMessage("transformacaoLote.dividir.label")}
          </Button>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label={getMessage("transformacaoLote.dividir.caixas.label")}
            name={"caixas"}
            rules={[{
              required: true,
              validator: (_, value) => {
                if (value?.length >= 1 && caixas.length - value?.length >= 1){
                  return Promise.resolve()
                }
                return Promise.reject(new Error(getMessage("transformacaoLote.dividir.selecione.caixas.label")));
              }
            }]}
          >
            <Transfer
              dataSource={caixas}
              listStyle={{width: "100%"}}
              locale={{
                itemUnit: "",
                itemsUnit: "",
                notFoundContent: "",
                selectAll: getMessage("defeito.grupoRecurso.transferOption.selectAll.label"),
                selectCurrent: getMessage("defeito.grupoRecurso.transferOption.selectCurrent.label"),
                selectInvert: getMessage("defeito.grupoRecurso.transferOption.selectInvert.label"),
              }}
              titles={[getMessage("transformacaoLote.dividir.loteAntigo.label"), getMessage("transformacaoLote.dividir.novoLote.label")]}
              render={caixa => getMessage("transformacaoLote.dividir.caixaN.label", {caixa: caixa.numero})}
              rowKey={caixa => caixa.id}
              onChange={ (item) => setCaixasSelecionadas(item) }
              targetKeys={caixasSelecionadas}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  function getMessage(id, argumentos) {
    return props.intl.formatMessage({id: id}, {...argumentos})
  }

}

export default injectIntl(DividirLotes);
