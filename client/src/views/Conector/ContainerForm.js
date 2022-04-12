import React from 'react';
import {Form, Spin} from "antd";
import {ConectorForm} from "./Form";
import {bindActionCreators} from "redux";
import {
  conectorPrepararNovoRequest,
  conectorPrepararEditarRequest,
  conectorSetEntity
} from "../../store/modules/Conector/action"
import {injectIntl, intlShape} from "react-intl";
import {connect} from "react-redux";

class ConectorContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    originalEntity: {
      descricao: "",
      linhaForecast: "",
      formacao: 0
    },
  };

  render() {
    const { entityInstance, loading, error} = this.props.conector;

    return(
      <>
        <Spin spinning={false}>
          <ConectorForm
            id={this.props.match.params.id}
            entityInstance={entityInstance}
            loading={loading}
            getMessage={this.getMessage}
            setEntityInstance={ entityInstance =>
              this.props.conectorSetEntity(entityInstance)
            }
            error={error || []}
          />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("conector.cadastro.titlePage")
    this.getModel();
  }

  getModel = async () => {
    if(this.isConectorEdit()) {
      this.props.conectorPrepararEditarRequest(this.props.match.params.id)
    } else {
      this.props.conectorPrepararNovoRequest()
    }
  };

  setEntityInstanceReducer = entityInstance => {
    if(entityInstance){
      this.setState( {entityInstance} );
      return entityInstance
    } else {
      return this.state.entityInstance
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id });
  };

  isConectorEdit = () => {
      return this.props.match.params && this.props.match.params.id !== undefined;
  };
}
ConectorContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  conector: store.conector,
});

const mapDispatchToProps = dispatch => bindActionCreators( { conectorPrepararNovoRequest, conectorPrepararEditarRequest, conectorSetEntity}, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConectorContainer)
)
