import React from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {injectIntl, intlShape} from "react-intl";
import {Spin} from "antd";
import {FormFornecedor} from "./Form";
import {prepararEditarRequest} from "../../store/modules/PrefixoProducaoFornecedor/action";

class FornecedorContainer extends React.PureComponent {
  state = {
    entityInstance: {},
    errors: []
  }

  render() {
    const { entityInstance, loading, error, desabilitarPrefixo } = this.props.fornecedor;
    return (
      <>
        <Spin spinning={false}>
          <FormFornecedor
            id={this.props.match.params.id}
            entityInstance={this.setEntityInstance(entityInstance)}
            loading={loading}
            getMessage={this.getMessage}
            setEntityInstance={ async entityInstance =>
              await this.setState({entityInstance})
            }
            desabilitarPrefixo={desabilitarPrefixo}
            error={error || []}
          />
        </Spin>
      </>
    )
  }

  componentDidMount() {
    document.title = this.getMessage("prefixoProducaoFornecedor.cadastro.titlePage")
    this.getModel().then(() => {})
  }

  getModel = async () => {
    if(this.isFornecedorEdit()) {
      const {prepararEditarRequest} = this.props;
      prepararEditarRequest( this.props.match.params.id )
    }
  };

  getMessage = id => {
    return this.props.intl.formatMessage({ id: id})
  };

  isFornecedorEdit = () => {
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

FornecedorContainer.propTypes = {
  intl: intlShape.isRequired
};

const mapStateToProps = store => ({
  fornecedor: store.prefixoProducaoFornecedor
});

const mapDispatchToprops = dispatch => bindActionCreators( {prepararEditarRequest }, dispatch);

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToprops
  )(FornecedorContainer)
)
