import React from "react";
import {Row, Col} from "antd";
import {intlShape, injectIntl, FormattedMessage} from "react-intl";
import {connect} from "react-redux"
import {listDashboardProducaoRequest, seriaisDiaRequest, statusSeriaisRequest, indicadoresRequest} from "../../store/modules/DashboardProducao/action";

import './style.css';
import {bindActionCreators} from "redux";
import Indicadores from "./Indicadores";
import StatusDosSeriais from "./StatusDosSeriais";
import ProducaoUltimas24Horas from "./ProducaoUltimas24Horas";
import DashFiltros from "./DashFiltros";

class Dashboard extends React.Component {
  state = {
  };

  render() {
    return (
      <>
        <Row gutter={24}>
          <Col span={24}>
            <h2 className="titulo-pagina ">
              <FormattedMessage id="menu.dashboardProducao.label"/>
            </h2>
          </Col>
        </Row>
        <DashFiltros/>
        <Row gutter={24}>
          <Col span={17}>
            <h3 className="titulo-pagina " style={{padding: '0 40px 0 15px'}}>
              Quantidade de peças apontadas
            </h3>
            <ProducaoUltimas24Horas />
          </Col>
          <Col span={7}>
            <h3 className="titulo-pagina ">
              Status dos Seriais
            </h3>
            <StatusDosSeriais />

          </Col>
        </Row>
        <h3 className="titulo-pagina ">
          Indicadores
        </h3>
        <Row gutter={12}>
          <Indicadores />
        </Row>
      </>
    );
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    this.props.listDashboardProducaoRequest();
    this.props.indicadoresRequest();
    this.props.seriaisDiaRequest({});
    this.props.statusSeriaisRequest({});
  };
}

Dashboard.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  dashboardProducao: store.dashboardProducao,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({listDashboardProducaoRequest, indicadoresRequest, statusSeriaisRequest, seriaisDiaRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
