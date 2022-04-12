import * as React from 'react';
import {Modal} from "antd";
import {getMessage} from "../../components/messages";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {AiOutlineHistory} from "react-icons/all";
import { useSelector } from 'react-redux';

function HistoricoModal(props){

  const { visible, setVisible } = props
  const { historicoImpressaoOF } = useSelector(store => store.ordemFabricacao)

  function close(){
    setVisible(false)
  }

  function configTable(){
    const historico = historicoImpressaoOF || []
    return {
      i18n: "ordemFabricacao.modal.historico.",
      columns: [
        {
          key: 'usuario'
        },
        {
          key: 'justificativa'
        },
        {
          key: 'data'
        }
      ],
      data: [...historico].sort((a, b) => b.id - a.id),
    }
  }

  return (
    <Modal
      title={getMessage("ordemFabricacao.modal.historico.title")}
      visible={visible}
      onCancel={close}
      onOk={close}
      width={700}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <TabelaAnt configTable={configTable()}/>
    </Modal>
  )
}

export default HistoricoModal
