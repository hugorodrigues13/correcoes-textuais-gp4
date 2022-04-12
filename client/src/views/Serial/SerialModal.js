import * as React from 'react';
import {Button, Col, Modal, Row} from "antd";
import {BsFillReplyFill} from "react-icons/all";
import {getMessage} from "../../components/messages";
import "./style.css"
import JustificativaPopover from "./JustificativaPopover";
import {useSelector} from "react-redux";

function SerialModal(props) {

    const { visible, setVisible, serial, loading, id } = props
    const { historico, sucateado, dataSucateamento, codigoGerado, podeDesfazerTodos, apontamentoOF } = useSelector(store => store.serial)

    function renderHistorico(){
        return (
          <>
            <Row gutter={24}>
              {
                apontamentoOF?.id ?
                <Col span={6} className={"modalBody-apontamento"}>
                  <Col span={6} className={"modalBody-apontamento-ap-op"}>
                    {getMessage("serial.estorno.apontamentoOF")}
                  </Col>
                  <Col span={6} className={"modalBody-apontamento-data"}>
                    {apontamentoOF.data}
                  </Col>
                  <Col span={6} className={"modalBody-apontamento-recurso"}>
                    {apontamentoOF.recurso}
                  </Col>
                </Col> : null
              }
              {historico.map((item, index) =>
                <>
                  <Col span={6} className={"modalBody-apontamento"}>
                    <Col span={6} className={"modalBody-apontamento-data"}>
                      {item.data}
                    </Col>
                    <Col span={6} className={"modalBody-apontamento-recurso"}>
                      {item.recurso}
                    </Col>
                    <Col span={6} className={"modalBody-apontamento-defeito"}>
                      {item.defeito}
                    </Col>
                  </Col>
                  <Col span={1} style={{marginLeft: 8}}>
                    {++index < historico?.length && <BsFillReplyFill/>}
                    {index === historico?.length && <JustificativaPopover
                      message={"serial.historico.desfazerTodos.aviso.label"}
                      serial={id}
                      onFinish={finish}
                      apontamento={historico[historico?.length - 1].id}
                      getFiltros={props.getFiltros}
                    >
                      <BsFillReplyFill
                        style={{transform: 'scaleX(-1)', fontSize: 20, cursor: 'pointer'}}
                        color={"red"}/>
                    </JustificativaPopover>
                    }
                  </Col>
                </>
              )}
            </Row>
      {
        sucateado &&
        <Row style={{marginLeft: 8}}>
          <Col span={24} className={"modalBody-apontamento-sucateamento"}>
            {getMessage("serial.sucateado.label")}
          </Col>
          <Col span={24} className={"modalBody-apontamento"}>
            <Col span={12} className={"modalBody-apontamento-sucateamento-data"}>
              {getMessage("serial.sucateado.data.label").replace("{data}", dataSucateamento)}
            </Col>
            <Col span={12} className={"modalBody-apontamento-sucateamento-codigo-gerado"}>
              {getMessage("serial.sucateado.codigoGerado.label").replace("{data}", (codigoGerado || '--'))}
            </Col>
          </Col>
        </Row>
      }
      </>
        )
    }

    function renderFooter(){
        return [
            <>
                <JustificativaPopover
                    message={"serial.historico.desfazerTodos.aviso.label"}
                    serial={id}
                    onFinish={finish}
                    getFiltros={props.getFiltros}
                >
                    <Button
                        type={"danger"}
                        loading={loading}
                        disabled={!podeDesfazerTodos && !apontamentoOF?.id}
                        style={{marginRight: podeDesfazerTodos ? 0 : 8}}
                    >
                        {getMessage("serial.historico.desfazerTodos.label")}
                    </Button>
                </JustificativaPopover>
                <Button
                    type={"primary"}
                    loading={loading}
                    onClick={close}
                >
                    {getMessage("comum.ok.label")}
                </Button>
            </>
        ]
    }

    function finish(){
        close()
    }

    function close(){
        setVisible(false)
    }

    return (
        <Modal
            visible={visible}
            title={getMessage("serial.title.modal.label") + ` ${serial}`}
            onOk={close}
            onCancel={close}
            destroyOnClose={true}
            footer={renderFooter()}
        >
            {renderHistorico()}
        </Modal>
    )

}

export default SerialModal
