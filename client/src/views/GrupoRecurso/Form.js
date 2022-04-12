import React, { useEffect, useState } from 'react';
import {Form, Col, Row, Spin, Transfer, Collapse, Button} from "antd";
import { useDispatch, useSelector } from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import TreeView from "react-simple-jstree";
import { InputAnt } from "../../components/form/Input";
import { grupoRecursoSalvarRequest, grupoRecursoEditarRequest } from "../../store/modules/GrupoRecurso/action";
import {InputNumberAnt} from "../../components/form/InputNumber";
import {AiOutlinePlus} from "react-icons/ai";
import {SelectAnt} from "../../components/form/SelectAnt";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { SwitchAnt } from "../../components/form/Switch";

export const GrupoRecursosForm = (props => {

  const [form] = Form.useForm();
  const [regraForm] = Form.useForm();
  const dispatch = useDispatch();

  const { listRecursos, getMessage, id, entityInstance, listDefeitos, listTiposRegras, listMotivosParadas, error: errors } = props;
  const requestManager = useSelector(state => state.requestManager);

  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState();
  const [defeitoKeys, setDefeitoKeys] = useState([]);
  const [motivosKey, setMotivosKeys] = useState([]);
  const [regras, setRegras] = useState([])
  const [editando, setEditando] = useState(null)

  const loading = requestManager.loading;
  const recursos = entityInstance.recursos || null;
  const defeitos = entityInstance.defeitos || null;
  const motivosParadas = entityInstance.motivosParadas || null;
  const [permitirApontamentoOF, setPermitirApontamentoOF] = useState(false)

  useEffect(() => {
    setRegras(entityInstance.regras || [])
    form.setFieldsValue({
      operacao: entityInstance.operacao,
      nome: entityInstance.nome,
      tempoPadrao: entityInstance.tempoPadrao,
      tempoMaximoSemApontamento: entityInstance.tempoMaximoSemApontamento,
      recursos: entityInstance.recursos || [],
      defeitos: entityInstance.defeitos || [],
      motivosDeParada: entityInstance.motivosParadas || [],
      regras: entityInstance.regras || [],
      camposRastreaveis: entityInstance.camposRastreaveis || [],
      permiteApontamentoOF: entityInstance.permiteApontamentoOF
    });
  }, [entityInstance]);

  useEffect(() => {
    setTargetKeys(getTargetKeysOrdenada(listRecursos, recursos || []));
  }, [recursos]);

  useEffect(() => {
    setDefeitoKeys(getTargetKeysOrdenada(listDefeitos, defeitos || []));
  }, [defeitos]);

  useEffect(() => {
    setMotivosKeys(getTargetKeysOrdenada(listMotivosParadas, motivosParadas || []));
  }, [motivosParadas]);

  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("gruporecurso.editar.label") : getMessage("gruporecurso.cadastro.label")}
        onBack={"/cad/grupoRecurso"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          {renderCampos()}
          {renderRecursos()}
          <br />
          {renderDefeitos()}
          <br />
          {renderMotivoParadas()}
          <br/>
          {renderRegras()}
        </Form>
      </Spin>
    </Col>
  );

  function renderCampos(){
    return (
      <>
        <Row gutter={24}>
          <Col span={12}>
            {/* Role */}
            <InputAnt
              label={getMessage("gruporecurso.nome.label")}
              nomeAtributo="nome"
              message={getMessage("comum.obrigatorio.campo.message")}
              isRequired={true}
              //validateStatus={retornaValidateStatus(errors, "nome")}
            />
          </Col>
          <Col span={12}>
            {/* Descricao */}
            <InputAnt
              label={getMessage("gruporecurso.operacao.label")}
              nomeAtributo="operacao"
              message={getMessage("comum.obrigatorio.campo.message")}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            {/* Tempo padrao */}
            <InputNumberAnt
              label={getMessage("gruporecurso.tempoPadrao.label")}
              nomeAtributo="tempoPadrao"
              min={1}
              isRequired
              message={getMessage("comum.obrigatorio.campo.message")}
            />
          </Col>
          <Col span={12}>
            {/* Tempo maximo */}
            <InputNumberAnt
              label={getMessage("gruporecurso.tempoMaximoSemApontamento.label")}
              nomeAtributo="tempoMaximoSemApontamento"
              min={1}
              isRequired
              message={getMessage("comum.obrigatorio.campo.message")}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={20}>
            <SelectAnt
              nomeAtributo={"camposRastreaveis"}
              modo={"tags"}
              ordenar={false}
              optionLabelProp={"label"}
              label={getMessage("gruporecurso.rastreabilidade.label")}
              list={[]}
            />
          </Col>
          <Col span={4}>
            <SwitchAnt
              label={getMessage("grupoRecurso.permiteApontamentoOF.label")}
              nomeAtributo="permiteApontamentoOF"
              checkedChildren={getMessage("comum.sim.label")}
              unCheckedChildren={getMessage("comum.nao.label")}
              value={permitirApontamentoOF}
              onChange={setPermitirApontamentoOF}
            />
          </Col>
        </Row>
      </>
    )
  }

  function renderRecursos(){
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Collapse>
            <Collapse.Panel header={
              <>
                <span style={{color: "#ff4d4f", marginRight: 4}}>*</span>
                {getMessage("gruporecurso.recurso.label")}
              </>
            }>
              <Form.Item name={"recursos"} rules={[{
                required: true,
                message: getMessage("gruporecurso.recurso.requerid.label")
              }
              ]}>
                <Transfer
                  targetKeys={targetKeys}
                  selectedKeys={selectedKeys}
                  dataSource={ordenarItems(listRecursos)}
                  listStyle={{ width: "100%" }}
                  locale={{
                    itemUnit: "",
                    itemsUnit: "",
                    notFoundContent: "",
                    selectAll: getMessage("defeito.grupoRecurso.transferOption.selectAll.label"),
                    selectCurrent: getMessage("defeito.grupoRecurso.transferOption.selectCurrent.label"),
                    selectInvert: getMessage("defeito.grupoRecurso.transferOption.selectInvert.label"),
                  }}
                  titles={["", getMessage("comum.selecionados.label")]}
                  render={item => item.value}
                  onChange={(nextTargetKeys, direction, moveKeys) => {
                    handleChange(setTargetKeys, listRecursos, nextTargetKeys, direction, moveKeys)
                  }}
                  onSelectChange={(sourceSelectedKeys, targetSelectedKeys) =>
                    handleSelectChange(setSelectedKeys, sourceSelectedKeys, targetSelectedKeys)}
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }

  function renderDefeitos(){
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Collapse>
            <Collapse.Panel header={getMessage("grupoRecurso.defeito.label")}>
              <Form.Item name={"defeitos"}>
                <Transfer
                  targetKeys={defeitoKeys}
                  onChange={e => setDefeitoKeys(e)}
                  dataSource={listDefeitos}
                  listStyle={{ width: "100%" }}
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
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }

  function renderMotivoParadas(){
    return (
      <Row gutter={24}>
        <Col span={24}>
          <Collapse>
            <Collapse.Panel header={getMessage("grupoRecurso.motivosParada.label")}>
              <Form.Item name={"motivosDeParada"}>
                <Transfer
                  targetKeys={motivosKey}
                  onChange={e => setMotivosKeys(e)}
                  dataSource={listMotivosParadas}
                  listStyle={{ width: "100%" }}
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
                />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }

  function renderRegras(){
    function adicionarNaTabela(values){
      const { tipo, descricao } = values
      const novaRegra = { tipo, descricao }
      if (editando) {
        novaRegra.id = editando.id
        const novosRegras = [...regras]
        const index = novosRegras.findIndex(t => t.descricao === editando.descricao)
        novosRegras.splice(index, 1, novaRegra)
        setRegras(novosRegras)
        setEditando(null)
      } else {
        setRegras([...regras, novaRegra])
      }
      regraForm.resetFields()
    }
    function deletar(objeto) {
      setRegras(regras.filter(t => t.descricao !== objeto.descricao))
    }
    function editar(objeto) {
      setEditando(objeto)
      regraForm.setFieldsValue({
        tipo: objeto.tipo,
        descricao: objeto.descricao,
      })
    }
    function configTable(){
      return {
        i18n: "grupoRecurso.regras.",
        columns: [
          {
            key: 'tipo',
            render: renderTipoRegra
          },
          {
            key: 'descricao',
          }
        ],
        acoes: {
          editModal: true,
          editar: editar,
          excluir: deletar
        },
        data: regras,
      }
    }

    return (
      <Row gutter={24}>
        <Col span={24}>
          <Collapse>
            <Collapse.Panel header={getMessage("grupoRecurso.regras.label")}>
              <Form.Item name={"regras"}>
                <Form layout={"vertical"} form={regraForm} onFinish={adicionarNaTabela}>
                  <Row gutter={24}>
                    <Col span={4}>
                      <SelectAnt
                        nomeAtributo="tipo"
                        ordenar={false}
                        isRequired
                        label={getMessage("grupoRecurso.regras.tipo.label")}
                        list={formataListaParaSelect(listTiposRegras)}
                      />
                    </Col>
                    <Col span={8}>
                      <InputAnt
                        nomeAtributo="descricao"
                        isRequired
                        label={getMessage("grupoRecurso.regras.descricao.label")}
                        validator={(_, value) => {
                          if (!value || editando?.descricao === value || !regras?.some(t => t.descricao === value)) {
                          return Promise.resolve();
                        }
                          return Promise.reject(new Error(getMessage("grupoRecurso.regras.jaAdicionado.label")));
                        }}
                      />
                    </Col>
                    <Col span={4}>
                      <Button
                        type="primary"
                        key="submit"
                        size="large"
                        style={{marginTop: 29}}
                        onClick={() => regraForm.submit()}
                      >
                        <AiOutlinePlus size={"1.5em"} />
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <Row gutter={24}>
                  <Col span={24}>
                    <TabelaAnt configTable={configTable()}/>
                  </Col>
                </Row>

              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.submit();
  }

  function handleReset() {
    form.resetFields();
    regraForm.resetFields()
    setEditando(null)
  }

  function onFinish(values) {
    values.regras = regras
    if (id) {
      values.id = id;
      dispatch(grupoRecursoEditarRequest(values));
    } else {
      dispatch(grupoRecursoSalvarRequest(values));
      setTargetKeys([]);
      setDefeitoKeys([]);
      setMotivosKeys([]);
    }
  }

  function getTargetKeysOrdenada(list, nextTargetKeys) {
    const filtered = list.filter(
      item => nextTargetKeys.indexOf(item.key) > -1
    );
    return ordenarItems(filtered || []).map(item => item.key);
  }

  function ordenarItems(array) {
    return array.sort((a, b) =>
      a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1
    );
  }

  function handleSelectChange(setFunction, sourceSelectedKeys, targetSelectedKeys) {
    setFunction([...sourceSelectedKeys, ...targetSelectedKeys]);
  }

  function handleChange(setFunction, list, nextTargetKeys, direction, moveKeys) {
    setFunction(getTargetKeysOrdenada(list, nextTargetKeys));
  }

  function formataListaParaSelect(list){
    return list.map(l => ({key: l, value: renderTipoRegra(l)}))
  }

  function renderTipoRegra(tipo){
    return getMessage(`grupoRecurso.regras.tipo.${tipo}.label`)
  }


})
