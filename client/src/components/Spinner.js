import React, { Component } from "react";
import { Modal } from "antd";
import { intlShape, injectIntl, FormattedMessage } from "react-intl";

class Spinner extends Component {
  render() {
    const spinnerStyle = {
      position: "absolute",
      marginLeft: "calc(50% - 51px)",
      marginTop: "calc(50% - 51px)"
    };

    const messageStyle = {
      textAlign: "center",
      color: "white",
      marginTop: "133px",
      marginLeft: "-221px",
      width: "550px"
    };
    return (
      (this.props.isSendingRequest === true ||
        this.props.loadingInfinito === true) && (
        <Modal backdropStyle={{ zIndex: 1040 }} show={true}>
          <div className="lds-default" style={spinnerStyle}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            {this.props.message ? (
              <h4 style={messageStyle}>
                <FormattedMessage id={this.props.message} />
              </h4>
            ) : (
              ""
            )}
          </div>
        </Modal>
      )
    );
  }
}

Spinner.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(Spinner);
