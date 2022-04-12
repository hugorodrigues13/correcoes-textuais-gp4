import * as React from "react";
import {Form, Spin} from "antd";
import {getMessage} from "../../components/messages";
import {injectIntl} from "react-intl";
import {bindActionCreators} from "redux";
import {connect, useDispatch, useSelector} from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {useEffect} from "react";
import {
  turnosEditRequest,
  turnosNovoRequest,
  turnosPrepareEditRequest,
  turnosPrepareNewRequest
} from "../../store/modules/Turno/action";
import TurnosForm from "./Form";

function TurnosFormContainer(props) {

  const id = props.match.params.id
  const turnos = useSelector(state => state.turnos)
  const { entityInstance, dias } = turnos
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    if (id){
      dispatch(turnosPrepareEditRequest(id))
    } else {
      dispatch(turnosPrepareNewRequest())
    }
  }, [])

  return (
    <>
      <CabecalhoForm
        isEdicao={id !== null}
        onBack={"/cad/turno"}
        titulo={getMessage(id ? "turnos.edicao.title.label" : "turnos.cadastro.title.label")}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <Spin spinning={props.requestManager.loading}>
        <TurnosForm form={form} dias={dias} entityInstance={entityInstance} onFinish={onFinish}/>
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
      dispatch(turnosEditRequest(values))
    } else {
      dispatch(turnosNovoRequest(values))
      handleReset()
    }
  }

}

const mapStateToProps = store => ({
  turnos: store.turnos,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({turnosEditRequest, turnosNovoRequest, turnosPrepareEditRequest, turnosPrepareNewRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TurnosFormContainer))
