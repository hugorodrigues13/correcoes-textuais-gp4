import React, {Component} from 'react';
import {intlShape, injectIntl, FormattedMessage} from 'react-intl';
import {CLIENT_URL} from "../../config";
import {Row, Col, Button} from 'antd';
import { Link } from "react-router-dom";

class Error404 extends Component{

    render(){
        return(
          <div>
                <Row gutter={24} className="margin-bottom-10">
                    <Col md={10} style={{color:"#b9b9b9"}}>
                        <h1 style={{textAlign:"center", fontSize:"1000%"}}><FormattedMessage id="error404.title"/></h1>
                        <h3 style={{textAlign:"center", paddingTop: "20px", borderTop: "#b9b9b9 solid 3px"}}><FormattedMessage id="error404.message"/></h3>
                    </Col>
                    <Col md={14}>
                        <img className="logo-menu" alt="logo-gif" src={require('../../images/error_404.png')} />
                    </Col>
                </Row>
                <Row style={{margin: "50px"}}>
                    <Col md={24}>
                        <div style={{textAlign:"center"}} >
                            <Link className="primario botao-titulo" to={CLIENT_URL + "/"}>
                                <FormattedMessage id="home.link"/>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

Error404.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(Error404);
