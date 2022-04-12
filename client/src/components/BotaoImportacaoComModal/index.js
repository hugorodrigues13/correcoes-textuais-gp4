import {AiFillFileAdd} from "react-icons/ai";
import {Button, Col, Modal, Row, Spin, Upload} from "antd";
import React, {useState} from "react";
import { getMessage } from "../messages";
import Alert from "react-s-alert";
import {useDispatch, useSelector} from "react-redux";
import "./styles.css"

const BotaoImportacaoComModal = ({ titulo, onUpload, mensagem, arquivoModelo, style, componenteBotao }) => {
  const requestManager = useSelector(store => store.requestManager);
  const [modalOpen, setModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  function checkFile(file) {
    if (!file) {
      Alert.error(getMessage("comum.importarModal.arquivo.nenhum.label"));
      return false
    }
    if (!(file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      Alert.error(getMessage("comum.importarModal.arquivo.desconhecido.label"));
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
    const formData = new FormData()
    formData.append('file', file.originFileObj)
    setFile(null)
    setModalOpen(false)
   onUpload(formData)
  }

  function renderModal() {
    return (
      <Modal
        width={500}
        confirmLoading={loading || requestManager.loading}
        onOk={handleUpload}
        okButtonProps={{disabled: !file}}
        okText={getMessage("comum.finalizar.label")}
        title={titulo || getMessage("comum.importarModal.titulo.label")}
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}>
        <Row gutter={24}>
          <Col span={24}>
            <p>{mensagem}</p>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Button
                className={"btn-baixar-modelo"}
              href={arquivoModelo}
            >
              {getMessage("comum.importarModal.botao.baixar.label")}
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
                {getMessage("comum.importarModal.botao.importar.label")}
              </Button>
            </Upload>
          </Col>
        </Row>
      </Modal>
    )
  }

  function renderButton() {
    if(componenteBotao) {
      return componenteBotao(() => setModalOpen(true))
    } else {
      return (
        <Button
          size={"large"}
          style={{...style, float: 'right'}}
          onClick={() => setModalOpen(true)}
        >
          <AiFillFileAdd size={"1.5em"} />
        </Button>
      )
    }
  }

  return (
    <>
      {renderButton()}
      {renderModal()}
    </>
  )

}

export default BotaoImportacaoComModal
