import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import CabecalhoForm from "../../components/form/CabecalhoForm";
import { retornaValidateStatus } from "../../utils/formatador";
import { InputAnt } from "../../components/form/Input";
import { SelectFilter } from "../../components/form/SelectFilter"
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import { Form, Col, Row, Spin, Button, Upload, Switch, InputNumber, Input } from "antd";
import { editarRequest, salvarRequest } from "../../store/modules/GrupoLinhaProducao/action";
import {AiOutlinePlus, AiFillFileAdd, AiOutlineCheck} from 'react-icons/ai';
import Alert from "react-s-alert"
import { ExcelRenderer } from 'react-excel-renderer';
import {SwitchAnt} from "../../components/form/Switch";
import {InputNumberAnt} from "../../components/form/InputNumber";
import ImportModal from "./ImportModal";

export const GrupoLinhaProducaoForm = (props => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {getMessage, id, entityInstance, listLinhaProducao, setEntityInstance, error: errors} = props;
  const requestManager = useSelector(state => state.requestManager);
  const loading = requestManager.loading;
  const [codigo, setCodigo] = useState('');
  const [roteiro, setRoteiro] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [informarQuantidade, setInformarQuantidade] = useState(false);
  const [linhasDeProducaoInicial, setLinhasDeProducaoInicial] = useState([]);
  const [importModal, setImportModal] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingKey, setEditingKey] = useState(null)

  useEffect(() => {
    setLinhasDeProducaoInicial((entityInstance.linhasDeProducao || []).map(value => {return {id: value.id}}))

    form.setFieldsValue({
      nome: entityInstance.nome,
      linhas: (entityInstance.linhasDeProducao || []).map(value => (value.id)),
      agrupamento: entityInstance.quantidadePorPallet != null,
      codigo: entityInstance.codigo,
      roteiro: entityInstance.roteiro,
    });

    setInformarQuantidade(entityInstance.quantidadePorPallet != null);

    setProdutos(entityInstance.produtos);
  }, [entityInstance]);

  useEffect(() => {
    setProdutosFiltrados(produtos||[])
  },[produtos])

  useEffect(() => {
    if(codigo === '') {
      setProdutosFiltrados(produtos||[])
    }
  },[codigo])

  const editarProduto = (produto) => {
    form.setFieldsValue({
      agrupamento: produto.quantidadePorPallet != null,
      quantidadePorPallet: produto.quantidadePorPallet,
      codigo: produto.codigo,
      roteiro: produto.roteiro,
    });

    setInformarQuantidade(produto.quantidadePorPallet)
    setCodigo(produto.codigo)
    setRoteiro(produto.roteiro)
    setEditing(true)
    setEditingKey(produto.key)
  }

  const cancelaEdicao = () => {
    setEditing(false)

    form.setFieldsValue({
      agrupamento: false,
      quantidadePorPallet: null,
      codigo: null,
      roteiro: null,
    });

    setInformarQuantidade(false)
    setCodigo(null)
    setRoteiro(null)
    setEditing(false)
    setEditingKey(null)
    setProdutosFiltrados(produtos)
  }

  const salvaProdutosArquivo = (produtosArquivo) => {
    let produtosAtuais = produtos;

    for(const produto of produtosArquivo) {
      if(validaProdutosArquivo(produto, produtos, produto.row)) {
        produtosAtuais = [...produtosAtuais, produto]
      }
    }

    setProdutos(produtosAtuais)
  }

  const salvaProduto = () => {
    const produtosAtuais = produtos;
    const produto = { codigo: codigo, roteiro: roteiro, agrupamento: form.getFieldValue("agrupamento"), quantidadePorPallet: form.getFieldValue("quantidadePorPallet") ? Math.floor(form.getFieldValue("quantidadePorPallet")) : null };

    if(editing) {
      if(validaProdutos(produto, produtosAtuais.filter((p, idx) => idx !== editingKey))) {
        setProdutos(produtosAtuais.map((p, idx) => {
          return idx === editingKey ? produto : p
        }))

        setEditingKey(null)
        setEditing(false)
        afterSaveProduto()
      }
    } else {
      if(validaProdutos(produto, produtosAtuais)) {
        setProdutos([...produtosAtuais, produto])
        afterSaveProduto()
      }
    }
  }

  const afterSaveProduto = () => {
    form.setFieldsValue({codigo: '', roteiro: '', agrupamento: false, quantidadePorPallet: null})
    setInformarQuantidade(false)
    setCodigo('')
    setRoteiro('')
  }

  const validaProdutos = (produto, produtosAtuais) => {
    const produtosComMesmoCodigo = produtosAtuais.filter(p => p.codigo === produto.codigo)

    if(!produto.codigo){
      Alert.error(getMessage("grupoLinhaProducao.inserirCodigo.error"));
      return false
    }

    if(produto.agrupamento && (!produto.quantidadePorPallet || produto.quantidadePorPallet < 1)){
        Alert.error(getMessage("grupoLinhaProducao.pallets.error"));
        return false
    }

    if(!produtosComMesmoCodigo.length) {
      return true
    } else if(produto.roteiro === null || produtosComMesmoCodigo.some(p => p.roteiro === null)) {
      Alert.error(getMessage("grupoLinhaProducao.jaExisteRoteiroVazio.message"));
      return false
    } else if(produtosComMesmoCodigo.some(p => p.roteiro === produto.roteiro)) {
      Alert.error(getMessage("grupoLinhaProducao.jaExisteCodigoERoteiro.message"));
      return false
    }

    return true
  }

  const validaProdutosArquivo = (produto, produtosAtuais, row) => {
    const produtosComMesmoCodigo = produtosAtuais.filter(p => p.codigo === produto.codigo)

    if(!produto.codigo){
      Alert.error(getMessage("grupoLinhaProducao.addTabela.codigoVazio.error", row+2));
      return false
    }

    if(produto.agrupamento && (!produto.quantidadePorPallet || produto.quantidadePorPallet < 1)){
      Alert.error(getMessage("grupoLinhaProducao.addTabela.quantidadePorPallet.error", row+2));
      return false
    }

    if(!produtosComMesmoCodigo.length) {
      return true
    } else if(produto.roteiro === null || produtosComMesmoCodigo.some(p => p.roteiro === null) || produtosComMesmoCodigo.some(p => p.roteiro === produto.roteiro)) {
      Alert.error(getMessage("grupoLinhaProducao.addTabela.produtoERoteiroDuplicados.string.error", produto.codigo));
      return false
    }
    return true
  }

  function grupoLinhaProducaoColumns() {
    return {
      i18n: "grupoLinhaProducao.tabela.",
      columns: [
        {
          key: 'codigo',
        },
        {
          key: 'roteiro',
        },
        {
          key: 'quantidadePorPallet',
        }
      ],
      data: produtosFiltrados.map((v, idx)=> ({...v, key: idx})),
      acoes: {
        excluir: removeTableData,
        editar: editarProduto,
        editModal: true
      }
    }
  }

  return (
    <Col>
      <CabecalhoForm
        isEdicao={id !== null}
        titulo={id ? getMessage("grupoLinhaProducao.editar.label") : getMessage("grupoLinhaProducao.cadastro.label")}
        onBack={"/cad/grupoLinhaProducao"}
        onClickSalvar={handleSubmit}
        onClickLimparCampos={handleReset}
      />
      <br />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={24}>
              {/* Nome */}
              <InputAnt
                label={getMessage("grupoLinhaProducao.nome.label")}
                nomeAtributo="nome"
                isRequired
                message={getMessage("comum.obrigatorio.campo.message")}
                validateStatus={retornaValidateStatus(errors, "nome")}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              {/* Linhas */}
                <SelectFilter
                  list={listLinhaProducao}
                  label={getMessage("grupoLinhaProducao.linhas.label")}
                  isRequired
                  modo={"multiple"}
                  nomeAtributo={"linhas"}
                  style={{width: '100%'}}
                  size={'large'}
                />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              {/* Codigo */}
              <InputAnt
                  label={getMessage("grupoLinhaProducao.codigo.label")}
                  nomeAtributo="codigo"
                  message={getMessage("comum.obrigatorio.campo.message")}
                  validateStatus={retornaValidateStatus(errors, "codigo")}
                  onChange={(e) => { setCodigo(e.target.value) }}
                  onKeyDown={(e) => {if(e.keyCode === 9 || e.keyCode === 13) {
                    handleKeyPress()
                  }}}
                  autoFocus={false}
              />
            </Col>
            <Col span={6}>
              {/* Roteiro */}
              <Form.Item
                  label={getMessage("grupoLinhaProducao.roteiro.label")}
                  validateStatus={retornaValidateStatus(errors, "roteiro")}
                  name={"roteiro"}
                  rules={[
                    {
                      required: false,
                      message: getMessage("comum.obrigatorio.campo.message")
                    },
                  ]}>
                <Input
                    size={"large"}
                    onChange={(e) => { setRoteiro(e.target.value === "" ? null : e.target.value) }}
                    onClick={handleKeyPress}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              {/* Agrupamento */}
              <SwitchAnt
                label={getMessage("grupoLinhaProducao.agrupamento.label")}
                checkedChildren={"Sim"}
                unCheckedChildren={"Não"}
                onChange={() => {
                  setInformarQuantidade(!informarQuantidade);
                  if(informarQuantidade ){
                    form.setFieldsValue({quantidadePorPallet: null})
                  }
                }}
                nomeAtributo={"agrupamento"}
              />
            </Col>
            <Col span={4}>
              {/* Quantidade Por Pallet */}
              <InputNumberAnt
                label={getMessage("grupoLinhaProducao.pallets.label")}
                nomeAtributo="quantidadePorPallet"
                message={getMessage("comum.obrigatorio.campo.message")}
                disabled={!informarQuantidade}
                isRequired={informarQuantidade}
                min={1}
                precision={0}
                validateStatus={retornaValidateStatus(errors, "quantidadePorPallet")}
              />
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                size={"large"}
                onClick={salvaProduto}
                style={{ marginTop: 29 }}
              >
                { editing ? <AiOutlineCheck /> : <AiOutlinePlus size={"1.5em"}/> }
              </Button>
              {editing ? <Button type={"default"} style={{
                marginLeft: 10,
              }} size={"large"} onClick={cancelaEdicao}>
                {getMessage("comum.cancelar.label")}
              </Button> : <Button
                  type="default"
                  size={'large'}
                  style={{
                    marginLeft: 10,
                  }}
                  onClick={() => setImportModal(true)}
              >
                <AiFillFileAdd size={"1.5em"}/>
              </Button>}
            </Col>
          </Row>
          <Col span={24}>

            <TabelaAnt
              configTable={grupoLinhaProducaoColumns()}
            />
          </Col>
        </Form>
        <ImportModal
          visible={importModal}
          setVisible={setImportModal}
          addFile={addFile}
        />
      </Spin>
    </Col >
  );

  function handleKeyPress() {
    if(codigo !== ''){
      setProdutosFiltrados(produtos.filter(value => value.codigo === codigo))
    } else {
      setProdutosFiltrados(produtos.filter(value => value.codigo !== codigo))
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    form.submit()
  }

  function onFinish(values) {
    let produtosValues = valoresFormatados(values);
    let newValues = {
      nome: produtosValues.nome,
      linhas: produtosValues.linhas,
      produtos: produtosValues.produtos,
      linhasDeProducao: produtosValues.linhas.map(item => {return {id: item}}),
      linhasDeProducaoInicial
    }

  if (id) {
    newValues.id = id;
    dispatch(editarRequest(newValues));
  } else {
    dispatch(salvarRequest(newValues));
  }
  setEntityInstance(newValues);
}


  function addFile(fileList) {
    let fileObj = fileList
    if (!fileObj) {
      Alert.error("Nenhum arquivo carregado!");
      return false
    }
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      Alert.error("Formato de arquivo desconhecido. Somente arquivos do Excel são carregados!");
      return false
    }
    setImportModal(false)
    ExcelRenderer(fileObj, (err, resp) => {
      if (!err) {
        let produtosArquivo = []
        let index = 0
        const rows = resp.rows.slice(1).filter(r => r.length)

        for(const row of rows) {
          const produto = {codigo: row[0] ? row[0].toString() : null, roteiro: row[1] ? row[1].toString() : null, quantidadePorPallet: row[2] || null}

          if(produto.quantidadePorPallet && typeof(produto.quantidadePorPallet) !== "number") {
            Alert.error(getMessage("grupoLinhaProducao.addTabela.quantidadePorPallet.string.error", index+2))
          } else if (validaProdutosArquivo(produto, produtosArquivo, index)) {
            produtosArquivo = [...produtosArquivo, {...produto, row: index}]
          }
          index++
        }

        salvaProdutosArquivo(produtosArquivo)
      }
    })
    return false
  }

  function removeTableData(object) {
    let codigo = object.codigo;
    let roteiro = object.roteiro;

    setProdutos(produtos.filter(prod => prod.codigo !== codigo || prod.roteiro !== roteiro));
  }

  function valoresFormatados(values) {
    values.produtos = produtos;
    return values
  }

  function handleReset() {
    form.resetFields();
  }
});
