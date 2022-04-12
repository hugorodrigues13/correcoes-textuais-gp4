import {injectIntl, intlShape} from "react-intl";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import React from "react";
import {PageHeader, Spin} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import Busca from "./Busca";
import List from "./List";
import {listAlmoxarifadoRequest} from "../../store/modules/Almoxarifado/action";
import ControleMateriais from "./ControleDeMateriais/ControleMateriais";

class Almoxarifado extends React.Component {

  componentDidMount() {
    document.title = getMessage("almoxarifado.title.label");
    this.props.listAlmoxarifadoRequest()
  }

  render() {
    const loading = this.props.requestManager.loading

    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => history.push(CLIENT_URL + "/")}
          title={getMessage("almoxarifado.title.label")}
        />
        <Spin spinning={loading}>
          <Busca/>
          <List/>
          <ControleMateriais/>
        </Spin>
      </>
    )
  }
}

Almoxarifado.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  almoxarifado: store.almoxarifado,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({listAlmoxarifadoRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Almoxarifado))
