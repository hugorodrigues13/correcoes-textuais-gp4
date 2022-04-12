import React, { useEffect } from 'react';

import { Form, Spin } from "antd";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import MetasForm from './Form';

import {
  metaEditRequest,
  metaNewRequest,
  metaPrepareEditRequest,
  metaPrepareNewRequest
} from "../../store/modules/Metas/action";
import { getMessage } from "../../components/messages";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {injectIntl} from "react-intl";

function MetasFormContainer(props) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id){
      dispatch(metaPrepareEditRequest(id))
    } else {
      dispatch(metaPrepareNewRequest())
    }
  }, [])

  const metas = useSelector(store => {
    return store.metas
  });

  const { entityInstance, linhasDeProducao } = metas;

  const id = props.match.params.id;

  return (
    <>
      <CabecalhoForm
        isEdicao={!!id}
        onBack={"/prog/metas"}
        titulo={getMessage(id ? "meta.edicao.title.label" : "meta.cadastro.title.label")}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <Spin spinning={props.requestManager.loading}>
        <MetasForm
          form={form}
          entityInstance={entityInstance}
          linhasDeProducao={linhasDeProducao}
          onFinish={onFinish}
        />
      </Spin>
    </>
  )

  function handleSubmit (e){
    e.preventDefault();

    form.submit();
  }

  function handleReset() {
    form.resetFields();
  }

  function onFinish(values) {
    values.inicioVigencia = formataDataParaString(form.getFieldValue('vigencia')[0]);
    values.fimVigencia = formataDataParaString(form.getFieldValue('vigencia')[1]);
    delete values.vigencia

    console.log(values);

    if(id) {
      values.id = id;
      dispatch(metaEditRequest(values))
    } else {
      dispatch(metaNewRequest(values))
      handleReset()
    }
  }

  function formataDataParaString(dataParaParse) {
    return dataParaParse.format('DD/MM/YYYY HH:mm:ss');
  }
}

const mapStateToProps = store => ({
  metas: store.metas,
  requestManager: store.requestManager,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({metaEditRequest, metaNewRequest, metaPrepareEditRequest, metaPrepareNewRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MetasFormContainer))
