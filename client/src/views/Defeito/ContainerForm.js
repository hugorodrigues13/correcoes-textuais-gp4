import React from 'react'
import {bindActionCreators} from "redux";
import {connect} from "react-redux"
import {injectIntl, intlShape} from "react-intl";
import {Spin} from "antd";
import {DefeitoForm} from "./Form"
import { prepararNovoRequest, prepararEditarRequest } from "../../store/modules/Defeito/Action"

class DefeitoContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  }

  render() {
    const { entityInstance, loading, error, listGrupoRecurso } = this.props.defeito;
    return (
      <>
        <Spin spinning={false}>
          <DefeitoForm
            id={this.props.match.params.id}
            entityInstance={this.setEntityInstance(entityInstance)}
            loading={loading}
            getMessage={this.getMessage}
            listGrupoRecurso={ listGrupoRecurso || []}
            setEntityInstance={ async entityInstance =>
              await this.setState({entityInstance})
            }
            error={error || []}
          />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("defeito.cadastro.titlePage")
    this.getModel()
  }

  getModel = async () => {
    if(this.isDefeitoEdit()) {
      this.props.prepararEditarRequest( this.props.match.params.id )
    } else {
      this.props.prepararNovoRequest()
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id})
  };

  isDefeitoEdit = () => {
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

DefeitoContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  defeito: store.defeito
});

const mapDispatchToprops = dispatch => bindActionCreators( {prepararNovoRequest, prepararEditarRequest }, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToprops
  )(DefeitoContainer)
)
