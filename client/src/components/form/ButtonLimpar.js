import React from 'react';
import {FormattedMessage} from "react-intl";
import {Button} from "react-bootstrap";

class ButtonLimpar extends React.Component {
   
    render() {      
        return (
            <Button bsStyle="default" className="pull-right" onClick={this.props.limpar}>
                <FormattedMessage id={this.props.message}/>
            </Button>
        );
    }
}

export default ButtonLimpar;