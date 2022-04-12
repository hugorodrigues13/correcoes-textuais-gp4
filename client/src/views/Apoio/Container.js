import React from 'react'
import {Spin} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {injectIntl, intlShape} from "react-intl";
import {buscarGruposLinhasDeProducaoRequest} from "../../store/modules/Apoio/action"
import Apoio from "./index";
import HTML5Backend from "react-dnd-html5-backend";
import {DndProvider} from 'react-dnd';
import {getMessage} from "../../components/messages";



class ApoioContainer extends React.PureComponent {

  render() {
    const {gruposLinhasDeProducao, loadingGrupos} = this.props.apoio;
    const { loading } = this.props.requestManager;

    return (
      <>
        <DndProvider backend={HTML5Backend}>

          <Spin spinning={loadingGrupos}>
            <Apoio
              getMessage={this.getMessage}
              gruposLinhasDeProducao={gruposLinhasDeProducao}
            />
          </Spin>

        </DndProvider>
      </>
    )
  }

  componentDidMount() {
    document.title = getMessage("apoio.title.label");
    this.getModel().then(r => r);
  }

  getModel = async () => {
    this.props.buscarGruposLinhasDeProducaoRequest()
  };

  getMessage = id => {
    return this.props.intl.formatMessage({id: id})
  };
}

ApoioContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  apoio: store.apoio,
  requestManager: store.requestManager
});

const mapDispatchToProps = dispatch => bindActionCreators({buscarGruposLinhasDeProducaoRequest}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ApoioContainer)
)
