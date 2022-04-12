import React, {Component} from 'react';
import {
    Button,
    Glyphicon,
    FormGroup,
    Col,
    ControlLabel
} from 'react-bootstrap';
import Select from "../form/Select";
import {FormattedMessage} from "react-intl";

class FiltroOrdenacao extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            sort: props.sortDefault,
            order: props.orderDefault,
            glyphname: "sort-by-alphabet"
        };
    }

    handleSort = (e) => {
        let state = this.state;
        state.sort = e.target.value;
        this.setState(state);
        this.ordenar();
    };

    handleOrder = () => {
        let state = this.state;
        state.order = state.order === "asc" ? "desc" : "asc";
        this.setState(state);
        this.ordenar()
    };

    ordenar(){
        if(this.props.ordenar) {
            this.props.ordenar(this.state.sort, this.state.order)
        }
    };

    getGlyphName = () => {
        return this.state.order === "asc" ? "sort-by-alphabet" : "sort-by-alphabet-alt";
    };

    render() {
        return (
            <Col md={12}>
                <Col md={9}>
                    <ControlLabel><FormattedMessage id="comum.ordenacao.label"/>:</ControlLabel>
                    <Select default={this.props.sortDefault} onChange={this.handleSort} options={this.props.opcoes}/>
                </Col>
                <Col md={3}>
                    <FormGroup>
                        <ControlLabel><FormattedMessage id="comum.ordem.label"/> </ControlLabel>
                        <Button bsStyle={'link'} onClick={this.handleOrder}><Glyphicon glyph={this.getGlyphName()} /></Button>
                    </FormGroup></Col>
            </Col>
        );
    }
}

export default FiltroOrdenacao;