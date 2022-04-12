import {Glyphicon, Popover, OverlayTrigger} from "react-bootstrap";
import React, {Component} from 'react';
import {FormattedMessage, injectIntl, intlShape} from 'react-intl';


class MensagensInfo extends Component {

    static propTypes = {
        intl: intlShape.isRequired
    };
    getMessage = (id) => {
        return this.props.intl.formatMessage({id: id})
    };
    render(){
        let popoverClick = (
            <Popover style={{width: "25%"}} id="popover-trigger-click" title={this.getMessage("comum.informacoes.label")}>
                <FormattedMessage id={this.props.message} />
                {this.props.valor ?  ": " + this.props.valor : ""}
                <br/>
                <br/>
                {this.props.exemplo ? <FormattedMessage id={this.props.exemplo}/> : ""}
            </Popover>
        )

        return (
            <OverlayTrigger trigger={"click"} placement={"right"} overlay={popoverClick}>
                <Glyphicon  className="icone-info-messages" glyph="glyphicon glyphicon-question-sign"/>
            </OverlayTrigger>
        )
    }
};
export default injectIntl(MensagensInfo);