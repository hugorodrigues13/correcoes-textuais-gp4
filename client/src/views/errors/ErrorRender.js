import React, {Component} from 'react';
import {intlShape, injectIntl, FormattedMessage} from 'react-intl';
import {CLIENT_URL} from "../../config";
import { Row, Col} from 'antd';
import { Link } from "react-router-dom";

class ErrorRender extends Component{

    render(){
        return(
            <Col style={{paddingTop: 50}} className="container--ajustes container"  md={9} lg={10}>
                <Row className="margin-bottom-10">
                    <Col md={5} style={{color:"#b9b9b9"}}>
                        <h1 style={{textAlign:"center", fontSize:"1000%"}}><FormattedMessage id="error500.title"/></h1>
                        <h3 style={{textAlign:"center", paddingTop: "20px", borderTop: "#b9b9b9 solid 3px"}}><FormattedMessage id="erro.erroInesperado.mensagem"/></h3>
                    </Col>
                    <Col md={7}>
                        <img className="logo-menu" alt="logo-gif" src={require('../../images/server_out.png')} />
                    </Col>
                </Row>
                <Row style={{margin: "50px"}}>
                    <Col md={12}>
                        <div style={{textAlign:"center"}} >
                            <Link className="primario botao-titulo" to={CLIENT_URL + "/"}>
                                <FormattedMessage id="home.link"/>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Col>
        );
    }
}

ErrorRender.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(ErrorRender);
