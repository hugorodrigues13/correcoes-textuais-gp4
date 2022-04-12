import {Col, Row} from "antd";
import * as React from 'react';
import Filter from "../../components/filter/Filter";
import { getMessage } from "../../components/messages";
import FiltroAtivavel from "../../components/FiltroAtivavel";
import {bindActionCreators} from "redux";
import {statusSeriaisRequest, seriaisDiaRequest} from "../../store/modules/DashboardProducao/action";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import Alert from "react-s-alert";

class DashFiltros extends React.Component {

  campos = [
    { key: "periodo", nome: "periodo", tipo: "rangeDate", visible: true, isSorteable: true, showTime: true, colProps: {span: 12}, dateFormat: "DD/MM/YYYY HH:mm", format: "HH:mm", value: getMessage("dashboardProducao.periodo.label") },
    { key: "grupoLinhas", nome: "grupoLinhas", tipo: "selectFilter", seletor: 'gruposLinhas', visible: true, isSorteable: true, colProps: {span: 8}, value: getMessage("dashboardProducao.grupoLinhas.label"), tratarStrings: true },
    { key: "turno", nome: "turno", tipo: "selectFilter", seletor: 'turnos', visible: true, isSorteable: true, colProps: {span: 4}, value: getMessage("dashboardProducao.turno.label"), tratarStrings: true },
    { key: "linhaProducao", nome: "linhaProducao", tipo: "selectFilter", seletor: 'linhasProducao', visible: true, isSorteable: true, value: getMessage("dashboardProducao.linhaProducao.label"), tratarStrings: true },
    { key: "grupoRecursos", nome: "grupoRecursos", tipo: "selectFilter", seletor: 'gruposRecursos', visible: true, isSorteable: true, value: getMessage("dashboardProducao.grupoRecursos.label"), tratarStrings: true },
    { key: "recurso", nome: "recurso", tipo: "selectFilter", seletor: 'recursos', visible: true, isSorteable: true, value: getMessage("dashboardProducao.recurso.label"), tratarStrings: true},
  ]

  state = {
    filterComp: {
      labelCol: { style: { lineHeight: 1 } },
      margin: { marginTop: '10px' },
      campos: this.campos,

      layout: "vertical",
      prefix: "dashboardProducao",

    },
    filtros: {
      ...Object.assign({},...this.campos.filter(c => c.visible).map(c => ({[c.key]: ""}))),
      paginacao: {
        offset: 0,
        max: 10
      },
      ordenacao: {
        order: "asc"
      }
    }
  };

  render(){
    const { campos } = this.state.filterComp;
    return (
      <Row gutter={24} style={{marginBottom: 10}}>
        <Col span={24}>
          <Filter
            filterComp={{...this.state.filterComp, campos: this.state.filterComp.campos.filter(c => c.visible)}}
            filtros={this.state.filtros}
            handlePesquisar={this.handlePesquisar}
            mapPropsToFields={this.mapPropsToFields()}
            collapseProps={{
              defaultActiveKey: [],
            }}
            data={this.props.dashboardProducao}
            extra={
              <FiltroAtivavel
                tipo="DASHBOARD_PRODUCAO"
                setVisible={this.setVisible}
                campos={campos}
              />
            }
          />
        </Col>
      </Row>
    )
  }

  getList = () => {
    const filtros = this.getFiltros();
    this.props.statusSeriaisRequest(filtros)
    this.props.seriaisDiaRequest(filtros)
  };

  handlePesquisar = async values => {
    const dates = values.periodo
    if(dates?.length === 2 && dates[0] && dates[1] && dates[1].diff(dates[0], 'days') > 7){
      Alert.error(getMessage("dashboardProducao.form.dataLimite.alert.error"))
      return
    }
    let state = this.state;
    state.filtros = { ...this.state.filtros, ...values };
    state.filtros.paginacao.offset = 0;
    await this.setState(state);
    this.getList();
  };

  getFiltros = () => {
    const { filtros } = this.state;
    let { offset, max } = filtros.paginacao;
    offset = this.getoffset(offset, max);
    const { sort, order } = filtros.ordenacao;
    return {
      ...filtros,
      offset,
      max,
      sort,
      order
    }
  }

  setVisible = (column) => {
    if (!column.visible || this.state.filterComp.campos.filter(c => c.visible).length > 1) {
      this.setState({
        filterComp: {
          ...this.state.filterComp, campos: this.state.filterComp.campos.map(c => {
            if (c.key === column.key) {
              c.visible = !c.visible
            }
            return c
          })
        }
      })
    }
  };

  getoffset = (offset, max) => {
    offset = (offset ? offset - 1 : offset ) * max;
    return offset
  }

  mapPropsToFields = () => {
    const { filtros } = this.state;
    return {
    }
  };

}

const mapStateToProps = store => ({
  dashboardProducao: store.dashboardProducao,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({statusSeriaisRequest, seriaisDiaRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashFiltros))

