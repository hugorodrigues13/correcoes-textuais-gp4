import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class GeraXLS extends Component {
  render() {
    let dados = [
      {
        columns: this.props.dados.tituloInfo,
        data: this.props.dados.linhasInformacoes
      },
      {
        ySteps: 2, //will put space of 5 rows,
        columns: this.props.dados.colunas,
        data: this.props.dados.linhas
      }
    ];
    return (
      <ExcelFile element={this.props.element} filename={this.props.nomeArquivo}>
        <ExcelSheet dataSet={dados} name={this.props.nomeFolha}></ExcelSheet>
      </ExcelFile>
    );
  }
}

GeraXLS.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(GeraXLS);
