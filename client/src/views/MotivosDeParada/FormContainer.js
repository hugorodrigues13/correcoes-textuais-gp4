import * as React from "react";
import {Form, Spin} from "antd";
import {getMessage} from "../../components/messages";
import MotivosDeParadaForm from "./Form";
import {injectIntl} from "react-intl";
import {bindActionCreators} from "redux";
import {
  motivoParadaEditRequest,
  motivoParadaListRequest, motivoParadaNewRequest,
  motivoParadaPrepareEditRequest,
  motivoParadaPrepareNewRequest
} from "../../store/modules/MotivosDeParada/action";
import {connect, useDispatch, useSelector} from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {useEffect} from "react";

function MotivosDeParadaFormContainer(props) {

  const id = props.match.params.id
  const motivoParada = useSelector(state => state.motivoParada)
  const { entityInstance, tipos, listGrupoRecurso } = motivoParada
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    if (id){
      dispatch(motivoParadaPrepareEditRequest(id))
    } else {
      dispatch(motivoParadaPrepareNewRequest())
    }
  }, [])

  return (
    <>
      <CabecalhoForm
        isEdicao={id !== null}
        onBack={"/cad/motivoDeParada"}
        titulo={getMessage(id ? "motivoDeParada.edicao.title.label" : "motivoDeParada.cadastro.title.label")}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <Spin spinning={props.requestManager.loading}>
        <MotivosDeParadaForm form={form} tipos={tipos} entityInstance={entityInstance} listGrupoRecurso={listGrupoRecurso} onFinish={onFinish}/>
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
      dispatch(motivoParadaEditRequest(values))
    } else {
      dispatch(motivoParadaNewRequest(values))
      handleReset()
    }
  }

}


const mapStateToProps = store => ({
  motivoParada: store.motivoParada,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({motivoParadaEditRequest, motivoParadaNewRequest, motivoParadaPrepareEditRequest, motivoParadaPrepareNewRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MotivosDeParadaFormContainer))
