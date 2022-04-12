import * as React from 'react';
import {Modal} from "antd";

function ModalDesbloquear(props){

  const { visible, setVisible, getMessage, grupo, handleSelectGrupo } = props

  function confirmar(){
    handleSelectGrupo(grupo.id)
    fechar()
  }

  function fechar(){
    setVisible(false)
  }

  return (
    <Modal
      visible={visible}
      title={getMessage("sequenciamento.bloqueado.confirmar.label")}
      onCancel={fechar}
      onOk={confirmar}
    >
      {getMessage("sequenciamento.bloqueado.label", {usuario: grupo.usuario?.nome})}
    </Modal>
  )


}

export default ModalDesbloquear
