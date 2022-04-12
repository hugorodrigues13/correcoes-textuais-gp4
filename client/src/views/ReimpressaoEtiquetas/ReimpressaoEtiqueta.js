import * as React from 'react';
import {bindActionCreators} from "redux";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import {
  reimpressaoEtiquetasGetImpressorasRequest,
  reimpressaoEtiquetasReimprimirRequest
} from "../../store/modules/ReimpressaoEtiquetas/action";
import {PageHeader, Spin} from "antd";
import history from "../../services/history";
import {CLIENT_URL} from "../../config";
import {getMessage} from "../../components/messages";
import ReimpressaoForm from "./Form";

class ReimpressaoEtiquetas extends React.Component {

  componentDidMount = () => {
    document.title = getMessage("menu.reimpressaoEtiquetas.label")
    this.props.reimpressaoEtiquetasGetImpressorasRequest()
  };

  onFinish = (values) => {
    this.props.reimpressaoEtiquetasReimprimirRequest(values)
  };

  render(){
    const { loading } = this.props.requestManager
    const { impressoras, dadosLotes } = this.props.reimpressaoEtiquetas

    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => history.push(CLIENT_URL + "/")}
          title={getMessage("menu.reimpressaoEtiquetas.label")}
        />
        <Spin spinning={loading}>
            <ReimpressaoForm
              onFinish={this.onFinish}
              impressoras={impressoras}
              dadosLotes={dadosLotes}
            />
        </Spin>
      </>
    )
  }

}

const mapStateToProps = store => ({
  reimpressaoEtiquetas: store.reimpressaoEtiquetas,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({reimpressaoEtiquetasReimprimirRequest, reimpressaoEtiquetasGetImpressorasRequest}, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReimpressaoEtiquetas))
