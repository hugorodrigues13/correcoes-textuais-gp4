import * as React from 'react';
import {Button, Col, Form, Input, Modal, Row, Spin} from "antd";
import {getMessage} from "../../components/messages";
import TabelaAnt from "../../components/tabelaAnt/Tabela";

function FolhaImpressaoModal(props){

  const { visible, setVisible, loading, imprimirFolha, data } = props;

  function fechar(){
    setVisible(false);
  }

  function configTable(){
    return {
      i18n: "ordemDeFabricacao.folhaImpressao.",
      columns: [
        {
          key: 'codigo',
        },
        {
          key: "descricao",
          width: "40%",
        },
        {
          key: "um",
        },
        {
          key: "quantidade",
        },
        {
          key: "total",
        },
      ],
      data: data.linhas,
      scroll: {
        y: 300
      },
    }
    }

    let footer = [
      <Button key="back" onClick={fechar}>
        {getMessage("comum.fechar.label")}
      </Button>
    ]

  if(imprimirFolha) {
    footer = [...footer, <Button
      key="imprimir"
      type="primary"
      loading={loading}
      onClick={() => imprimirFolha(data)}
    >
      {getMessage("serial.impressao.modal.opcao.gerarPdf.label")}
    </Button>]
  }

  return (
    <Modal
      title={getMessage("ordemFabricacao.modal.folhaImpressao.title")}
      visible={visible}
      onCancel={fechar}
      onOk={() => imprimirFolha ? imprimirFolha(data) : null}
      footer={footer}
      width={1000}
    >
      <Spin spinning={loading}>
        <div className='cabecalho-folha-impressao'>
          <h4 className='header'>{getMessage("ordemFabricacao.modal.titulo.title")} - {data.lote} | {getMessage("ordemFabricacao.modal.folhaImpressao.qtde.label")}: {data.quantidadeLote}</h4>
          <div className="left">
            <p><b>{getMessage("ordemFabricacao.modal.folhaImpressao.listaRoteiro.label")}:</b> {!loading && (data.listaAlternativa + '/' + data.roteiroAlternativo)}</p>
            <p><b>{getMessage("ordemFabricacao.modal.folhaImpressao.dataImpressao.label")}:</b> {data.dataAtual}</p>
          </div>
          <div className="right">
            <p><b>{getMessage("ordemFabricacao.modal.folhaImpressao.ordemDeProducao.label")}:</b> {data.ordemDeProducao}</p>
            <p><b>{getMessage("ordemFabricacao.modal.folhaImpressao.dataPrevista.label")}: </b> {data.dataPrometida}</p>
          </div>
          <div className="rodape">
            <p><b>{data.codigo} - </b>{data.descricao}</p>
          </div>
        </div>
        <TabelaAnt configTable={configTable()}/>
      </Spin>
    </Modal>
  )
}

export default FolhaImpressaoModal
