import * as React from 'react';
import {getMessage} from "../../components/messages";
import {Button, Input, Modal} from "antd";
import {SelectAnt} from "../../components/form/SelectAnt";
import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { imprimirEtiquetaRequest, listaHistoricoImpressaoRequest } from "../../store/modules/OrdemDeFabricacao/action";
import Alert from "react-s-alert";

function ImpressaoModal(props) {

  const { visible, setVisible, impressoraSelecionada, listaDeImpressoras, setImpressoraSelecionada, entidade } = props
  const { historicoImpressaoOF } = useSelector(store => store.ordemFabricacao);

  const [opcaoSelecionada, setOpcaoSelecionada] = useState()
  const [justificativa, setJustificativa] = useState("")
  const dispatch = useDispatch()
  const opcoesImpressoes = [{key: "Gerar PDF", value: "Gerar PDF"}, {key: "Selecionar uma impressora", value: "Selecionar uma impressora"}]
  const precisaJustificativa = !!historicoImpressaoOF?.length

  useEffect(() => {
    if(visible) {
      dispatch(listaHistoricoImpressaoRequest(entidade?.id))
    }
  }, [visible])

  function close(){
    setVisible(false)
    setOpcaoSelecionada(null)
    setImpressoraSelecionada(null)
    setJustificativa("")
  }

  function impressao() {
    if (precisaJustificativa && !justificativa){
      Alert.error(getMessage("comum.insiraJustificativa.label"))
      return
    }
    dispatch(imprimirEtiquetaRequest({ordemFabricacaoId: entidade.id, impressoraId: impressoraSelecionada, justificativa}, props.getFiltros()));
    close()
  }

  function renderFooter(){
    return [
      <Button
        key={"back"}
        onClick={close}
      >
        {getMessage("comum.cancelar.label")}
      </Button>,
      <Button
        key={"submit"}
        type={"primary"}
        onClick={impressao}
        disabled={!opcaoSelecionada || (precisaJustificativa && !justificativa) || (opcaoSelecionada === "Selecionar uma impressora" && !impressoraSelecionada)}
      >
        {opcaoSelecionada === "Gerar PDF" ? getMessage("ordemFabricacao.modal.gerar.label") : getMessage("ordemFabricacao.modal.imprimir.label")}
      </Button>
    ]
  }

  function renderContent(){
    return (
      <>
        <SelectAnt
          nomeAtributo={"opcoesImpressao"}
          placeholder={getMessage("comum.selecione.label")}
          list={opcoesImpressoes || []}
          onChange={setOpcaoSelecionada}
        />
        {opcaoSelecionada === "Selecionar uma impressora" && <SelectAnt
          nomeAtributo={"listaDeImpressoras"}
          placeholder={getMessage("comum.selecione.label")}
          list={listaDeImpressoras || []}
          onChange={setImpressoraSelecionada}
        />}
        {precisaJustificativa &&
        <Input.TextArea
            onChange={e => setJustificativa(e.target.value)}
            isRequired
            placeholder={getMessage("comum.justificativa.label")}
            value={justificativa}
        />}
      </>
    )
  }

  return (
    <Modal
      title={getMessage("ordemFabricacao.modal.title")}
      visible={visible}
      onOk={impressao}
      onCancel={close}
      destroyOnClose={true}
      footer={renderFooter()}
    >
      {renderContent()}
    </Modal>
  )

}

export default ImpressaoModal
