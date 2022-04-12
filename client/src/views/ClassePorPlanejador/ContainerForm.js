import React from 'react'
import {Spin} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {injectIntl, intlShape} from "react-intl";
import {prepararNovoRequest, prepararEditarRequest} from "../../store/modules/ClassePorPlanejador/action"
import ClassePorPlanejadorForm from "./Form";

class ClassePorPlanejadorContainer extends  React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  };

  render() {
    const { entityInstance, loading, error, planejadores } = this.props.classePorPlanejador;

    return(
      <>
        <Spin spinning={false}>
          <ClassePorPlanejadorForm
            id={this.props.match.params.id}
            entityInstance={entityInstance}
            planejadores={planejadores}
            loading={loading}
            getMessage={this.getMessage}
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
    document.title = this.getMessage("classePorPlanejador.cadastro.titlePage")
    this.getModel();
  }

  getModel = async () => {
    if(this.isClassePorPlanejadorEdit()) {
      this.props.prepararEditarRequest( this.props.match.params.id)
    } else {
      this.props.prepararNovoRequest()
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id})
  };

  isClassePorPlanejadorEdit = () => {
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

ClassePorPlanejadorContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  classePorPlanejador: store.classePorPlanejador
});

const mapDispatchToProps = dispatch => bindActionCreators( { prepararNovoRequest, prepararEditarRequest}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ClassePorPlanejadorContainer)
)
