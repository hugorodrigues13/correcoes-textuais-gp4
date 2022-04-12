import React from 'react'
import {Spin} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {injectIntl, intlShape} from "react-intl";
import {prepararNovoRequest, prepararEditarRequest} from "../../store/modules/Recurso/action"
import {RecursoForm} from "./Form";

class RecursoContainer extends  React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  };

  render() {
    const { entityInstance, loading, error, listConectores, tiposTeste } = this.props.recurso;
    return(
      <>
        <Spin spinning={false}>
          <RecursoForm
            id={this.props.match.params.id}
            entityInstance={this.setEntityInstance(entityInstance)}
            loading={loading}
            getMessage={this.getMessage}
            tiposTeste={tiposTeste || []}
            listConectores={listConectores || []}
            setEntityInstance={async entityInstance =>
              await this.setState({entityInstance})
            }
            error={error || []}
          />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("recurso.cadastro.titlePage")
    this.getModel();
  }

  getModel = async () => {
    if(this.isRecursoEdit()) {
      this.props.prepararEditarRequest( this.props.match.params.id)
    } else {
      this.props.prepararNovoRequest()
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id})
  };

  isRecursoEdit = () => {
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

RecursoContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  recurso: store.recurso
});

const mapDispatchToProps = dispatch => bindActionCreators( { prepararNovoRequest, prepararEditarRequest}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RecursoContainer)
)
