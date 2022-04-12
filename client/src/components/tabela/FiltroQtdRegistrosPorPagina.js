import React, { Component} from 'react';
import {ControlLabel} from "react-bootstrap";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Select from "../form/Select";

class FiltroQtdRegistrosPorPagina extends Component {

    static propTypes = {
        atualizar: PropTypes.func.isRequired,
    };

    options = [{
        key: 6,
        value:6
    },{
        key: 9,
        value:9
    },{
        key: 12,
        value:12
    },{
        key: 100,
        value: 100
    }];

    atualizaQuantidade = (e) => {
        if(this.props.atualizar) {
            this.props.atualizar(e.target.value)
        }
    };

    render () {
        return (
            <div>
                <ControlLabel><FormattedMessage id="comum.registrosPorPagina.label" />:</ControlLabel>
                <Select options={this.options} onChange={this.atualizaQuantidade}/>
            </div>
        );
    }
}

export default FiltroQtdRegistrosPorPagina;