import React from "react";
import {Modal} from "antd";
import {getMessage} from "../../../components/messages";
import {FormattedMessage} from "react-intl";

export default function ModalExcluirOrdem({visible, onOk, onCancel, ordem}) {

  return <Modal
    title={<FormattedMessage
      id="sequenciamento.ordemDeFabricacao.modalExcluir.title"
      values={{serial: ordem.codigo}}/>}
    visible={visible}
    onOk={onOk}
    onCancel={onCancel}
    okText={getMessage("sequenciamento.ordemDeFabricacao.modalExcluir.buttonYes")}
    cancelText={getMessage("sequenciamento.ordemDeFabricacao.modalExcluir.buttonCancel")}
    destroyOnClose={true}
  />
}
