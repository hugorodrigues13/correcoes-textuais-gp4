import React, {useEffect, useState} from 'react'
import {FormattedMessage, injectIntl} from "react-intl";
import {connect, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {
  gerarRelatorioSerialRequest,
  getDadosIniciaisRequest,
  pesquisarDadosRequest
} from "../../store/modules/Relatorios/action";
import {Button, Col, Form, PageHeader, Radio, Row, Spin} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import {RangeDatePickerAnt} from "../../components/form/RangeDatePicker";
import moment from "moment";
import Alert from "react-s-alert";
import {SelectAnt} from "../../components/form/SelectAnt";
import {SelectFilter} from "../../components/form/SelectFilter";
const minimoPesquisa = 2
function RelatorioSerial(props) {

  const loading = props.requestManager.loading
  const {gruposLinhas, linhasProducao, dadosSeriais} = useSelector(store => store.relatorios)
  const [lote, setLote] = useState(null);
  const [ordemProducao, setOrdemProducao] = useState(null);
  const [ordemFabricacao, setOrdemFabricacao] = useState(null)
  const [periodoRequired, setPeriodoRequired] = useState(null);
  const [dates, setDates] = useState([]);
  const [form] = Form.useForm()

  useEffect(() => {
    props.getDadosIniciaisRequest()
  },[]);

  useEffect(() => {
    const hasLote = !!lote && (Array.isArray(lote) && lote.length !== 0)
    const hasOF = !!ordemFabricacao && (Array.isArray(ordemFabricacao) && ordemFabricacao.length !== 0)
    const hasOP = !!ordemProducao && (Array.isArray(ordemProducao) && ordemProducao.length !== 0)
    setPeriodoRequired(hasLote||hasOF||hasOP);
  }, [ordemFabricacao, ordemProducao, lote]);

  const opcoesStatusOF = ((props.relatorios.statusOrdemFabricacao || []).map(value => {
    return {
      key: value,
      value: getMessage(`ordemFabricacao.filtro.status.${value}.label`)
    }
  }) || [])

  useEffect(() => {
    if(props.relatorios.statusOrdemFabricacao) {
      form.setFieldsValue({statusOrdemFabricacao: props.relatorios.statusOrdemFabricacao.map(v => v)})
    }
  }, [props])

  function handleGerar(values) {
    if (periodoRequired) {
      if (values.periodo) {
        if(dates[0] && dates[1] && dates[1].diff(dates[0], 'days') > 30){
          Alert.error(getMessage("relatorio.serial.form.dataLimite.alert.error"))
          return
        } else {
          values.periodo = values.periodo[0].format("DD/MM/YYYY HH") + ";" + values.periodo[1].format("DD/MM/YYYY HH");
        }
      }
    } else {
      if (!values.periodo) {
        values.periodo = moment().add(-30, "day").format("DD/MM/YYYY HH") + ";" + moment().format("DD/MM/YYYY HH");
      } else {
        if(dates[0] && dates[1] && dates[1].diff(dates[0], 'days') > 30){
          Alert.error(getMessage("relatorio.serial.form.dataLimite.alert.error"))
          return
        } else {
          values.periodo = values.periodo[0].format("DD/MM/YYYY HH") + ";" + values.periodo[1].format("DD/MM/YYYY HH");
        }
      }
    }
    props.gerarRelatorioSerialRequest(values);
  }

  return (
    <>
      <PageHeader
        ghost={false}
        onBack={() => history.push(CLIENT_URL + "/")}
        title={getMessage("relatorio.serial.title.label")}
      />
      <Spin spinning={loading}>
        <Form
          initialValues={{completo: "false"}}
          layout="vertical"
          form={form}
          onFinish={handleGerar}>
          <Row gutter={24}>
            <Col span={8}>
              <RangeDatePickerAnt
                dateFormat="DD/MM/YYYY HH:00"
                showTime={{format: 'HH'}}
                onCalendarChange={val => setDates(val)}
                label={getMessage("relatorio.serial.form.periodo.label")}
                nomeAtributo="periodo"/>
            </Col>
            <Col span={8}>
              <SelectFilter
                label={getMessage("relatorio.serial.form.ordemProducao.label")}
                nomeAtributo="ordemProducao"
                modo={"multiple"}
                maxTagCount={2}
                allowClear
                placeholder={getMessage("comum.digiteParaPesquisar.label")}
                onSearch={value => value.length >= minimoPesquisa && props.pesquisarDadosRequest(null, null, null, value, dadosSeriais)}
                onChange={e => setOrdemProducao(e)}
                list={tratarStringParaSelect(dadosSeriais?.ordensProducao)}
              />
            </Col>
            <Col span={8}>
              <SelectFilter
                label={getMessage("relatorio.serial.form.ordemFabricacao.label")}
                nomeAtributo="ordemFabricacao"
                modo={"multiple"}
                maxTagCount={2}
                onChange={e => setOrdemFabricacao(e)}
                placeholder={getMessage("comum.digiteParaPesquisar.label")}
                allowClear
                onSearch={value => value.length >= minimoPesquisa && props.pesquisarDadosRequest(null, null, value, null, dadosSeriais)}
                list={tratarStringParaSelect(dadosSeriais?.ordensFabricacao)}
              />
            </Col>

          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <SelectFilter
                  label={getMessage("relatorio.serial.form.codigoProduto.label")}
                  placeholder={getMessage("comum.digiteParaPesquisar.label")}
                  nomeAtributo="codigoProduto"
                  modo={"multiple"}
                  maxTagCount={2}
                  allowClear
                  onSearch={value => value.length >= minimoPesquisa && props.pesquisarDadosRequest(null, value, null, null, dadosSeriais)}
                  list={tratarStringParaSelect(dadosSeriais?.codigosProduto)}
              />
            </Col>
            <Col span={8}>
              <SelectFilter
                label={getMessage("relatorio.serial.form.grupo.label")}
                nomeAtributo="grupo"
                allowClear
                list={tratarStringParaSelect(gruposLinhas)}
              />
            </Col>
            <Col span={8}>
              <SelectFilter
                label={getMessage("relatorio.serial.form.linha.label")}
                nomeAtributo="linha"
                modo={"multiple"}
                maxTagCount={1}
                allowClear
                list={tratarStringParaSelect(linhasProducao)}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <SelectFilter
                label={getMessage("relatorio.serial.form.lote.label")}
                placeholder={getMessage("comum.digiteParaPesquisar.label")}
                nomeAtributo="lote"
                modo={"multiple"}
                maxTagCount={2}
                onChange={e => setLote(e)}
                onSearch={value => value.length >= minimoPesquisa && props.pesquisarDadosRequest(value, null, null, null, dadosSeriais)}
                allowClear
                list={tratarStringParaSelect(dadosSeriais?.lotes)}
              />
            </Col>
            <Col span={8}>
              <SelectAnt
                label={getMessage("relatorio.serial.form.statusOrdemFabricacao.label")}
                nomeAtributo="statusOrdemFabricacao"
                allowClear
                maxTagCount={1}
                modo={"multiple"}
                list={opcoesStatusOF}
              />
            </Col>
            <Col span={5}>
              <Form.Item
                name="completo"
                label={getMessage("relatorio.serial.form.tipo.label")}>
                <Radio.Group>
                  <Radio value="false">{getMessage("relatorio.serial.form.tipo.resumido.label")}</Radio>
                  <Radio value="true">{getMessage("relatorio.serial.form.tipo.detalhado.label")}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button style={{width: '100%', marginTop: '25px'}} size="large" type="primary" htmlType="submit">
                <FormattedMessage id={"comum.gerar.label"}/>
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  )

  function tratarStringParaSelect(list){
    return (list || []).map(l => ({key: l, value: l}))
  }

}

const mapStateToProps = store => ({
  relatorios: store.relatorios,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({gerarRelatorioSerialRequest, getDadosIniciaisRequest, pesquisarDadosRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RelatorioSerial))
