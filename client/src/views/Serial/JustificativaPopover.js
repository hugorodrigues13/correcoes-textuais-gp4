import * as React from 'react';
import {useState} from "react";
import {Button, Col, Input, Popover, Row} from "antd";
import {getMessage} from "../../components/messages";
import {useDispatch} from "react-redux";
import {serialEstornarApontamentoRequest} from "../../store/modules/Serial/action";
import Alert from "react-s-alert";

function JustificativaPopover(props){

    const dispatch = useDispatch()
    const [aberto, setAberto] = useState(false)
    const [justificativa, setJustificativa] = useState()
    const { message, apontamento, serial, onFinish } = props

    function estornar() {
        if (!justificativa){
            Alert.error(getMessage("serial.historico.justificativa.sem.label"))
            return
        }
        dispatch(serialEstornarApontamentoRequest(serial, justificativa, apontamento, props.getFiltros()))
        close()
        onFinish()
    }

    function close(){
        setAberto(false)
        setJustificativa(null)
    }

    function renderContent(){
        return (
            <>
                <Row gutter={24}>
                    <Col span={24} style={{marginBottom: 8}}>
                        {getMessage(message)}
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} style={{marginBottom: 8}}>
                        <Input
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            placeholder={getMessage("serial.historico.justificativa.label")}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button
                            size="small"
                            onClick={close}
                            style={{marginRight: 8}}
                        >
                            {getMessage("comum.nao.label")}
                        </Button>
                        <Button
                            size="small"
                            type="primary"
                            onClick={estornar}
                        >
                            {getMessage("comum.sim.label")}
                        </Button>
                    </Col>
                </Row>
            </>

        )
    }

    return (
        <Popover
            visible={aberto}
            content={renderContent()}
            onVisibleChange={(b) => b ? null : close()}
            trigger="click"
        >
            {React.cloneElement(props.children, {onClick: () => setAberto(true)})}
        </Popover>
    )
}

export default JustificativaPopover
