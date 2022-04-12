import React, { useEffect } from 'react'
import {FormattedMessage, injectIntl} from "react-intl";
import {connect, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {
  gerarRelatorioRequest,
  getDadosIniciaisRequest
} from "../../store/modules/Producao/action";
import {Button, Col, Form, PageHeader, Row, Spin} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import {RangeDatePickerAnt} from "../../components/form/RangeDatePicker";
import {SelectFilter} from "../../components/form/SelectFilter";
import { InputAnt } from '../../components/form/Input';

//filtrar por código de produto, mês e grupo de linhas

function RelatorioProducao(props) {
  const loading = props.requestManager.loading
  const { gruposLinhas } = useSelector(store => store.producao)
  const [form] = Form.useForm()

  useEffect(() => {
    props.getDadosIniciaisRequest()
  },[]);

  const handleGerar = (values) => props.gerarRelatorioRequest(values)

  return (
    <>
      <PageHeader
        ghost={false}
        onBack={() => history.push(CLIENT_URL + "/")}
        title={getMessage("relatorio.producao.title.label")}
      />
      <Spin spinning={loading}>
        <Form
          initialValues={{completo: "false"}}
          layout="vertical"
          form={form}
          onFinish={handleGerar}>
          <Row gutter={24}>
            <Col span={6}>
              <RangeDatePickerAnt
                dateFormat="MM/YYYY"
                picker={"month"}
                label={getMessage("relatorio.producao.form.mes.label")}
                nomeAtributo="periodo"/>
            </Col>
            <Col span={6}>
              <InputAnt
                  label={getMessage("relatorio.producao.form.codigoProduto.label")}
                  nomeAtributo="codigoProduto"
                  allowClear
              />
            </Col>
            <Col span={6}>
              <SelectFilter
                label={getMessage("relatorio.producao.form.grupo.label")}
                nomeAtributo="grupo"
                allowClear
                list={tratarStringParaSelect(gruposLinhas)}
              />
            </Col>
            <Col span={3}>
              <Button style={{width: '100%', marginTop: '29px'}} size="large" type="primary" htmlType="submit">
                <FormattedMessage id={"comum.gerar.label"}/>
              </Button>
            </Col>
          </Row>
          <Row gutter={24}>
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
  bindActionCreators({gerarRelatorioRequest, getDadosIniciaisRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RelatorioProducao))
