import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import { retornaValidateStatus } from "../../utils/formatador";
import { InputAnt } from "../../components/form/Input";
import { SelectFilter } from "../../components/form/SelectFilter"
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { Form, Col, Row, Spin, Select } from "antd";
import { editarRequest, salvarRequest } from "../../store/modules/Acesso/action";


export const AcessoForm = (props => {
  const [form] = Form.useForm();
  const { getMessage, id, entityInstance, listOrganizacao, listFornecedor, setEntityInstance, error: errors } = props;
  const dispatch = useDispatch();
  const requestManager = useSelector(state => state.requestManager);
  const loading = requestManager.loading;
  const [listFornecedorFiltrado, setListForcenedorFiltrado] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      nome: entityInstance.nome,
      organizacoes: entityInstance.organizacoes
    });
    if (entityInstance.fornecedores && entityInstance.organizacoes) {
      filtrarFornecedores(entityInstance.organizacoes);
      let arrayNewFornecedor = [];
      entityInstance.fornecedores.forEach(id => {
        let newFornecedor = listFornecedor.find(f => f.key === id);
        newFornecedor ? arrayNewFornecedor.push(newFornecedor) : null
      });
      setFornecedores(arrayNewFornecedor)
    }
  }, [entityInstance]);

  function fornecedorColumns() {
    return {
      i18n: "acesso.fornecedor.tabela.",
      columns: [
        {
          key: 'value',
        },
      ],
      data: fornecedores,
      acoes: {
        excluir: removeTableData
      }
    }
  }
  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("acesso.editar.label") : getMessage("acesso.cadastro.label")}
        onBack={"/seg/acesso"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              {/* Nome */}
              <InputAnt
                label={getMessage("acesso.nome.label")}
                nomeAtributo="nome"
                message={getMessage("comum.obrigatorio.campo.message")}
                isRequired={true}
                validateStatus={retornaValidateStatus(errors, "nome")}
              />
            </Col>
            <Col span={12}>
              {/* Organizações */}
              <SelectFilter
                  list={listOrganizacao}
                  label={getMessage("acesso.organizacao.label")}
                  isRequired
                  modo={"multiple"}
                  nomeAtributo={"organizacoes"}
                  style={{width: '100%'}}
                  size={'large'}
                  onChange={ e => filtrarFornecedores(e)} />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <SelectFilter
                label={getMessage("acesso.fornecedores.label")}
                nomeAtributo={"fornecedores"}
                onChange={e => setTableData(e)}
                list={listFornecedorFiltrado}
              />
            </Col>
            <Col span={24}>
              <TabelaAnt
                configTable={fornecedorColumns()}
              />
            </Col>
          </Row>
        </Form>
      </Spin>
    </Col>
  );

  function handleSubmit(e) {
    e.preventDefault();
    form.submit()
  }

  function onFinish(values) {
    let newValues = valoresFormatados(values);
    setEntityInstance({ nome: values.nome, organizacoes: values.organizacoes });
    if (id) {
      values.id = id;
      dispatch(editarRequest(newValues));
    } else {
      dispatch(salvarRequest(newValues));
      setFornecedores([])
    }
  }

  function filtrarFornecedores(organizacoes) {
    const orgID = listOrganizacao.filter(org => organizacoes.includes(org.key)).map(org => org.organizationID);
    const fornecedores = listFornecedor.filter(forn => orgID.includes(forn.organizationID.toString()));

    setListForcenedorFiltrado(fornecedores)
  }

  function setTableData(e) {
    const newFornecedor = listFornecedorFiltrado.find(forn => forn.key === e);
    if ((!fornecedores.find(forn => forn.key === newFornecedor.key) || fornecedores.length === 0) && newFornecedor) {
      setFornecedores([...fornecedores, newFornecedor]);
    }
    form.setFieldsValue({ fornecedores: "" })
  }

  function removeTableData(e) {
    const newListaFornecedores = fornecedores.filter(forn => forn.key !== e.key);

    setFornecedores(newListaFornecedores)
  }

  function valoresFormatados(values) {
    values.fornecedores = fornecedores.map(forn => forn.key);

    return values
  }

  function handleReset() {
    form.resetFields();
  }
});
