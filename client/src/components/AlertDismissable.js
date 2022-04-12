import React, { Component } from 'react';
import { Alert } from 'antd';
import { FormattedMessage } from 'react-intl';

class AlertDismissable extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);

        this.state = {
            show: true
        };
    }

    handleDismiss() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    render() {
        if (this.state.show) {
            return (
                <Alert onDismiss={this.handleDismiss} bsStyle={this.props.bsStyle}>
                    <FormattedMessage id={this.props.message} />
                </Alert>
            );
        }

        return null
    }
}

export default AlertDismissable;
