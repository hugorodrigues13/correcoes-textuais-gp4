import moment from "moment";
import {Empty} from "antd";
import {getMessage} from "../../components/messages";
import * as React from "react";

export function  getCorSeta(data, limiteSeparacaoEmHoras) {
  const cinza = "#F5F5F5"
  const amarelo = "#F5F500"
  const vermelho = "#F50000"
  if(data === null) {
    return cinza
  } else {
    const dataPrevisaoSeparacao = moment(data, "DD/MM/YYYY HH:mm")
    const dataAtual = moment()
    const horasRestantes = dataPrevisaoSeparacao.diff(dataAtual, "hour")

    if (dataAtual > dataPrevisaoSeparacao) return vermelho

    if(horasRestantes >= limiteSeparacaoEmHoras) {
      return cinza
    } else { // horasRestantes <= this.props.almoxarifado.data.limiteSeparacaoEmHoras) {
      return amarelo
    }
  }
}

export function getCorTexto(corSeta){
  return corSeta === "#F50000" ? "#FFFFFF" : "#858585"
}

export function getCorTextoSecundaria(corSeta){
  return corSeta === "#F50000" ? "#EEE" : "#858585"
}

export function renderEmpty(){
  return (
    <Empty
      style={{margin: '0 auto', padding: '40px'}}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={getMessage("table.empty.label")}/>
  )
}

const cellBorder = {
  style: 'thin',
  auto: 1
}
const cellStyle = {
  font: {
    sz: 11,
  },
  border: {
    top: cellBorder,
    bottom: cellBorder,
    left: cellBorder,
    right: cellBorder,
  },
  alignment: {
    vertical: 'center',
    horizontal: 'center',
  }
}

export function gerarDadosXls (itens) {
  return ({
    tituloInfo: ['codigo', 'quantidade'].map(it => ({
      title: getMessage(`almoxarifado.excel.coluna.${it}.label`),
      width: {wpx: 215},
      style: {
        ...cellStyle,
        font: {
          bold: true,
          sz: 11,
        }
      },
    })),
    linhasInformacoes: itens.map(it => [
      {value: it.codigoProduto, style: cellStyle},
      {value: it.quantidade, style: cellStyle}
    ]),
    colunas: [],
    linhas: [],
  })
};
