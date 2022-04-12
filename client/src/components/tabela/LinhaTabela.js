import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import Acoes from "./Acoes";

class LinhaTabela extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onChange: false
    };
  }

  handleUpdate = (tokens, objeto) => {
    let data = {};
    data.list = tokens.map((token, index) => {
      return { valor: token.value, index: index };
    });
    data.campo = objeto.campo;

    this.props.handleUpdate(data);
  };

  customEdit = e => {
    let state = this.state;
    state.onChange = true;
    this.setState(state);
  };

  getTableCols = () => {
    let objeto = this.props.objeto;
    let keys = this.props.colunasExibir;
    keys = keys.slice(0, 12);
    return (
      <tr>
        {keys.map((key, i) => {
          if (i < keys.length) {
            if (key === "isAtivo") {
              let keyI18n =
                objeto[key] === true
                  ? "comum.ativo.label"
                  : "comum.inativo.label";
              return (
                <td key={i}>
                  <FormattedMessage id={keyI18n} />
                </td>
              );
            } else if (
              key === "data" ||
              key === "dataCriacao" ||
              key === "dataAtualizacao"
            ) {
              return <td key={i}>{new Date(objeto[key]).toLocaleString()}</td>;
            } else if (typeof objeto[key] === "boolean") {
              let keyI18n =
                objeto[key] === true ? "comum.sim.label" : "comum.nao.label";
              return (
                <td key={i}>
                  <FormattedMessage id={keyI18n} />
                </td>
              );
            } else if (key === "tipoLogOperacao") {
              return (
                <td key={i}>
                  <FormattedMessage id={objeto[key].name} />
                </td>
              );
            }
            return (
              <td key={i}>
                {objeto[key]}
              </td>
            );
            //
          }
          return null;
        })}
        {this.props.exibirColunaStatus === true ? (
          <td width="18%">
            {objeto.enabled === true || objeto.isAtivo ? (
              <Badge style={{ backgroundColor: "green" }}>
                <FormattedMessage id="comum.ativo.label" />
              </Badge>
            ) : (
              <Badge style={{ backgroundColor: "#EA2C3F" }}>
                <FormattedMessage id="comum.inativo.label" />
              </Badge>
            )}
          </td>
        ) : null}
        {this.props.exibirColunaAcoes ? (
          <td width="18%">
            <Acoes
              acoes={this.props.acoes}
              showAuditInfo={this.props.exibirAuditInfo}
              objeto={this.props.objeto}
            />
          </td>
        ) : (
          <td>
            <span
              onClick={() => this.props.onView(this.props.objeto)}
              className="icone-info-blocos glyphicon glyphicon-info-sign"
            ></span>
          </td>
        )}
      </tr>
    );
  };

  render() {
    return this.getTableCols();
  }
}

export default LinhaTabela;
