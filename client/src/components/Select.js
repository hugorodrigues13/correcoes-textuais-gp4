import {Component} from "react";
import {FormControl} from "react-bootstrap";
import React from "react";

class Select extends Component {
    getMessage = (id) => {
        return this.props.intl.formatMessage({id: id})
    };
    render () {
        if(this.props.multiple){
        return (
            <FormControl
                componentClass="select" multiple onChange={this.props.onChange} defaultValue={this.props.default} value={this.props.value}>
                { this.props.options !== undefined &&
                    this.props.options.map( (object) => {
                        return <option value={object.key} key={object.key}>{object.value}</option>
                    })
                }

            </FormControl>
        )
        }else{
            return (
                <FormControl
                    componentClass="select" onChange={this.props.onChange} defaultValue={this.props.default} value={this.props.value} disabled={this.props.disabled}>
                    { this.props.options !== undefined &&
                    this.props.options.map( (object) => {
                        return <option value={object.key} key={object.key}>{object.value}</option>
                    })
                    }

                </FormControl>
            )
        }
    }
}

export default Select;