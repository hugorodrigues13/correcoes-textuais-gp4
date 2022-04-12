import * as React from 'react';
import {Form, Spin} from "antd";
import {connect, useDispatch, useSelector} from "react-redux";
import {getMessage} from "../../components/messages";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {useEffect} from "react";
import {
  acompanhamentoOPEditRequest,
  acompanhamentoOPPrepareEditRequest
} from "../../store/modules/AcompanhamentoOrdemProducao/action";
import AcompanhamentoForm from "./Form";

function AcompanhamentoFormContainer(props) {

  const { loading } = useSelector(state => state.requestManager)
  const { entityInstance, listTipoStatusOracle } = useSelector(state => state.acompanhamentoOrdemProducao)
  const id = props.match.params.id

  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(acompanhamentoOPPrepareEditRequest(id))
  }, [])

  return (
    <>
      <CabecalhoForm
        isEdicao={id !== null}
        onBack={"/prog/acompanhamentoOrdemProducao"}
        titulo={getMessage("acompanhamentoOrdemProducao.edicao.label")}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <Spin spinning={loading}>
        <AcompanhamentoForm
          form={form}
          entityInstance={entityInstance}
          listTipoStatusOracle={listTipoStatusOracle}
          onFinish={onFinish}
        />
      </Spin>
    </>
  )

  function handleSubmit(e) {
    e.preventDefault();
    form.submit()
  }

  function handleReset() {
    form.resetFields();
  }

  function onFinish(values) {
    values.id = id;
    dispatch(acompanhamentoOPEditRequest(values))
  }

}

export default AcompanhamentoFormContainer
