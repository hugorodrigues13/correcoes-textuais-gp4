import * as React from 'react';
import {Button, Col, Modal, Row} from "antd";
import {getMessage} from "../../components/messages";
import {useEffect, useState} from "react";
import {SelectAnt} from "../../components/form/SelectAnt";
import {useDispatch, useSelector} from "react-redux";
import {serialGerarEtiquetaRequest, serialImprimirRequest} from "../../store/modules/Serial/action";
import {listImpressoraRequest} from "../../store/modules/Impressora/action";
import {imprimirEtiquetaRequest} from "../../store/modules/OrdemDeFabricacao/action";

function ImpressaoModal(props) {

  const dispatch = useDispatch()
  const impressoraManager = useSelector(state => state.impressora)
  const listImpressoras = impressoraManager?.data?.entities?.map(i => ({key: i.id, value: i.nome}))
  const { seriais, visible, setVisible } = props
  const [botaoSelecionado, setBotaoSelecionado] = useState('apontamento')
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('pdf')
  const [impressoraSelecionada, setImpressoraSelecionada] = useState()

  function onFinish(){
    const data = {impressoraId: impressoraSelecionada, opcaoSelecionada, seriais, ordemFabricacao: props.ordemFabricacao}
    if (botaoSelecionado === 'caixa'){
      dispatch(serialGerarEtiquetaRequest(data))
    } else if (botaoSelecionado === 'apontamento'){
      dispatch(serialImprimirRequest(data));
    }
    setVisible(false)
  }

  useEffect(() => {
    dispatch(listImpressoraRequest({max: 10000}));
  }, [])

  useEffect(() => {
    setBotaoSelecionado('apontamento')
    setOpcaoSelecionada('pdf')
  }, [visible])

  return (
    <Modal
      title={getMessage("serial.impressao.modal.title")}
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={onFinish}
      width={700}
      okButtonProps={{disabled: botaoSelecionado == null || (opcaoSelecionada === 'impressora' && !impressoraSelecionada)}}
      okText={getMessage(opcaoSelecionada === 'pdf' ? "serial.impressao.modal.gerar.label" : "serial.impressao.modal.imprimir.label")}
    >
      {renderImprimirOuReimprimir()}
      {renderPdfOuImpressora()}
      {(opcaoSelecionada === 'impressora') && renderImpressoraSelect()}
    </Modal>
  )

  function renderImprimirOuReimprimir(){
    return (
      <>
        <p style={{margin: 0}}>
          {getMessage("serial.impressao.modal.tipo.etiqueta.label")}
        </p>
        <Row gutter={24}>
          <Col span={12} style={{paddingRight: 4}}>
            <Button
              type={botaoSelecionado === 'apontamento' ? 'primary' : 'default'}
              onClick={() => setBotaoSelecionado('apontamento')}
              className="impressao-modal-botao"
            >
              {getMessage("serial.impressao.modal.opcao.apontamento.label")}
            </Button>
          </Col>
          <Col span={12} style={{paddingLeft: 4}}>
            <Button
              type={botaoSelecionado === 'caixa' ? 'primary' : 'default'}
              onClick={() => setBotaoSelecionado('caixa')}
              className="impressao-modal-botao"
            >
              {getMessage("serial.impressao.modal.opcao.caixa.label")}
            </Button>
          </Col>
        </Row>
      </>
    )
  }

  function renderPdfOuImpressora(){
    return (
      <>
        <p style={{margin: '10px 0 0 0'}}>
          {getMessage("serial.impressao.modal.tipo.impressao.label")}
        </p>
        <Row gutter={24}>
          <Col span={12} style={{paddingRight: 4}}>
            <Button
              type={opcaoSelecionada === 'pdf' ? 'primary' : 'default'}
              onClick={() => setOpcaoSelecionada('pdf')}
              className="impressao-modal-botao"
            >
              {getMessage("serial.impressao.modal.opcao.gerarPdf.label")}
            </Button>
          </Col>
          <Col span={12} style={{paddingLeft: 4}}>
            <Button
              type={opcaoSelecionada === 'impressora' ? 'primary' : 'default'}
              onClick={() => setOpcaoSelecionada('impressora')}
              className="impressao-modal-botao"
            >
              {getMessage("serial.impressao.modal.opcao.selecionarImpressora.label")}
            </Button>
          </Col>
        </Row>
      </>
    )
  }

  function renderImpressoraSelect(){
    return (
      <>
        <p style={{margin: '10px 0 0 0'}}>
          {getMessage("serial.impressao.modal.tipo.impressora.label")}
        </p>
        <Row gutter={24}>
          <Col span={24}>
            <SelectAnt
              nomeAtributo={"listaDeImpressoras"}
              placeholder={getMessage("comum.selecione.label")}
              list={listImpressoras}
              onChange={setImpressoraSelecionada}
              value={impressoraSelecionada}
              style={{width: '100%'}}
            />
          </Col>
        </Row>
      </>
    )
  }

}

export default ImpressaoModal;
