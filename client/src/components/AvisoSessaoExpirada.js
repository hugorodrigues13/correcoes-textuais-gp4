import { Modal, Row } from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import React, {Component} from 'react';

class AvisoSessaoExpirada extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            mostrarFormLogin: false
        }
    };

    render() {
        if (this.state.mostrarFormLogin === false) {
            return (
                <Modal show={true}>
                    <Modal.Header>
                        <Modal.Title><FormattedMessage id={"sessao.sessaoExpirada.titulo"}/></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><FormattedMessage id={"sessao.sessaoExpirada.mensagem"}/></p>
                        <p><FormattedMessage id={"sessao.sessaoExpirada.instrucao.mensagem"}/></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            {this.props.telaLogin}
                        </Row>
                    </Modal.Footer>
                </Modal>
            )
        }
    }
}

export default AvisoSessaoExpirada;