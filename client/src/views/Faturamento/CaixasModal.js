import * as React from 'react';
import {useEffect} from "react";
import {Col, Modal, Row, Spin} from "antd";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {useDispatch} from "react-redux";
import {exportarCaixasFaturamentoRequest} from "../../store/modules/Faturamento/action";

function CaixasModal(props){

  const dispatch = useDispatch()
  const { visible, setVisible, lote, getMessage, loading } = props
  const { caixas, caixasNaoCriadas } = props.caixas || {}

  function fechar(){
    setVisible(false)
  }

  function exportar(){
    dispatch(exportarCaixasFaturamentoRequest(lote.id))
  }

  function renderInfo(){
    return (
      <Row gutter={24}>
        <Col span={24}>
          <strong>{getMessage("faturamento.caixas.modal.caixas.naoCriadas.label")}</strong>
          :&nbsp;
          {caixasNaoCriadas ? caixasNaoCriadas : getMessage("faturamento.caixas.modal.caixas.todasCriadas.label")}
        </Col>
      </Row>
    )
  }

  function renderTabela(){
    function configTable(){
      return {
        i18n: "faturamento.caixas.modal.tabela.",
        size: "small",
        columns: [
          {
            key: "numeroCaixa",
          },
          {
            key: "recurso",
          },
          {
            key: "linhaProducao",
          },
          {
            key: "total",
          },
          {
            key: "apontados",
          },
        ],
        data: caixas || [],
      }
    }
    return (
      <TabelaAnt configTable={configTable()}/>
    )
  }

  return (
    <Modal
      visible={visible}
      onCancel={fechar}
      onOk={exportar}
      okButtonProps={{disabled: !caixas?.length}}
      width={600}
      okText={getMessage("comum.exportar.label")}
      cancelText={getMessage("comum.cancelar.label")}
      title={getMessage("faturamento.caixas.modal.title.label", {lote: lote.codigoLote})}
    >
      <Spin spinning={loading}>
        {renderInfo()}
        <br/>
        {renderTabela()}
      </Spin>
    </Modal>
  )

}

export default CaixasModal
