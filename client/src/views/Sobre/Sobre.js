import React from 'react';
import 'whatwg-fetch';
import {Row, Col} from "antd";
import {intlShape, injectIntl, FormattedMessage} from 'react-intl';

class Sobre extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            content: ''
        }
    }

    render() {
        return (
            <Col lg={10} md={9} className="container--ajustes container">
                <Row>
                    <h2 className="titulo-pagina ">
                        <FormattedMessage id="sobre.titulo.label"/>
                    </h2>
                        <FormattedMessage id="sobre.conteudo.label"/>
                </Row>
            </Col>
        )
    }
}

Sobre.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(Sobre);
