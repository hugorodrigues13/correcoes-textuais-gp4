import * as React from 'react';
import {FormattedMessage, injectIntl, intlShape} from "react-intl";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Button, PageHeader} from "antd";
import Filter from "../../components/filter/Filter";
import TabelaAnt from "../../components/tabelaAnt/Tabela";
import {getMessage} from "../../components/messages";
import {turnosDeletarRequest, turnosListarRequest} from "../../store/modules/Turno/action";
import {CLIENT_URL} from "../../config";
import history from "../../services/history";

class TurnosList extends React.Component {

  state = {
    entity: [],
    totalCount: 0,
    filterComp: {
      labelCol: {style: {lineHeight: 1}},
      margin: {marginTop: '10px'},
      layout: "vertical",
      prefix: "turnos",
      campos: [
        {nome: "turno", tipo: "text", isSorteable: true},
        {nome: 'horarioInicial', tipo: "rangeTime", isSorteable: true},
        {nome: "horarioFinal", tipo: "rangeTime", isSorteable: true},
        {nome: "duracao", tipo: "rangeTime", isSorteable: true},
        {nome: "dias", tipo: "select", isSorteable: true, ordenar: false, useMessage: false, renderLabel: this.renderDiaSemana, render: (dias) => dias.map(this.renderDiaSemana).join(", ")},
      ],
    },
    filtros: {
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        sort: "turno",
        order: "asc"
      }
    }
  };

  render(){
    const { loading } = this.props.requestManager
    const { data } = this.props.turnos

    return (
      <>
        <PageHeader
          title={<FormattedMessage id={"turnos.title.label"}/>}
          extra={[
            <Button
              key="1"
              type="primary"
              onClick={() => history.push(CLIENT_URL + "/cad/turno/form")}
            >
              <FormattedMessage id={"comum.novoRegistro.label"} />
            </Button>
          ]}
        />

        <Filter
          filterComp={this.state.filterComp}
          filtros={this.state.filtros}
          handlePesquisar={this.handlePesquisar}
          data={data}
          mapPropsToFields={this.mapPropsToFields()}
        />
        <br/>
        <TabelaAnt configTable={this.configTable()} loading={loading}/>
      </>
    )
  }

  componentDidMount() {
    document.title = getMessage("turnos.title.label");
    this.getList()
  }

  configTable = () => {
    const { entities, total } = this.props.turnos.data
    return {
      i18n: "turnos.",
      columns: this.state.filterComp.campos.filter(c => !c.filtro).map(c => ({...c, key: c.nome})),
      data: entities,
      paginacao: {
        total,
        max: this.state.filtros.paginacao.max,
        offset: this.state.filtros.paginacao.offset,
        acao: this.paginacao,
        atualizaRegistrosPorPagina: this.atualizaRegistrosPorPagina
      },
      acoes: {
        editar: this.criaUrlForm,
        excluir: this.deletar
      },
    }
  };

  deletar = objeto => {
    this.props.turnosDeletarRequest(objeto.turnoId, this.getFiltros());
  };

  criaUrlForm = objeto => {
    return CLIENT_URL + "/cad/turno/form/" + objeto.turnoId;
  };

  renderDiaSemana(dia) {
    return getMessage(`turnos.dias.extenso.${dia}.label`)
  }

  // abaixo boilerplate

  getList = () => {
    const filtros = this.getFiltros();
    this.props.turnosListarRequest(filtros)
  };

  handlePesquisar = async values => {
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState( state );
    this.getList()
  };

  atualizaRegistrosPorPagina = quantidadeRegistros => {
    let state = this.state;
    state.filtros.paginacao.max = quantidadeRegistros;
    state.filtros.paginacao.offset = 0;
    this.setState(state);
  };

  paginacao = (offs, sort, order) => {
    let state = this.state;
    state.filtros.paginacao.offset = offs;
    state.filtros.ordenacao.sort = sort;
    state.filtros.ordenacao.order =
      order === "ascend" ? "asc" : order === "descend" ? "desc" : "";
    this.setState(state);
    this.getList()
  }

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset) * max;
    return offset
  }

  getFiltros = () => {
    const {filtros} = this.state;
    let {offset, max} = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const {sort, order} = filtros.ordenacao;
    return {
      ...filtros,
      offset,
      max,
      sort,
      order
    }
  }


  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {

    };
  };

}

TurnosList.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  turnos: store.turnos,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({turnosListarRequest, turnosDeletarRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TurnosList))
