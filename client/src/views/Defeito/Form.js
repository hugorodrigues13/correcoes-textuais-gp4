import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Form, Row, Col, Spin, Transfer, Tag} from "antd";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import {retornaValidateStatus} from "../../utils/formatador";
import {InputAnt} from "../../components/form/Input";
import {editarRequest, salvarRequest} from "../../store/modules/Defeito/Action"


export const DefeitoForm = ( props => {
  const [form] = Form.useForm();
  const requestManager = useSelector(state => state.requestManager);
  const dispatch = useDispatch();
  const loading = requestManager.loading;
  const {id, getMessage, listGrupoRecurso, error, entityInstance, setEntityInstance} = props;
  const [gruposRecurso, setGruposRecurso] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      nome: entityInstance.nome,
      grupos: []
    });
    if(entityInstance.grupos) {
      setGruposRecurso(entityInstance.grupos)
    } else {
      setGruposRecurso([])
    }
  }, [entityInstance]);

  return(
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("defeito.editar.label") : getMessage("defeito.cadastro.label")}
        onBack={"/cad/defeito"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={24}>
              <InputAnt
                label={getMessage("defeito.nome.label")}
                nomeAtributo={"nome"}
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(error, "nome")}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={getMessage("defeito.grupoRecurso.label")}
                name={"grupos"}
                validateStatus={retornaValidateStatus(error, "grupos")}
              >
              <Transfer
                dataSource={listGrupoRecurso}
                listStyle={{width: "100%"}}
                locale={{
                  itemUnit: "",
                  itemsUnit: "",
                  notFoundContent: "",
                  selectAll: getMessage("defeito.grupoRecurso.transferOption.selectAll.label"),
                  selectCurrent: getMessage("defeito.grupoRecurso.transferOption.selectCurrent.label"),
                  selectInvert: getMessage("defeito.grupoRecurso.transferOption.selectInvert.label"),
                }}
                titles={["", getMessage("comum.selecionados.label")]}
                render={item => item.nome}
                onChange={ (item) => setGruposRecurso(item) }
                targetKeys={gruposRecurso}
              />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Col>
  )

  function handleSubmit( e ) {
    e.preventDefault();
    form.submit()
  }

  function onFinish( values ) {
    if(id) {
      values.id = id;
      dispatch(editarRequest(values))
    } else {
      dispatch(salvarRequest(values))
    }
  }

  function handleReset() {
    form.resetFields();
  }
});
