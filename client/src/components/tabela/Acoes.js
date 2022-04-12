import React from "react";
import { Col } from "react-bootstrap";
import JanelaConfirmacao from "../JanelaConfirmacao";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuditInfo from "./AuditInfo";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { injectIntl } from "react-intl";

class Acoes extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.mostrarConfirm = this.mostrarConfirm.bind(this);
    this.fecharConfirm = this.fecharConfirm.bind(this);
    this.deletarInstancia = this.deletarInstancia.bind(this);
    this.ativarOuDesativar = this.ativarOuDesativar.bind(this);
    this.state = {
      isExibirConfirmar: false
    };
  }

  fecharConfirm() {
    this.setState({ isExibirConfirmar: false });
  }

  mostrarConfirm() {
    this.setState({ isExibirConfirmar: true });
  }

  deletarInstancia() {
    this.props.acoes.excluir(this.props.objeto.id);
    this.fecharConfirm();
  }
  ativarOuDesativar() {
    this.props.acoes.ativarOuDesativar(this.props.objeto.id);
    this.fecharConfirm();
  }
  desabilitaBotaoRemocao = () => {
    let hasEnabled = this.props.objeto.enabled !== undefined;
    if (hasEnabled) {
      return !this.props.objeto.enabled || !this.props.objeto.isRemovivel;
    } else {
      return !this.props.objeto.isAtivo && !this.props.objeto.isRemovivel;
    }
  };

  desabilitaBotaoEdicao = () => {
    return this.props.objeto.isEditavel === false;
  };

  editar = () => {
    return this.props.acoes.editar(this.props.objeto);
  };
  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  render() {
    return (
      <Col md={this.props.col}>
        {this.props.exibirAuditInfo ? (
          <AuditInfo objeto={this.props.objeto} />
        ) : null}
        {this.props.acoes.excluir !== undefined ? (
          <button
            disabled={this.desabilitaBotaoRemocao()}
            className="botao-acao alinhamento-bt-acao fix-width-button-disabled"
            onClick={this.mostrarConfirm}
          >
            <FontAwesomeIcon icon="trash" />
          </button>
        ) : (
          ""
        )}
        <Link
          disabled={this.desabilitaBotaoEdicao()}
          className="botao-acao alinhamento-bt-acao fix-width-button-disabled"
          to={this.editar()}
          style={{ padding: "4px 5px 4px 8px" }}
        >
          <FontAwesomeIcon icon="edit" />
        </Link>

        {this.props.acoes.ativarOuDesativar !== undefined &&
        (this.props.objeto.enabled !== undefined ||
          this.props.objeto.isAtivo !== undefined) ? (
          !this.props.objeto.enabled || !this.props.objeto.isAtivo ? (
            <button
              data-tip={this.getMessage("comum.ativar.label")}
              className="botao-acao alinhamento-bt-acao fix-width-button-disabled"
              onClick={() =>
                this.props.acoes.ativarOuDesativar(this.props.objeto)
              }
            >
              <FontAwesomeIcon icon="check-circle" />
            </button>
          ) : (
            ""
          )
        ) : this.props.acoes.ativarOuDesativar !== undefined ? (
          <button
            data-tip={
              this.props.objeto.isAtivo === false ||
              this.props.objeto.enabled === false
                ? this.getMessage("comum.ativar.label")
                : this.getMessage("comum.desativar.label")
            }
            className="botao-acao alinhamento-bt-acao fix-width-button-disabled"
            onClick={() =>
              this.props.acoes.ativarOuDesativar(this.props.objeto)
            }
          >
            <FontAwesomeIcon
              icon={
                this.props.objeto.isAtivo === false ||
                this.props.objeto.enabled === false
                  ? "check-circle"
                  : "times-circle"
              }
            />
          </button>
        ) : (
          ""
        )}

        <ReactTooltip place="top" type="dark" effect="float" />
        <JanelaConfirmacao
          mostrar={this.state.isExibirConfirmar}
          isRemovivel={this.props.objeto.isRemovivel}
          ativarOuDesativar={this.ativarOuDesativar}
          objeto={this.props.objeto}
          fecharConfirm={this.fecharConfirm}
          mostrarConfirm={this.mostrarConfirm}
          deletarInstancia={this.deletarInstancia}
        />
      </Col>
    );
  }
}

export default injectIntl(Acoes);
