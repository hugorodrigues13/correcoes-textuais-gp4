import * as React from "react";
import {Form, Spin} from "antd";
import {getMessage} from "../../components/messages";
import {connect, useDispatch, useSelector} from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {useEffect, useState} from "react";
import PlanejamentoDiarioForm from "./Form";
import {
  planejamentoDiarioEditRequest,
  planejamentoDiarioNovoRequest,
  planejamentoDiarioPrepareEditRequest,
  planejamentoDiarioPrepareNewRequest
} from "../../store/modules/PlanejamentoDiario/action";

function PlanejamentoDiarioFormContainer(props) {

  const id = props.match.params.id
  const planejamentoDiario = useSelector(state => state.planejamentoDiario)
  const { loading } = useSelector(state => state.requestManager)
  const { entityInstance, linhasProducao, dias, turnos, gruposLinhaProducao } = planejamentoDiario
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    if (id){
      dispatch(planejamentoDiarioPrepareEditRequest(id))
    } else {
      dispatch(planejamentoDiarioPrepareNewRequest())
    }
  }, [])

  return (
    <>
      <CabecalhoForm
        isEdicao={id !== null}
        onBack={"/prog/planejamentoDiario"}
        titulo={getMessage(id ? "planejamentoDiario.edicao.title.label" : "planejamentoDiario.cadastro.title.label")}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <Spin spinning={loading}>

        <PlanejamentoDiarioForm
          form={form}
          linhasProducao={linhasProducao}
          turnos={turnos}
          gruposLinhaProducao={gruposLinhaProducao}
          entityInstance={entityInstance}
          onFinish={onFinish}
          dias={dias}
          isNovo={!id}
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
    if(id) {
      values.id = id;
      dispatch(planejamentoDiarioEditRequest(values))
    } else {
      dispatch(planejamentoDiarioNovoRequest(values))
      handleReset()
    }
  }
}


export default PlanejamentoDiarioFormContainer
