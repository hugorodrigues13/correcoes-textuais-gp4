import { Button, Col, Form, PageHeader, Row, Spin, Switch } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessage } from "../../components/messages";
import { SwitchAnt } from "../../components/form/Switch";
import GeracaoOrdemDeProducaoComOV from "./GeracaoComOV";
import GeracaoOrdemDeProducaoSemOV from "./GeracaoSemOV";
import history from "../../services/history";
import { CLIENT_URL } from "../../config";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import {
    gerarOrdemDeProducaoRequest, limparProdutos
} from "../../store/modules/GeracaoOrdemDeProducao/action";
import Alert from "react-s-alert"
import ImportarOrdensButton from "./ImportarOrdensButton";

const GeracaoOrdemDeProducaoForm = () => {
  const requestManager = useSelector(store => store.requestManager);
  const geracaoOrdemDeProducao = useSelector(store => store.geracaoOrdemDeProducao);
  const loading = requestManager.loading;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [comOV, setComOV] = useState(true);

  useEffect(() => {
    document.title = getMessage("geracaoOrdemDeProducao.title.label");
    dispatch(limparProdutos())
  }, [])

  useEffect(() => {
    if (comOV === false) {
      form.resetFields(["fornecedor", "roteiro", "lista"])
    } else {
      form.resetFields(["ordemDeVenda", "codigoProduto", "descricaoProduto"])
    }
    dispatch(limparProdutos())
  }, [comOV]);

  const handleClickGerar = (e) => {
    e.preventDefault();
    form.submit();
  }

  const handleSubmit = (values) => {
    if (comOV){
      const {ordensSelecionadas} = geracaoOrdemDeProducao;
      if (!ordensSelecionadas.length){
        Alert.error(getMessage("geracaoOrdemDeProducao.nenhumaOrdemSelecionada.label"))
        return;
      }
      if (ordensSelecionadas.some(o => !o.lista || !o.roteiro || !o.dataFinalizacao)){
        Alert.error(getMessage("geracaoOrdemDeProducao.ordemIncompleta.label"))
        return;
      }
      dispatch(gerarOrdemDeProducaoRequest({...values, ordensSelecionadas}))
    } else {
      if(values.lista === "00"){
        values.lista = null;
      }
      if(values.roteiro === "00"){
        values.roteiro = null;
      }
      values.dataPrevisaoFinalizacao = moment(values.dataPrevisaoFinalizacao).format("DD/MM/YYYY")
      dispatch(gerarOrdemDeProducaoRequest(values))
      dispatch(limparProdutos())
    }
  }

  return (
    <>
      <PageHeader
        ghost={false}
        onBack={() => history.push(CLIENT_URL + "/")}
        title={getMessage("geracaoOrdemDeProducao.title.label")}
        extra={[
          <div key="cabecalho">
            <Button
              size="large"
              onClick={handleClickGerar}
              type="primary"
            >
              <FormattedMessage id="comum.gerar.label" />
            </Button>

          </div>
        ]}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} onFinish={handleSubmit} form={form}>
          <Row gutter={24}>
            <Col span={22}>
              <SwitchAnt
                checkedChildren={"Sim"}
                unCheckedChildren={"Não"}
                onChange={(v) => {
                  setComOV(v);
                  dispatch(limparProdutos());
                }} initialValue={true} nomeAtributo={"comOV"} label={getMessage("geracaoOrdemDeProducao.comOV.label")} />
            </Col>
            {!comOV && <Col span={2} style={{marginTop: 35}}>
              <ImportarOrdensButton/>
            </Col>}
          </Row>
          <GeracaoOrdemDeProducaoComOV form={form} show={comOV} />
          <GeracaoOrdemDeProducaoSemOV form={form} show={!comOV} />
        </Form>
      </Spin>
    </>
  )
}

export default GeracaoOrdemDeProducaoForm
