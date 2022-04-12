import React, { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

class ButtonVoltar extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.url ? (
          <Link className="btn btn-default pull-right" to={this.props.url}>
            <FormattedMessage id="comum.voltar.label" />
          </Link>
        ) : (
          <button
            className="btn btn-default pull-right"
            onClick={this.props.onClick}
          >
            <FormattedMessage id="comum.voltar.label" />
          </button>
        )}
      </Fragment>
    );
  }
}

export default ButtonVoltar;
