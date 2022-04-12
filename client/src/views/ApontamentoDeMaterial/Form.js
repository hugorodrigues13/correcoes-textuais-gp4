import * as React from 'react';
import {Button, Col, Form, Radio, Row} from "antd";
import {InputNumberAnt} from "../../components/form/InputNumber";
import {getMessage} from "../../components/messages";
import {useState} from "react";
import {FormattedMessage} from "react-intl";
import {SelectFilter} from "../../components/form/SelectFilter";
import {useDispatch, useSelector} from "react-redux";
import {
  apontarRequest,
  buscarLotesDisponiveisRequest,
  buscarMateriaisRequest,
  buscarOrdensDeProducaoRequest,
  importarArquivoRequest
} from "../../store/modules/ApontamentoDeMaterial/action";
import {SelectAnt} from "../../components/form/SelectAnt";
import BotaoImportacaoComModal from "../../components/BotaoImportacaoComModal";
const minimoPesquisa = 2;

const ApontamentoDeMaterialForm = () => {
  const { ordensDeProducao, materiais, lotesDisponiveis } = useSelector(store => store.apontamentoDeMaterial)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [lote, setLote] = useState()
  const tipos = ["CONSUMO", "RETORNO"]

  const buscaOrdensDeProducao = (ordemDeProducao) => {
    dispatch(buscarOrdensDeProducaoRequest(ordemDeProducao))
  }

  const buscaMateriais = (ordemDeProducao) => {
    dispatch(buscarMateriaisRequest(ordemDeProducao))
  }

  const buscaLotesDisponiveis = (material) => {
    dispatch(buscarLotesDisponiveisRequest(materiais.find(m => m.codigoProduto === material)))
  }

  const handleSelectLote = (lote) => {
    setLote(lotesDisponiveis.find(l => l.numeroLote === lote))
  }

  const handleUploadArquivoImportacao = (formData) => {
    dispatch(importarArquivoRequest(formData))
  }

  const onFinish = (values) => {
    const {material, lote, ...entity} = values
    dispatch(apontarRequest({...entity, codigoProduto: material, codigoLote: lote}))
    form.resetFields()
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={8}>
          <SelectFilter
            nomeAtributo="ordemDeProducao"
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("apontamentoDeMaterial.ordemDeProducao.label")}
            maxTagCount={2}
            allowClear
            onSearch={value => value.length >= minimoPesquisa && buscaOrdensDeProducao(value)}
            onChange={buscaMateriais}
            list={ordensDeProducao.map(l => ({key: l, value: l}))}
          />
        </Col>
        <Col span={8}>
          <SelectFilter
            nomeAtributo="material"
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("apontamentoDeMaterial.material.label")}
            maxTagCount={2}
            onChange={buscaLotesDisponiveis}
            allowClear
            list={materiais.map(l => ({key: l.codigoProduto, value: l.codigoProduto}))}
          />
        </Col>
        <Col span={8}>
          <SelectFilter
            nomeAtributo="lote"
            isRequired
            message={getMessage("comum.obrigatorio.campo.message")}
            label={getMessage("apontamentoDeMaterial.lote.label")}
            maxTagCount={2}
            onChange={handleSelectLote}
            allowClear
            list={lotesDisponiveis.map(l => ({key: l.numeroLote, value: `Número: ${l.numeroLote}, Qtd. Disp.: ${l.quantidadeDisponivel}`}))}
          />
        </Col>
        <Col md={8}>
          <InputNumberAnt isRequired
                          min={0}
                          message={getMessage("comum.obrigatorio.campo.message")}
                          label={getMessage("apontamentoDeMaterial.quantidade.label")}
                          rules={
                            [{
                              validator: (_, value) => {
                                console.log(value)
                                console.log(lote.quantidadeDisponivel)
                                if (!value || !lote || lote.quantidadeDisponivel >= value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(getMessage("apontamentoDeMaterial.quantidadeMaiorQueDisponivel.label")));
                              }
                            }]
                          }
                          nomeAtributo={"quantidade"} disabled={!lote} />
        </Col>
        <Col md={8}>
          <SelectAnt
            nomeAtributo="tipo"
            ordenar={false}
            isRequired
            label={getMessage("apontamentoDeMaterial.tipo.label")}
            list={tipos.map(t => ({key: t, value: getMessage(`apontamentoDeMaterial.tipo.${t}`)}))} />
        </Col>
        <Col md={2}>
          <BotaoImportacaoComModal style={{marginTop: 30}}
                                   onUpload={handleUploadArquivoImportacao}
                                   arquivoModelo={require("../../images/modelo apontamento de material.xls")}
                                   mensagem={getMessage("apontamentoDeMaterial.importarModal.content.label")} />
        </Col>
        <Col span={6}>
          <Button style={{marginTop: 30, width: '100%'}} size="large" type="primary" htmlType="submit">
            <FormattedMessage id={"apontamentoDeMaterial.apontar.label"}/>
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default ApontamentoDeMaterialForm
