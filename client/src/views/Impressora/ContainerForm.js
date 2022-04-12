import React from 'react'
import {Spin} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {injectIntl, intlShape} from "react-intl";
import {prepararNovoRequest, prepararEditarRequest} from "../../store/modules/Impressora/action"
import ImpressoraForm from "./Form";

class ImpressoraContainer extends  React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  };

  render() {
    const { entityInstance, loading, display, error } = this.props.impressora;
    return(
      <>
        <Spin spinning={false}>
          <ImpressoraForm
            id={this.props.match.params.id}
            entityInstance={entityInstance}
            loading={loading}
            getMessage={this.getMessage}
            setEntityInstance={async entityInstance =>
              await this.setState({entityInstance})
            }
            display={display}
            error={error || []}
          />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("impressora.cadastro.titlePage")
    this.getModel();
  }

  getModel = async () => {
    if(this.isImpressoraEdit()) {
      this.props.prepararEditarRequest( this.props.match.params.id)
    } else {
      this.props.prepararNovoRequest()
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id})
  };

  isImpressoraEdit = () => {
    return this.props.match.params && this.props.match.params.id !== undefined
  };

  setEntityInstance = entityInstance => {
    if(entityInstance) {
      this.setState( {entityInstance} );
      return entityInstance
    } else {
      return this.state.entityInstance
    }
  }
}

ImpressoraContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  impressora: store.impressora
});

const mapDispatchToProps = dispatch => bindActionCreators( { prepararNovoRequest, prepararEditarRequest}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ImpressoraContainer)
)
