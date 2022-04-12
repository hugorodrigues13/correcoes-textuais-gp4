import React from 'react';
import {FormattedMessage} from "react-intl";
import {Button } from "react-bootstrap";

class ButtonSalvar extends React.Component {
   
    render() {      
        return (
            <Button bsStyle="primary"
                disabled={this.props.disabled !== undefined ? this.props.disabled : false}
                className="pull-right"
                onClick={this.props.salvar}>                
                <FormattedMessage id={this.props.mensagem}/>
            </Button>
        );
    }
}

export default ButtonSalvar;