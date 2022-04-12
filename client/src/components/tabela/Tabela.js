import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";

import Pagination from "react-js-pagination";
import FiltroOrdenacao from "../tabela/FiltroOrdenacao";
import FiltroQtdRegistrosPorPagina from "../tabela/FiltroQtdRegistrosPorPagina";
import LinhaTabela from "../tabela/LinhaTabela";

class Tabela extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  getFiltroQtdRegistros = () => {
    if (this.props.config.paginacao.total) {
      return (
        <Col md={3} className="pull-left">
          <FiltroQtdRegistrosPorPagina
            atualizar={this.props.config.dados.acoes.atualizaRegistrosPorPagina}
          />
        </Col>
      );
    } else {
      return null;
    }
  };

  getFiltroOrdenacao = () => {
    if (this.props.config.ordenacao.filtro) {
      return (
        <div className="pull-right">
          <FiltroOrdenacao
            orderDefault={this.props.config.ordenacao.orderDefault}
            sortDefault={this.props.config.ordenacao.sortDefault}
            ordenar={this.props.config.ordenacao.acao}
            opcoes={this.props.config.ordenacao.filtro}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  getPaginacao = () => {
    return (
      <div className="text-center">
        <Pagination
          activePage={this.props.config.paginacao.offset}
          totalItemsCount={this.props.config.paginacao.total}
          itemsCountPerPage={this.props.config.paginacao.max}
          onChange={this.props.config.paginacao.acao}
        />
      </div>
    );
  };

  setColunasExibir = () => {
    let keys = this.props.config.dados.colunasExibir;
    if (keys === undefined || keys.length === 0) {
      let objetos = this.props.config.dados.lista;
      if (objetos && objetos.length > 0) {
        let objeto = this.props.config.dados.lista[0];
        let colunasOcultas = this.props.config.dados.colunasOcultas;
        if (keys === undefined || keys.length === 0) {
          keys = Object.keys(objeto);
        }
        if (colunasOcultas && colunasOcultas.length > 0) {
          keys = keys.filter(item => !colunasOcultas.includes(item));
        }
        this.props.config.dados.colunasExibir = keys;
      }
    }
  };

  getTableHeader = () => {
    let objetos = this.props.config.dados.lista;
    if (objetos && objetos.length > 0) {
      let keys = this.props.config.dados.colunasExibir;
      keys = keys.slice(0, 12);
      return (
        <thead>
          <tr>
            {keys.map((key, i) => {
              let keyi18n =
                this.props.config.dados.prefixoI18n + key + ".label";
              return (
                <th style={key === "campo" ? { width: "25%" } : null} key={i}>
                  <label>
                    <FormattedMessage id={keyi18n} />
                  </label>
                </th>
              );
            })}
            {this.props.config.exibirColunaStatus ? (
              <th width="18%">
                <label>
                  <FormattedMessage id="comum.status.label" />
                </label>
              </th>
            ) : null}
            {this.props.config.exibirColunaAcoes ? (
              <th width="18%">
                <label>
                  <FormattedMessage id="comum.acoes.label" />
                </label>
              </th>
            ) : (
              <th width="4%">
                <FormattedMessage id="comum.acoes.label" />
              </th>
            )}
          </tr>
        </thead>
      );
    }
  };

  render() {
    this.setColunasExibir();
    if (
      this.props.config.dados.lista !== undefined &&
      this.props.config.dados.lista.length > 0
    ) {
      this.props.config.dados.lista = this.props.config.dados.lista.sort(
        function(a, b) {
          return a.identificador < b.identificador
            ? -1
            : a.identificador > b.identificador
            ? 1
            : 0;
        }
      );
      return (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <Row>
              {this.getFiltroQtdRegistros()}
              {this.getFiltroOrdenacao()}
            </Row>
          </div>
          <Table striped bordered condensed hover>
            {this.getTableHeader()}
            <tbody>
              {this.props.config.dados.lista.map((objeto, i) =>
                React.createElement(LinhaTabela, {
                  objeto: objeto,
                  key: objeto.id || i,
                  acoes: this.props.config.dados.acoes,
                  exibirAuditInfo: this.props.config.exibirAuditInfo,
                  exibirColunaAcoes: this.props.config.exibirColunaAcoes,
                  exibirColunaStatus: this.props.config.exibirColunaStatus,
                  colunasExibir: this.props.config.dados.colunasExibir,
                  onView: this.props.config.dados.acoes.view
                })
              )}
            </tbody>
          </Table>
          {this.getPaginacao()}
        </div>
      );
    } else {
      return (
        <Row>
          <div className="col-md-12 col-sm-12">
            <FormattedMessage
              id={
                this.props.config.dados.mensagemSemRegistros === undefined
                  ? "comum.semRegistros.mensagem"
                  : this.props.config.dados.mensagemSemRegistros
              }
            />
          </div>
        </Row>
      );
    }
  }
}

export default injectIntl(Tabela);
