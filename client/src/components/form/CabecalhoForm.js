import React from "react";
import { Button, PageHeader } from "antd";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import history from "../../services/history";
import PropTypes from "prop-types";
import {CLIENT_URL} from "../../config";

class CabecalhoForm extends React.Component {


  render() {
    const disabled = this.props.disabled !== undefined ? this.props.disabled : false
    return (
      <div>
        <PageHeader
          ghost={false}
          onBack={() => history.push(CLIENT_URL + this.props.onBack)}
          title={this.props.titulo}
          extra={[
            <div key="cabecalho">
              {!disabled && (this.props.status === undefined || ( this.props.status && this.props.status.toUpperCase() !== "INATIVO" )) ?
                <Button
                  disabled={
                    this.props.disabled !== undefined
                      ? this.props.disabled
                      : false
                  }
                  size="large"
                  loading={this.props.loading}
                  onClick={this.props.onClickSalvar}
                  type="primary"
                >
                  <FormattedMessage id="comum.salvar.label" />
                </Button>
                :
                ""
              }

              {this.props.isEdicao &&
              this.props.status &&
              this.props.onClickAtivar !== null &&
              this.props.status.toUpperCase() !== "ATIVO" && (
                <Button
                  style={{ marginLeft: 10, marginRight: 10 }}
                  onClick={() => this.props.onClickAtivar(this.props.entidade)}
                  size="large"
                >
                  <FormattedMessage id="comum.ativar.label" />
                </Button>
              )}

              {this.props.isEdicao &&
              this.props.status &&
              this.props.onClickAtivar !== null &&
              this.props.status.toUpperCase() === "ATIVO" && (
                <Button
                  style={{ marginLeft: 10, marginRight: 10 }}
                  onClick={this.props.onClickAtivar}
                  type="danger"
                  size="large"
                >
                  <FormattedMessage id="comum.inativar.label" />
                </Button>
              )}

              {this.props.hasPendente &&
              this.props.status &&
              this.props.onClickPendente !== null &&
              this.props.status.toUpperCase() === "ATIVO" && (
                <Button
                  style={{ marginLeft: 10, marginRight: 10 }}
                  onClick={() => {
                    history.replace(CLIENT_URL + this.props.onClickPendente);
                    history.go();
                  }}
                  // type="danger"
                  size="large"
                >
                  <FormattedMessage id="comum.mostrar_pendente.label" />
                </Button>
              )}
              {this.props.clonar &&
              this.props.id &&
              !this.props.isClone && this.props.url &&
              <Button
                style={{marginLeft: 10, marginRight: 10}}
                onClick={() => {
                  history.replace(this.props.url);
                  history.go();
                }}
                size="large"
              >
                <FormattedMessage id={"comum.clonar.label"} />
              </Button>
              }
            </div>
          ]}
        />
      </div>
    );
  }
}

CabecalhoForm.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool
};

CabecalhoForm.defaultProps={
  loading: false
};

export default injectIntl(CabecalhoForm);
