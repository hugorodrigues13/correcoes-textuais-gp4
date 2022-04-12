import {AiFillFileAdd} from "react-icons/ai";
import {Button, Col, Modal, Row, Spin, Upload} from "antd";
import React, {useEffect, useState} from "react";
import { getMessage } from "../../components/messages";
import Alert from "react-s-alert";
import {useDispatch, useSelector} from "react-redux";
import {getUsuariosFornecedoresRequest, importarOrdensRequest} from "../../store/modules/GeracaoOrdemDeProducao/action";
import {SelectAnt} from "../../components/form/SelectAnt";
import "./styles.css"

function ImportarOrdensButton() {

  const requestManager = useSelector(store => store.requestManager);
  const geracaoDeOp = useSelector(store => store.geracaoOrdemDeProducao);
  const { fornecedores } = geracaoDeOp
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fornecedorEscolhido, setFornecedorEscolhido] = useState(null)
  const dispatch = useDispatch()

  function checkFile(file) {
    if (!file) {
      Alert.error(getMessage("geracaoOrdemDeProducao.importarModal.arquivo.nenhum.label"));
      return false
    }
    if (!(file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      Alert.error(getMessage("geracaoOrdemDeProducao.importarModal.arquivo.desconhecido.label"));
      return false
    }
    return true
  }

  function uploadDone(file) {
    setFile(file)
  }

  function onChangeStatus(info) {
    if (info.file.status === 'done'){
      uploadDone(info.file)
      setLoading(false)
    } else if (info.file.status === 'uploading'){
      setLoading(true)
    } else {
      setLoading(false)
    }
  }

  function handleUpload(){
    console.log(file)
    const formData = new FormData()
    formData.append('file', file.originFileObj)
    formData.append('fornecedor', fornecedorEscolhido)
    setFile(null)
    setModalOpen(false)
    dispatch(importarOrdensRequest(formData))
  }

  function fornecedoresToSelect(){
    return fornecedores.map(f => ({key: f.id, value: f.nome}))
  }

  function renderModal() {
    return (
      <Modal
        width={500}
        confirmLoading={loading || requestManager.loading}
        onOk={handleUpload}
        okButtonProps={{disabled: !file || !fornecedorEscolhido}}
        okText={getMessage("comum.finalizar.label")}
        title={getMessage("geracaoOrdemDeProducao.importarModal.titulo.label")}
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}>
        <Row gutter={24}>
          <Col span={24}>
            <p>{getMessage("geracaoOrdemDeProducao.importarModal.content.label")}</p>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Button
                className={"btn-baixar-modelo"}
              href={require("../../images/modelo ordem de produção.xls")}
            >
              {getMessage("geracaoOrdemDeProducao.importarModal.botao.baixar.label")}
            </Button>
          </Col>
          <Col span={12}>
            <Upload
              name="file"
              className="btn-upload-op"
              prefixCls="btn-upload-op"
              multiple={false}
              beforeUpload={checkFile}
              customRequest={({file, onSuccess}) => setTimeout(() => onSuccess("ok"), 0)}
              onChange={onChangeStatus}
              fileList={false}
              showUploadList={false}
            >
              <Button className="btn-upload-op" type="primary">
                {getMessage("geracaoOrdemDeProducao.importarModal.botao.importar.label")}
              </Button>
            </Upload>
          </Col>
        </Row>
        <Row gutter={24} justify="center">
          <Col span={24}>
            <SelectAnt
              nomeAtributo="fornecedor"
              isRequired
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={e => setFornecedorEscolhido(e)}
              list={fornecedoresToSelect()}
              placeholder={getMessage("geracaoOrdemDeProducao.importarModal.fornecedor.label")}
              semFormItem={true}
              dropdownMatchSelectWidth={false}
              style={{width: '100%', marginTop: 10}}
            />
          </Col>
        </Row>
      </Modal>
    )
  }

  function renderButton() {
    return (
      <Button
        style={{float: 'right'}}
        onClick={() => setModalOpen(true)}
      >
        <AiFillFileAdd size={"1.5em"} />
      </Button>
    )
  }

  useEffect(() => {
    if (modalOpen){
      dispatch(getUsuariosFornecedoresRequest())
    }
  }, [modalOpen])

  return (
    <>
      {renderButton()}
      {renderModal()}
    </>
  )

}

export default ImportarOrdensButton
